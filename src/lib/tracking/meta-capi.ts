import "server-only";

import { getMetaEnv } from "@/lib/env/server";
import { buildMetaLeadEvent, type MetaLeadInput } from "./meta-event";

/** Graph API version. Meta retires versions after about two years. */
const GRAPH_API_VERSION = "v26.0";

export type MetaPostResult = "ok" | "not_configured" | "rejected" | "failed";

/**
 * Posts events to the Meta Conversions API. Never throws, and logs no
 * personal data. "rejected" means Meta answered with an error (retrying
 * the same events will not help); "failed" means no answer (it may).
 */
export async function postMetaEvents(events: object[]): Promise<MetaPostResult> {
  const env = getMetaEnv();
  if (!env) {
    return "not_configured";
  }
  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${env.NEXT_PUBLIC_META_PIXEL_ID}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: events,
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
        "[meta] Conversions API rejected the events:",
        response.status,
        body.error?.type,
        body.error?.code,
      );
      return response.status >= 500 ? "failed" : "rejected";
    }
    return "ok";
  } catch (error) {
    console.error(
      "[meta] Conversions API request failed:",
      error instanceof Error ? error.name : "unknown",
    );
    return "failed";
  }
}

/**
 * Sends a Lead event to the Meta Conversions API. Does nothing when Meta is
 * not configured. A failed event must not affect the lead, which is
 * already saved.
 *
 * Only call this with the user's marketing consent.
 */
export async function sendMetaLeadEvent(input: MetaLeadInput): Promise<void> {
  await postMetaEvents([buildMetaLeadEvent(input)]);
}
