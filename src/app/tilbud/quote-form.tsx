"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormWizard } from "@/components/form/form-wizard";
import type { FormConfig } from "@/config/forms/types";
import { clearDraft } from "@/lib/form/draft";
import type { FormValues } from "@/lib/form/step-sequence";

/**
 * The quote form: the generic wizard plus sending the lead to
 * POST /api/leads. The submission id is created once per page visit and
 * reused on retries, so a double click or a retry never creates two leads.
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
      clearDraft();
      router.push("/tilbud/tak");
      return undefined;
    }

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    return body.error ?? "Vi kunne ikke sende din forespørgsel. Prøv igen om lidt.";
  }

  return <FormWizard config={config} onComplete={submit} />;
}
