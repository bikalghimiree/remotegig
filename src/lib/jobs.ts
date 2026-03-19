import { getDb } from "@/lib/db";

export type Job = {
  id: number;
  slug: string;
  brand: string;
  brandUrl: string;
  brandDescription: string;
  role: string;
  type: string;
  platform: string;
  budget: string;
  location: string;
  language: string;
  contentType: string;
  deadline: string;
  status: string;
  posted: string;
  tags: string[];
  description: string;
  requirements: string[];
  howToApply: string;
  contactEmail: string;
  contactName: string;
  instagramFollowers: number;
  hasRespondedPositively: boolean;
  compensationTypes: string[];
};

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function mapRow(row: Record<string, unknown>): Job {
  return {
    id: row.id as number,
    slug: (row.slug as string) || "",
    brand: row.brand as string,
    brandUrl: (row.brand_url as string) || "",
    brandDescription: (row.brand_description as string) || "",
    role: row.role as string,
    type: row.type as string,
    platform: (row.platform as string) || "",
    budget: (row.budget as string) || "",
    location: (row.location as string) || "Global",
    language: (row.language as string) || "English",
    contentType: (row.content_type as string) || "",
    deadline: (row.deadline as string) || "Rolling",
    status: (row.status as string) || "Hiring",
    posted: timeAgo(new Date(row.created_at as string)),
    tags: (row.tags as string[]) || [],
    description: (row.description as string) || "",
    requirements: (row.requirements as string[]) || [],
    howToApply: (row.how_to_apply as string) || "",
    contactEmail: (row.contact_email as string) || "",
    contactName: (row.contact_name as string) || "",
    instagramFollowers: (row.instagram_followers as number) || 0,
    hasRespondedPositively: (row.has_responded_positively as boolean) || false,
    compensationTypes: (row.compensation_types as string[]) || [],
  };
}

export async function getJobs(): Promise<Job[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM jobs WHERE is_active = true ORDER BY created_at DESC
  `;
  return rows.map(mapRow);
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM jobs WHERE slug = ${slug} AND is_active = true LIMIT 1
  `;
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

export type FilterOptions = Record<string, string[]>;

export async function getFilterOptions(): Promise<FilterOptions> {
  const sql = getDb();
  const rows = await sql`
    SELECT filter_group, filter_value
    FROM filter_options
    WHERE is_active = true
    ORDER BY filter_group, display_order ASC
  `;
  const groups: FilterOptions = {};
  for (const row of rows) {
    const group = row.filter_group as string;
    const value = row.filter_value as string;
    if (!groups[group]) groups[group] = [];
    groups[group].push(value);
  }
  return groups;
}
