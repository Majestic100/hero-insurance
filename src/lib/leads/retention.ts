import "server-only";

import { RETENTION } from "@/config/retention";
import { getSupabaseServerClient } from "@/lib/db/server";

export type RetentionResult = { answersPurged: number; leadsDeleted: number };

/**
 * Deletes old lead data (see src/config/retention.ts). Counts only, never
 * personal data, in the result and the log.
 */
export async function purgeOldLeads(): Promise<RetentionResult> {
  const { data, error } = await getSupabaseServerClient().rpc("purge_old_leads", {
    answers_after: `${RETENTION.answersMonths} months`,
    delete_after: `${RETENTION.consentProofYears} years`,
  });
  if (error) {
    throw new Error(`purge_old_leads failed: ${error.message}`);
  }
  const counts = (data ?? {}) as { answers_purged?: number; leads_deleted?: number };
  return {
    answersPurged: counts.answers_purged ?? 0,
    leadsDeleted: counts.leads_deleted ?? 0,
  };
}
