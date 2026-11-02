import "server-only";

import { getMetaEnv } from "@/lib/env/server";
import { buildMetaLeadEvent, type MetaLeadInput } from "./meta-event";

/** Graph API version. Meta retires versions after about two years. */
const GRAPH_API_VERSION = "v23.0";

/**
 * Sends a Lead event to the Meta Conversions API. Does nothing when Meta is
 * not configured. Never throws, and logs no personal data: a failed event
 * must not affect the lead, which is already saved.
 *
 * Only call this with the user's marketing consent.
 */
export async function sendMetaLeadEvent(input: MetaLeadInput): Promise<void> {
  const env = getMetaEnv();
  if (!env) {
    return;
  }
  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${env.NEXT_PUBLIC_META_PIXEL_ID}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [buildMetaLeadEvent(input)],
          access_token: env.META_CAPI_ACCESS_TOKEN,
          ...(env.META_TEST_EVENT_CODE && {
            test_event_code: env.META_TEST_EVENT_CODE,
          }),
        }),
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        error?: { code?: number; type?: string };
      };
      console.error(
        "[meta] Conversions API rejected the event:",
        response.status,
        body.error?.type,
        body.error?.code,
      );
    }
  } catch (error) {
    console.error(
      "[meta] Conversions API request failed:",
      error instanceof Error ? error.name : "unknown",
    );
  }
}
