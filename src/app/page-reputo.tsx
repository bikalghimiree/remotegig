import { Suspense } from "react";
import HomeContent from "./HomeContent";
import { getServerAuth } from "@/lib/server-auth";
import { getJobs, getFilterOptions } from "@/lib/jobs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reputo | Browse Paid Brand Deals for Creators",
  description: "Find UGC and brand deal opportunities from real companies. Filter by niche, budget, and platform. Apply instantly and start earning as a creator.",
};

export default async function Home() {
  const { user, plan, appliedCount } = await getServerAuth();
  const [jobs, filterOptions] = await Promise.all([getJobs(), getFilterOptions()]);
  return (
    <Suspense>
      <HomeContent user={user} plan={plan} appliedCount={appliedCount} jobs={jobs} filterOptions={filterOptions} />
    </Suspense>
  );
}

