import { getDb } from "@/lib/db";
import { getServerAuth } from "@/lib/server-auth";
import HomeContent from "./HomeContent";

export type Job = {
  id: number;
  title: string;
  company: string;

  salary_text: string | null;
  location: string;
  job_type: string;
  category: string;
  description: string;
  requirements: string[];
  tags: string[];
  apply_url: string;
  posted_at: string;
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function Home() {
  const sql = getDb();
  const { plan } = await getServerAuth();

  const rows = await sql`
    SELECT id, title, company, salary_text, location, job_type, category, description, requirements, tags, apply_url, posted_at
    FROM jobs
    WHERE is_active = true
    ORDER BY posted_at DESC
  `;

  const jobs: Job[] = rows.map((r) => ({
    id: r.id as number,
    title: r.title as string,
    company: r.company as string,

    salary_text: r.salary_text as string | null,
    location: r.location as string,
    job_type: r.job_type as string,
    category: r.category as string,
    description: r.description as string,
    requirements: r.requirements as string[],
    tags: r.tags as string[],
    apply_url: r.apply_url as string,
    posted_at: timeAgo(r.posted_at as string),
  }));

  return <HomeContent jobs={jobs} plan={plan} />;
}
