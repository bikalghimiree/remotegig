import { neon } from "@neondatabase/serverless";

// Server-side DB client for direct SQL queries
export function getDb() {
  return neon(process.env.DATABASE_URL!);
}
