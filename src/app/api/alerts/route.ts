import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerAuth } from "@/lib/server-auth";

export async function POST(req: Request) {
  const { plan, user } = await getServerAuth();
  if (!user || plan !== "pro") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { keywords, categories, locations, frequency, is_active } = body;

  const sql = getDb();
  await sql`
    INSERT INTO job_alerts (user_id, keywords, categories, locations, frequency, is_active)
    VALUES (${user.id}, ${keywords || []}, ${categories || []}, ${locations || []}, ${frequency || 'daily'}, ${is_active ?? true})
    ON CONFLICT (user_id) DO UPDATE SET
      keywords = ${keywords || []},
      categories = ${categories || []},
      locations = ${locations || []},
      frequency = ${frequency || 'daily'},
      is_active = ${is_active ?? true}
  `;

  return NextResponse.json({ ok: true });
}
