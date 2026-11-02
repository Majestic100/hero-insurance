import { after } from "next/server";

import { findPartnerByAuthorization } from "@/lib/delivery/partner-auth";
import { outcomeRequestSchema } from "@/lib/delivery/outcomes";
import { sendPendingOutcomeEvents } from "@/lib/delivery/outcome-meta";
import { recordOutcomes } from "@/lib/delivery/record-outcomes";

/** 100 outcomes are about 15 kB. */
const MAX_BODY_BYTES = 64 * 1024;

function json(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * POST /api/partners/outcomes
 *
 * Partners report what happened with the leads they received (contacted,
 * quoted, sold, ...), with `Authorization: Bearer <their API key>`. Good
 * outcomes are then sent to Meta. A machine-to-machine API, so answers are
 * in English. Documented for partners in src/lib/delivery/README.md.
 *
 * Not protected by BotID (no browser calls it); the API key is the guard.
 */
export async function POST(request: Request) {
  const partnerId = findPartnerByAuthorization(request.headers.get("authorization"));
  if (!partnerId) {
    return json({ error: "unauthorized" }, 401);
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return json({ error: "body_too_large" }, 413);
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const parsed = outcomeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        error: "invalid_body",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      422,
    );
  }

  try {
    const results = await recordOutcomes(partnerId, parsed.data.outcomes, new Date());
    if (results.some((item) => item.result === "accepted")) {
      after(() => sendPendingOutcomeEvents());
    }
    return json({ results }, 200);
  } catch (error) {
    console.error(
      "[outcomes] recording failed:",
      partnerId,
      error instanceof Error ? error.message : "unknown",
    );
    return json({ error: "server_error" }, 500);
  }
}
