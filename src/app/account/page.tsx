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

  const sql = getDb();

  // Fetch filter options + alert in parallel
  const [categoryRows, locationRows, alertRows] = await Promise.all([
    sql`SELECT DISTINCT category FROM jobs WHERE is_active = true ORDER BY category`,
    sql`SELECT DISTINCT location FROM jobs WHERE is_active = true AND location IS NOT NULL ORDER BY location`,
    plan === "pro"
      ? sql`SELECT id, keywords, categories, locations, frequency, is_active FROM job_alerts WHERE user_id = ${user.id} LIMIT 1`
      : Promise.resolve([]),
  ]);

  const categoryOptions = categoryRows.map((r) => r.category as string);
  const locationOptions = locationRows.map((r) => r.location as string);

  let alert: AlertData = null;
  if (alertRows[0]) {
    alert = {
      id: alertRows[0].id as number,
      keywords: alertRows[0].keywords as string[],
      categories: alertRows[0].categories as string[],
      locations: alertRows[0].locations as string[],
      frequency: alertRows[0].frequency as string,
      is_active: alertRows[0].is_active as boolean,
    };
  }

  return <AccountContent user={user} plan={plan} alert={alert} categoryOptions={categoryOptions} locationOptions={locationOptions} />;
}
