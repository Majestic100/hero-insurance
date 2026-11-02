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

/**
 * Meta Conversions API. Optional: without these, server-side tracking is
 * off and leads are still saved. The pixel id is public (it is also used
 * by the browser Pixel); the access token is secret.
 */
const metaEnvSchema = z.object({
  NEXT_PUBLIC_META_PIXEL_ID: z.string().regex(/^\d+$/),
  META_CAPI_ACCESS_TOKEN: z.string().min(20),
  /** From Events Manager > Test events; set only while testing. */
  META_TEST_EVENT_CODE: z.string().min(1).optional(),
});

export type MetaEnv = z.infer<typeof metaEnvSchema>;

/** The Meta settings, or undefined when tracking is not configured. */
export function getMetaEnv(): MetaEnv | undefined {
  const result = metaEnvSchema.safeParse({
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined,
    META_CAPI_ACCESS_TOKEN: process.env.META_CAPI_ACCESS_TOKEN || undefined,
    META_TEST_EVENT_CODE: process.env.META_TEST_EVENT_CODE || undefined,
  });
  return result.success ? result.data : undefined;
}

/**
 * Datafordeler (Danish public registers: addresses, BBR). Optional: without
 * it, lookups are off and users fill in the fields themselves.
 */
const datafordelerEnvSchema = z.object({
  DATAFORDELER_API_KEY: z.string().min(20),
});

export type DatafordelerEnv = z.infer<typeof datafordelerEnvSchema>;

/** The Datafordeler settings, or undefined when not configured. */
export function getDatafordelerEnv(): DatafordelerEnv | undefined {
  const result = datafordelerEnvSchema.safeParse({
    DATAFORDELER_API_KEY: process.env.DATAFORDELER_API_KEY || undefined,
  });
  return result.success ? result.data : undefined;
}
