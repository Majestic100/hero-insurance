import "server-only";

import { z } from "zod";

/**
 * Server-only environment variables.
 *
 * The `server-only` import makes the build fail if any client component
 * imports this file, so secret keys can never end up in the browser bundle.
 *
 * Validation is lazy (called on demand, not at module load) so the app can
 * build and boot before keys are configured, and so the health endpoint can
 * report "not configured" instead of crashing.
 */
const serverEnvSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_SECRET_KEY: z
    .string()
    .min(1)
    .refine((key) => !key.startsWith("sb_publishable_"), {
      message:
        "SUPABASE_SECRET_KEY contains a publishable key. Use the secret key (sb_secret_...) or the legacy service_role key.",
    }),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv() {
  return serverEnvSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL || undefined,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || undefined,
  });
}

export function getServerEnv(): ServerEnv {
  const result = parseServerEnv();
  if (!result.success) {
    throw new Error(
      `Invalid server environment variables:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
