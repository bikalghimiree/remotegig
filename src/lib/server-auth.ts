import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { op } from "@/lib/openpanel";

export interface ServerUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ServerAuth {
  user: ServerUser | null;
  plan: "pro" | "free";
  stripeCustomerId: string | null;
  appliedCount: number;
}

export async function getServerAuth(): Promise<ServerAuth> {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
      return { user: null, plan: "free", stripeCustomerId: null, appliedCount: 0 };
    }

    const user = session.user;
    const sql = getDb();

    // Auto-create profile if first login
    await sql`
      INSERT INTO profiles (id, email, display_name, avatar_url)
      VALUES (
        ${user.id},
        ${user.email || ""},
        ${user.name || user.email?.split("@")[0] || "User"},
        ${user.image || null}
      )
      ON CONFLICT (id) DO UPDATE SET
        display_name = COALESCE(NULLIF(${user.name || ""}, ''), profiles.display_name),
        avatar_url = COALESCE(${user.image || null}, profiles.avatar_url),
        updated_at = now()
    `;

    await sql`
      INSERT INTO subscriptions (user_id, plan, status)
      VALUES (${user.id}, 'free', 'active')
      ON CONFLICT (user_id) DO NOTHING
    `;

    op.identify({ profileId: user.id, email: user.email || "", name: user.name || "" });
    op.track("user_login", { profileId: user.id, email: user.email || "" });

    // Fetch subscription
    const rows = await sql`
      SELECT plan, stripe_customer_id
      FROM subscriptions 
      WHERE user_id = ${user.id}
        AND status IN ('active', 'trialing')
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const plan = (rows[0]?.plan as "pro" | "free") || "free";
    const stripeCustomerId = (rows[0]?.stripe_customer_id as string) || null;

    // Fetch applied count
    const countRows = await sql`
      SELECT COUNT(*)::int as count FROM job_applications WHERE user_id = ${user.id}
    `;
    const appliedCount = countRows[0]?.count || 0;

    return {
      user: {
        id: user.id,
        email: user.email || "",
        displayName: user.name || user.email?.split("@")[0] || "User",
        avatarUrl: user.image || null,
      },
      plan,
      stripeCustomerId,
      appliedCount,
    };
  } catch (err) {
    console.error("[auth] ERROR in getServerAuth:", err);
    return { user: null, plan: "free", stripeCustomerId: null, appliedCount: 0 };
  }
}
