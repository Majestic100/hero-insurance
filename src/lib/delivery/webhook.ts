import "server-only";

import type { PartnerWebhookEnv } from "@/lib/env/server";
import { SIGNATURE_HEADER, signDelivery } from "./signature";

/** How long a partner has to answer before the attempt counts as failed. */
const TIMEOUT_MS = 10_000;

export type WebhookResult =
  | { ok: true; reference?: string }
  /** `error` is a status code or error name, never personal data. */
  | { ok: false; error: string };

/**
 * POSTs one signed delivery to a partner. Any 2xx answer means delivered;
 * the partner may answer `{ "reference": "<their id>" }`. Everything else is
 * a failure that is retried. Never throws.
 */
export async function postToWebhook(
  webhook: PartnerWebhookEnv,
  deliveryId: string,
  body: string,
): Promise<WebhookResult> {
  try {
    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The same id on every retry: partners use it to ignore repeats.
        "X-Lead-Delivery-Id": deliveryId,
        [SIGNATURE_HEADER]: signDelivery(webhook.secret, body, new Date()),
      },
      body,
      redirect: "error",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      return { ok: false, error: `http_${response.status}` };
    }
    const answer = (await response.json().catch(() => null)) as {
      reference?: unknown;
    } | null;
    const reference =
      typeof answer?.reference === "string" || typeof answer?.reference === "number"
        ? String(answer.reference).slice(0, 200)
        : undefined;
    return { ok: true, reference };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.name : "unknown",
    };
  }
}
