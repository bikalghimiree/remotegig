import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import Stripe from "stripe";
import { op } from "@/lib/openpanel";

function safePeriodEnd(sub: unknown): string | null {
  const s = sub as Record<string, unknown>;
  const val = s.current_period_end;
  if (typeof val === "number" && val > 0) {
    return new Date(val * 1000).toISOString();
  }
  return null;
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sql = getDb();

  try {
    switch (event.type) {
      // ── Checkout completed (subscription + one-time) ──
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id || session.metadata?.userId;

        if (!userId) break;

        // ── Credit purchase (one-time payment) ──
        if (session.metadata?.type === "credits") {
          const creditAmount = parseInt(session.metadata.credits || "0");
          if (creditAmount > 0) {
            await sql`UPDATE subscriptions SET credits = credits + ${creditAmount} WHERE user_id = ${userId}`;
          }
          break;
        }

        // ── Subscription checkout ──
        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await sql`INSERT INTO subscriptions (user_id, plan, status, billing_interval, stripe_subscription_id, stripe_customer_id, current_period_end)
            VALUES (${userId}, 'pro', 'active', 'monthly', ${subscription.id}, ${session.customer as string}, ${safePeriodEnd(subscription)})
            ON CONFLICT (user_id) DO UPDATE SET
              plan = 'pro',
              status = 'active',
              billing_interval = 'monthly',
              stripe_subscription_id = ${subscription.id},
              stripe_customer_id = ${session.customer as string},
              current_period_end = ${safePeriodEnd(subscription)}`;

          op.revenue(session.amount_total || 1400, { profileId: userId, plan: "pro", currency: "USD" });
          op.track("checkout_success", { profileId: userId, plan: "pro" });
        }
        break;
      }

      // ── Subscription renewed (invoice paid) ──
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subId = (invoice as any).subscription as string | null;
        if (!subId) break;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const billingReason = (invoice as any).billing_reason;
        if (billingReason !== "subscription_cycle") break;

        const subscription = await stripe.subscriptions.retrieve(subId) as unknown as Stripe.Subscription;
        const userId = subscription.metadata?.user_id || subscription.metadata?.userId;
        if (!userId) break;

        await sql`UPDATE subscriptions SET current_period_end = ${safePeriodEnd(subscription)} WHERE user_id = ${userId}`;
        break;
      }

      // ── Subscription updated ──
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id || subscription.metadata?.userId;
        if (!userId) break;

        const status = subscription.status === "active" ? "active" : "canceled";
        await sql`UPDATE subscriptions SET status = ${status}, current_period_end = ${safePeriodEnd(subscription)} WHERE user_id = ${userId}`;
        break;
      }

      // ── Subscription canceled ──
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id || subscription.metadata?.userId;
        if (!userId) break;

        await sql`UPDATE subscriptions SET plan = 'free', status = 'canceled', stripe_subscription_id = NULL, billing_interval = NULL, current_period_end = NULL WHERE user_id = ${userId}`;

        op.track("subscription_canceled", { profileId: userId });
        break;
      }

      // ── Payment failed ──
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subId = (invoice as any).subscription as string | null;
        if (!subId) break;

        const subscription = await stripe.subscriptions.retrieve(subId) as unknown as Stripe.Subscription;
        const userId = subscription.metadata?.user_id || subscription.metadata?.userId;
        if (!userId) break;

        await sql`UPDATE subscriptions SET status = 'past_due' WHERE user_id = ${userId}`;

        op.track("payment_failed", { profileId: userId });
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
