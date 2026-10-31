import { connection } from "next/server";

import { getSupabaseServerClient } from "@/lib/db/server";
import { parseServerEnv } from "@/lib/env/server";

type SupabaseStatus = "ok" | "not_configured" | "error";

/**
 * GET /api/health
 *
 * Reports whether the Supabase connection is configured and working.
 * Returns no error details to the caller; details are logged server-side.
 */
export async function GET() {
  // With Cache Components enabled, a GET handler without runtime data is
  // prerendered at build time. connection() forces it to run per request.
  await connection();

  const supabase = await checkSupabase();

  return Response.json(
    { status: supabase === "ok" ? "ok" : "degraded", supabase },
    {
      status: supabase === "error" ? 503 : 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
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
