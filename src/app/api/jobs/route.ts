import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const search = searchParams.get("q") || "";
  const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
  const locations = searchParams.get("locations")?.split(",").filter(Boolean) || [];
  const salaryMin = parseInt(searchParams.get("salaryMin") || "0", 10);

  const sql = getDb();

  // Build WHERE conditions using tagged template
  // Since neon() only supports tagged templates, we'll build the query with all possible conditions
  // and use SQL tricks to make unused conditions pass-through

  const searchPattern = search ? `%${search}%` : "%";
  const hasSearch = !!search;
  const hasCat = categories.length > 0;
  const hasType = types.length > 0;
  const hasLoc = locations.length > 0;
  const hasSalary = salaryMin > 0;

  const rows = await sql`
    SELECT id, title, company, salary_text, salary_min, salary_max, location, job_type, category, description, requirements, tags, apply_url, posted_at
    FROM jobs
    WHERE is_active = true
      AND (${!hasSearch} OR title ILIKE ${searchPattern} OR company ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
      AND (${!hasCat} OR category = ANY(${categories}::text[]))
      AND (${!hasType} OR job_type = ANY(${types}::text[]))
      AND (${!hasLoc} OR location = ANY(${locations}::text[]))
      AND (${!hasSalary} OR salary_min >= ${salaryMin} OR salary_max >= ${salaryMin})
    ORDER BY posted_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countRows = await sql`
    SELECT COUNT(*)::int as total
    FROM jobs
    WHERE is_active = true
      AND (${!hasSearch} OR title ILIKE ${searchPattern} OR company ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
      AND (${!hasCat} OR category = ANY(${categories}::text[]))
      AND (${!hasType} OR job_type = ANY(${types}::text[]))
      AND (${!hasLoc} OR location = ANY(${locations}::text[]))
      AND (${!hasSalary} OR salary_min >= ${salaryMin} OR salary_max >= ${salaryMin})
  `;

  const total = (countRows[0]?.total as number) || 0;

  return NextResponse.json({
    jobs: rows,
    total,
    hasMore: offset + limit < total,
  });
}
