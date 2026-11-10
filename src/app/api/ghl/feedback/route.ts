import { timingSafeEqual } from "node:crypto";

import { connection } from "next/server";

import { getSupabaseServerClient } from "@/lib/db/server";
import { getGhlFeedbackSecret } from "@/lib/env/server";
import { parseGhlFeedback } from "@/lib/integrations/ghl/payload";

const MAX_BODY_BYTES = 50_000;

function json(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function authorized(given: string | null): boolean {
  const secret = getGhlFeedbackSecret();
  if (!secret || !given) {
    return false;
  }
  const expected = Buffer.from(secret);
  const actual = Buffer.from(given);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/**
 * POST /api/ghl/feedback?key=<GHL_FEEDBACK_SECRET>
 *
 * Called by the GoHighLevel follow-up workflow (a "Webhook" action) with
 * the user's survey answers: `lead_id`, `contacted`, `quoted` and
 * `satisfaction` (see src/lib/integrations/ghl/README.md). Saves them on
 * the lead (the latest answer wins). The key is in the URL because GHL
 * webhook actions cannot always set headers; it is compared in constant
 * time. Answers with counts only, never personal data.
 */
export async function POST(request: Request) {
  await connection();
  const key =
    new URL(request.url).searchParams.get("key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    null;
  if (!authorized(key)) {
    return json({ error: "unauthorized" }, 401);
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return json({ error: "too_large" }, 413);
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const feedback = parseGhlFeedback(body);
  if (!feedback) {
    return json({ error: "missing_lead_id_or_answers" }, 400);
  }

  const supabase = getSupabaseServerClient();
  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("id", feedback.leadId)
    .maybeSingle();
  if (!lead) {
    return json({ error: "unknown_lead" }, 404);
  }

  const { error } = await supabase.from("lead_feedback").upsert({
    lead_id: feedback.leadId,
    contacted: feedback.contacted,
    quoted: feedback.quoted,
    satisfaction: feedback.satisfaction,
    received_at: new Date().toISOString(),
  });
  if (error) {
    console.error("[ghl] saving feedback failed:", error.code);
    return json({ error: "failed" }, 500);
  }
  return json({ ok: true });
}
