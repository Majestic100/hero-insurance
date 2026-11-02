import "server-only";

import { formConfig } from "@/config/forms";
import { getSupabaseServerClient } from "@/lib/db/server";
import { getSelectedTypes, type FormValues } from "@/lib/form/step-sequence";
import { buildFormSchema } from "@/lib/schemas/build-schema";
import { toLeadPayload, type LeadTracking } from "./to-payload";

export type SubmitLeadResult =
  | {
      ok: true;
      /** What the server-side Meta event needs (normalized values). */
      lead: { email: string; phone: string; insuranceTypes: string[] };
    }
  | { ok: false; reason: "invalid"; fields: string[] }
  | { ok: false; reason: "error" };

/**
 * Validates submitted form values with the same generated schema as the
 * client (never trusting the client's validation) and saves the lead.
 *
 * Logs no personal data: only field paths and error codes.
 */
export async function submitLead(
  values: FormValues,
  submissionId: string,
  tracking: LeadTracking,
): Promise<SubmitLeadResult> {
  const result = buildFormSchema(formConfig, values).safeParse(values);
  if (!result.success) {
    const fields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join("."))),
    ];
    return { ok: false, reason: "invalid", fields };
  }

  const payload = toLeadPayload(formConfig, result.data, submissionId, tracking);
  const { error } = await getSupabaseServerClient().rpc("create_lead", {
    payload,
  });
  if (error) {
    console.error("[leads] create_lead failed:", error.code, error.message);
    return { ok: false, reason: "error" };
  }
  return {
    ok: true,
    lead: {
      email: String(result.data.email),
      phone: String(result.data.phone),
      insuranceTypes: getSelectedTypes(result.data),
    },
  };
}
