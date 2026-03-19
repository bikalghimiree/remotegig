import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { op } from "@/lib/openpanel";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = getDb();
    await sql`INSERT INTO contact_submissions (name, email, message) VALUES (${name}, ${email}, ${message})`;

    op.track("contact_submitted", { email });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
