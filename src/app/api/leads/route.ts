import { z } from "zod";

import { submitLead } from "@/lib/leads/submit-lead";

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
 */
export async function POST(request: Request) {
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

  try {
    const result = await submitLead(parsed.data.values, parsed.data.submissionId);
    if (result.ok) {
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
