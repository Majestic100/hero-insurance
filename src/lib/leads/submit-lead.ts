import "server-only";

import { formConfig } from "@/config/forms";
import { getSupabaseServerClient } from "@/lib/db/server";
import type { FormValues } from "@/lib/form/step-sequence";
import { buildFormSchema } from "@/lib/schemas/build-schema";
import { toLeadPayload } from "./to-payload";

export type SubmitLeadResult =
  | { ok: true }
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
): Promise<SubmitLeadResult> {
  const result = buildFormSchema(formConfig, values).safeParse(values);
  if (!result.success) {
    const fields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join("."))),
    ];
    return { ok: false, reason: "invalid", fields };
  }

  const payload = toLeadPayload(formConfig, result.data, submissionId);
  const { error } = await getSupabaseServerClient().rpc("create_lead", {
    payload,
  });
  if (error) {
    console.error("[leads] create_lead failed:", error.code, error.message);
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}
