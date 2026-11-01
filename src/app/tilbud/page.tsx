import type { Metadata } from "next";
import { Suspense } from "react";

import { FormWizardSkeleton } from "@/components/form/form-wizard";
import { formConfig } from "@/config/forms";
import { QuoteForm } from "./quote-form";

export const metadata: Metadata = {
  title: "Få tilbud",
  description: "Vælg dine forsikringer og få tilbud.",
};

export default function QuotePage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-6 sm:pt-10 sm:pb-16">
      {/* The wizard reads the URL (current step), so it renders on the client. */}
      <Suspense fallback={<FormWizardSkeleton />}>
        <QuoteForm config={formConfig} />
      </Suspense>
    </main>
  );
}
