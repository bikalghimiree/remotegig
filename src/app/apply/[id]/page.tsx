import { getServerAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getJobBySlug } from "@/lib/jobs";
import { op } from "@/lib/openpanel";
import ApplyContent from "./ApplyContent";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobBySlug(id);
  if (!job) return { title: "Not Found" };
  return {
    title: `Apply: ${job.role} at ${job.brand}`,
    description: `Apply for the ${job.role} opportunity at ${job.brand}. ${job.budget} budget, ${job.platform}. Get the contact, pitch template, and apply directly.`,
  };
}

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, plan, appliedCount } = await getServerAuth();
  const { id } = await params;

  if (!user) {
    redirect("/");
  }

  const canApply = plan === "pro" || appliedCount < 0;
  if (!canApply) {
    redirect("/");
  }

  const job = await getJobBySlug(id);

  if (!job) {
    redirect("/");
  }

  // Record the application (unique per user+job, duplicates ignored)
  const sql = getDb();
  await sql`
    INSERT INTO job_applications (user_id, job_id)
    VALUES (${user.id}, ${job.id})
    ON CONFLICT (user_id, job_id) DO NOTHING
  `;

  op.track("job_applied", { profileId: user.id, brand: job.brand, role: job.role });

  return <ApplyContent job={job} user={user} />;
}
