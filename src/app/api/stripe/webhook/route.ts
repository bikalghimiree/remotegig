import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import { op } from "@/lib/openpanel";
import Stripe from "stripe";

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
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id || session.metadata?.userId;
        if (!userId) break;

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await sql`INSERT INTO subscriptions (user_id, plan, status, stripe_subscription_id, stripe_customer_id)
            VALUES (${userId}, 'pro', 'active', ${subscription.id}, ${session.customer as string})
            ON CONFLICT (user_id) DO UPDATE SET
              plan = 'pro',
              status = 'active',
              stripe_subscription_id = ${subscription.id},
              stripe_customer_id = ${session.customer as string},
              updated_at = now()`;

          // Analytics: track revenue + conversion
          op.track("checkout_completed", { profileId: userId, plan: "pro", amount: session.amount_total || 900 });
          op.track("revenue", { profileId: userId, amount: (session.amount_total || 900) / 100, currency: "USD", plan: "pro" });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id || subscription.metadata?.userId;
        if (!userId) break;

        const status = subscription.status === "active" ? "active" : "canceled";
        await sql`UPDATE subscriptions SET status = ${status}, updated_at = now() WHERE stripe_subscription_id = ${subscription.id}`;

        op.track("subscription_updated", { profileId: userId, status });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id || subscription.metadata?.userId;

        await sql`UPDATE subscriptions SET plan = 'free', status = 'canceled', stripe_subscription_id = NULL, updated_at = now() WHERE stripe_subscription_id = ${subscription.id}`;

        if (userId) op.track("subscription_canceled", { profileId: userId });
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
