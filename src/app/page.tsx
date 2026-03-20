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

export type FilterOptions = {
  categories: { value: string; count: number }[];
  types: { value: string; count: number }[];
  locations: { value: string; count: number }[];
  salaryRanges: { label: string; min: number; max: number | null }[];
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

  // Fetch jobs + filter options in parallel
  const [rows, categoryRows, typeRows, locationRows] = await Promise.all([
    sql`
      SELECT id, title, company, salary_text, salary_min, salary_max, location, job_type, category, description, requirements, tags, apply_url, posted_at
      FROM jobs
      WHERE is_active = true
      ORDER BY posted_at DESC
    `,
    sql`SELECT category as value, COUNT(*)::int as count FROM jobs WHERE is_active = true GROUP BY category ORDER BY count DESC`,
    sql`SELECT job_type as value, COUNT(*)::int as count FROM jobs WHERE is_active = true GROUP BY job_type ORDER BY count DESC`,
    sql`SELECT location as value, COUNT(*)::int as count FROM jobs WHERE is_active = true GROUP BY location HAVING COUNT(*) >= 2 ORDER BY count DESC`,
  ]);

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
    salary_min: r.salary_min as number | null,
    salary_max: r.salary_max as number | null,
  }));

  const filterOptions: FilterOptions = {
    categories: categoryRows.map((r) => ({ value: r.value as string, count: r.count as number })),
    types: typeRows.map((r) => ({ value: r.value as string, count: r.count as number })),
    locations: locationRows.map((r) => ({ value: r.value as string, count: r.count as number })),
    salaryRanges: [
      { label: "Any", min: 0, max: null },
      { label: "$30k+", min: 30000, max: null },
      { label: "$50k+", min: 50000, max: null },
      { label: "$75k+", min: 75000, max: null },
      { label: "$100k+", min: 100000, max: null },
      { label: "$150k+", min: 150000, max: null },
    ],
  };

  return <HomeContent jobs={jobs} plan={plan} filterOptions={filterOptions} />;
}
