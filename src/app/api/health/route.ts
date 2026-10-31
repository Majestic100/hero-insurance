import { connection } from "next/server";

import { getSupabaseServerClient } from "@/lib/db/server";
import { parseServerEnv } from "@/lib/env/server";

type SupabaseStatus = "ok" | "not_configured" | "error";
type DatabaseStatus = "ok" | "missing_schema" | "error" | "skipped";

// PostgREST and Postgres codes for "table does not exist".
const MISSING_TABLE_CODES = new Set(["PGRST205", "42P01"]);

/**
 * GET /api/health
 *
 * Reports whether the Supabase connection is configured and working, and
 * whether the database migrations have been applied.
 * Returns no error details to the caller; details are logged server-side.
 */
export async function GET() {
  // With Cache Components enabled, a GET handler without runtime data is
  // prerendered at build time. connection() forces it to run per request.
  await connection();

  const supabase = await checkSupabase();
  const database = supabase === "ok" ? await checkDatabase() : "skipped";
  const ok = supabase === "ok" && database === "ok";

  return Response.json(
    { status: ok ? "ok" : "degraded", supabase, database },
    {
      status: supabase === "error" || database === "error" ? 503 : 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

async function checkDatabase(): Promise<DatabaseStatus> {
  try {
    // Reads no rows: only checks that the leads table exists and is
    // reachable with the secret key. Not a HEAD request, because HEAD
    // responses carry no error code to tell a missing table apart.
    const { error } = await getSupabaseServerClient()
      .from("leads")
      .select("id")
      .limit(0);
    if (error) {
      if (MISSING_TABLE_CODES.has(error.code)) {
        return "missing_schema";
      }
      console.error("[health] Database check failed:", error.code, error.message);
      return "error";
    }
    return "ok";
  } catch (error) {
    console.error("[health] Database check threw:", error);
    return "error";
  }
}

async function checkSupabase(): Promise<SupabaseStatus> {
  const env = parseServerEnv();
  if (!env.success) {
    if (process.env.SUPABASE_URL || process.env.SUPABASE_SECRET_KEY) {
      // Keys are set but invalid. Log why, so it isn't silently ignored.
      console.error(
        "[health] Supabase env vars are set but invalid:",
        env.error.issues.map((issue) => issue.message).join("; "),
      );
    }
    return "not_configured";
  }

  try {
    // An admin call only succeeds with a valid secret key, so this verifies
    // URL, network access and key in one request. It works before any
    // tables exist.
    const { error } = await getSupabaseServerClient().auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    if (error) {
      console.error("[health] Supabase check failed:", error.message);
      return "error";
    }
    return "ok";
  } catch (error) {
    console.error("[health] Supabase check threw:", error);
    return "error";
  }
}
