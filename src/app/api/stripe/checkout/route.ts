import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerAuth } from "@/lib/server-auth";

export async function POST() {
  try {
    const { user, stripeCustomerId } = await getServerAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY!;

    // Create or reuse Stripe customer
    let customerId = stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://remotegig.pro"}/?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://remotegig.pro"}/`,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
