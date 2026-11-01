import { CheckCircle2Icon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tak for din forespørgsel",
  robots: { index: false },
};

/** Shown after a lead has been saved. */
export default function ThankYouPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10 sm:py-16">
      <CheckCircle2Icon aria-hidden className="size-12 text-primary" />
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Tak for din forespørgsel
        </h1>
        <p className="text-lg text-muted-foreground">
          Vi sender dine oplysninger videre til forsikringsselskaberne. De
          kontakter dig med deres tilbud på telefon eller e-mail.
        </p>
      </div>
      <Button asChild variant="outline" className="h-11 w-full sm:w-auto sm:self-start">
        <Link href="/">Til forsiden</Link>
      </Button>
    </main>
  );
}
