import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerAuth } from "@/lib/server-auth";
import { getDb } from "@/lib/db";

export async function POST() {
  try {
    const { user, stripeCustomerId } = await getServerAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let customerId = stripeCustomerId;

    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch {
        customerId = null;
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      const sql = getDb();
      await sql`UPDATE subscriptions SET stripe_customer_id = ${customerId} WHERE user_id = ${user.id}`;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://remotegig.pro"}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
