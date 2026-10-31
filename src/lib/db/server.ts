import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/db/types";
import { getServerEnv } from "@/lib/env/server";

let client: SupabaseClient<Database> | undefined;

/**
 * Supabase client for server code only (route handlers, server actions).
 *
 * Uses the secret key, which bypasses Row Level Security. Never pass this
 * client or its results unfiltered to the browser.
 *
 * There is intentionally no browser client: all reads and writes go through
 * our own server endpoints. See CLAUDE.md.
 */
export function getSupabaseServerClient(): SupabaseClient<Database> {
  if (!client) {
    const env = getServerEnv();
    client = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
