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

/**
 * A partner's webhook (module 8), per partner and environment. Leads are
 * personal data, so only https is allowed, except localhost for testing.
 */
const partnerWebhookSchema = z.object({
  url: z.url().refine(
    (url) => {
      const { protocol, hostname } = new URL(url);
      return (
        protocol === "https:" ||
        (protocol === "http:" && ["localhost", "127.0.0.1"].includes(hostname))
      );
    },
    { message: "must be https (http only for localhost)" },
  ),
  secret: z.string().min(32),
});

export type PartnerWebhookEnv = z.infer<typeof partnerWebhookSchema>;

function partnerVar(partnerId: string, name: string): string | undefined {
  return process.env[`PARTNER_${partnerId.toUpperCase()}_${name}`] || undefined;
}

/**
 * Where and how to deliver leads to a partner, or undefined when it is not
 * configured in this environment (then deliveries wait and are retried).
 */
export function getPartnerWebhookEnv(
  partnerId: string,
): PartnerWebhookEnv | undefined {
  const result = partnerWebhookSchema.safeParse({
    url: partnerVar(partnerId, "WEBHOOK_URL"),
    secret: partnerVar(partnerId, "WEBHOOK_SECRET"),
  });
  return result.success ? result.data : undefined;
}

/** The key a partner uses to report outcomes, or undefined when not set. */
export function getPartnerApiKey(partnerId: string): string | undefined {
  const key = partnerVar(partnerId, "API_KEY");
  return key && key.length >= 32 ? key : undefined;
}

/**
 * Vercel sends it as `Authorization: Bearer <CRON_SECRET>` on every cron
 * call. Without it the cron endpoint refuses all calls.
 */
export function getCronSecret(): string | undefined {
  const secret = process.env.CRON_SECRET;
  return secret && secret.length >= 16 ? secret : undefined;
}

const motorApiEnvSchema = z.object({ MOTORAPI_API_KEY: z.string().min(10) });

export type MotorApiEnv = z.infer<typeof motorApiEnvSchema>;

/**
 * MotorAPI (license plate lookups, module 6). Optional: without it the
 * plate is not looked up and leads are saved without vehicle data.
 */
export function getMotorApiEnv(): MotorApiEnv | undefined {
  const result = motorApiEnvSchema.safeParse({
    MOTORAPI_API_KEY: process.env.MOTORAPI_API_KEY || undefined,
  });
  return result.success ? result.data : undefined;
}

/**
 * GoHighLevel (follow-up survey, module 9). Optional: without the webhook
 * URL, leads are not sent to GHL; without the secret, the feedback
 * endpoint refuses every call.
 * - GHL_INBOUND_WEBHOOK_URL: the URL of the "Inbound Webhook" trigger of
 *   the follow-up workflow in GHL. Anyone with it can create contacts, so
 *   treat it as a secret.
 * - GHL_FEEDBACK_SECRET: shared secret GHL sends back with the answers
 *   (`?key=` on /api/ghl/feedback). At least 32 characters.
 */
export function getGhlWebhookUrl(): string | undefined {
  const result = z
    .url()
    .refine((value) => value.startsWith("https://"))
    .safeParse(process.env.GHL_INBOUND_WEBHOOK_URL || undefined);
  return result.success ? result.data : undefined;
}

export function getGhlFeedbackSecret(): string | undefined {
  const secret = process.env.GHL_FEEDBACK_SECRET;
  return secret && secret.length >= 32 ? secret : undefined;
}
