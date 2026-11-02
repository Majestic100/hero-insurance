"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormWizard } from "@/components/form/form-wizard";
import type { FormConfig } from "@/config/forms/types";
import { clearDraft } from "@/lib/form/draft";
import { getSelectedTypes, type FormValues } from "@/lib/form/step-sequence";
import { trackLead, trackStepViewed } from "@/lib/tracking/track";

/**
 * The quote form: the generic wizard plus sending the lead to
 * POST /api/leads and tracking (only with consent, see src/lib/tracking).
 *
 * The submission id is created once per page visit and reused on retries,
 * so a double click or a retry never creates two leads. It is also the
 * event id of the Lead event, shared with the server-side Conversions API
 * event so Meta counts the lead once.
 */
export function QuoteForm({ config }: { config: FormConfig }) {
  const router = useRouter();
  const [submissionId] = useState(() => crypto.randomUUID());

  async function submit(values: FormValues): Promise<string | undefined> {
    let response: Response;
    try {
      response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, values }),
      });
    } catch {
      return "Vi kunne ikke få forbindelse. Tjek din internetforbindelse, og prøv igen.";
    }

    if (response.ok) {
      trackLead(submissionId, getSelectedTypes(values));
      clearDraft();
      router.push("/tilbud/tak");
      return undefined;
    }

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    return body.error ?? "Vi kunne ikke sende din forespørgsel. Prøv igen om lidt.";
  }

  return (
    <FormWizard
      config={config}
      onComplete={submit}
      onStepChange={trackStepViewed}
    />
  );
}
