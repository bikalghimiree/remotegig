import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/server-auth";
import { getDb } from "@/lib/db";
import AccountContent from "./AccountContent";

export const metadata = {
  title: "Account",
  description: "Manage your RemoteGig account and subscription.",
};

export type AlertData = {
  id: number;
  keywords: string[];
  categories: string[];
  locations: string[];
  frequency: string;
  is_active: boolean;
} | null;

export default async function AccountPage() {
  const { user, plan } = await getServerAuth();

  if (!user) {
    redirect("/");
  }

  let alert: AlertData = null;
  if (plan === "pro") {
    const sql = getDb();
    const rows = await sql`
      SELECT id, keywords, categories, locations, frequency, is_active
      FROM job_alerts
      WHERE user_id = ${user.id}
      LIMIT 1
    `;
    if (rows[0]) {
      alert = {
        id: rows[0].id as number,
        keywords: rows[0].keywords as string[],
        categories: rows[0].categories as string[],
        locations: rows[0].locations as string[],
        frequency: rows[0].frequency as string,
        is_active: rows[0].is_active as boolean,
      };
    }
  }

  return <AccountContent user={user} plan={plan} alert={alert} />;
}
