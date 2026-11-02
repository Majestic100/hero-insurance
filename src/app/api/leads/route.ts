import { checkBotId } from "botid/server";
import { after } from "next/server";
import { z } from "zod";

import { submitLead } from "@/lib/leads/submit-lead";
import { CONSENT_COOKIE, parseConsent, readCookie } from "@/lib/tracking/consent";
import { sendMetaLeadEvent } from "@/lib/tracking/meta-capi";

/** A lead is a few kilobytes; anything far bigger is not a real form. */
const MAX_BODY_BYTES = 64 * 1024;

const requestSchema = z.object({
  /** Generated once per form session by the client, reused on retries. */
  submissionId: z.uuid(),
  values: z.record(z.string(), z.unknown()),
});

function json(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * POST /api/leads
 *
 * Receives the quote form. The values are validated again on the server
 * with the generated schema, then saved with the `create_lead` database
 * function. Errors returned to the client are in Danish and contain no
 * details beyond which fields are invalid.
 *
 * Bots are stopped first with Vercel BotID (set up in
 * src/instrumentation-client.ts). It only works on Vercel; locally it always
 * reports "not a bot". Calling this endpoint with curl in production is
 * therefore blocked with 403: test it from a page in the app instead.
 */
export async function POST(request: Request) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return json({ error: "Forespørgslen blev afvist." }, 403);
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return json({ error: "Forespørgslen er for stor." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "Ugyldig forespørgsel." }, 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "Ugyldig forespørgsel." }, 400);
  }

  // Tracking: marketing consent and Meta ids come from first-party cookies.
  const cookieHeader = request.headers.get("cookie");
  const tracking = {
    consent:
      parseConsent(readCookie(cookieHeader, CONSENT_COOKIE))?.marketing === true,
    fbc: readCookie(cookieHeader, "_fbc"),
    fbp: readCookie(cookieHeader, "_fbp"),
  };

  try {
    const { submissionId } = parsed.data;
    const result = await submitLead(parsed.data.values, submissionId, tracking);
    if (result.ok) {
      if (tracking.consent) {
        // Sent after the response, so Meta never slows down the user.
        after(() =>
          sendMetaLeadEvent({
            eventId: submissionId,
            eventTime: new Date(),
            sourceUrl: request.headers.get("referer") ?? new URL("/tilbud", request.url).href,
            email: result.lead.email,
            phone: result.lead.phone,
            insuranceTypes: result.lead.insuranceTypes,
            fbc: tracking.fbc,
            fbp: tracking.fbp,
            ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
            userAgent: request.headers.get("user-agent") ?? undefined,
          }),
        );
      }
      return json({ ok: true }, 201);
    }
    if (result.reason === "invalid") {
      return json(
        {
          error: "Nogle af oplysningerne er ikke udfyldt korrekt.",
          fields: result.fields,
        },
        422,
      );
    }
  } catch (error) {
    // E.g. Supabase not configured. Logged without the submitted values.
    console.error("[leads] submit threw:", error instanceof Error ? error.message : error);
  }
  return json(
    { error: "Vi kunne ikke sende din forespørgsel. Prøv igen om lidt." },
    500,
  );
}
