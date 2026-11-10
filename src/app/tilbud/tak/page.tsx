import { CheckCircle2Icon, PhoneIncomingIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { Button } from "@/components/ui/button";
import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
} from "@/config/forms/insurance-types";

export const metadata: Metadata = {
  title: "Tak for din forespørgsel",
  robots: { index: false },
};

const NEXT_STEPS = [
  {
    title: "Vi sender din forespørgsel",
    text: "Til de forsikringsselskaber, der tilbyder de forsikringer, du har valgt.",
  },
  {
    title: "Selskaberne kontakter dig",
    text: "På telefon eller e-mail, med et tilbud ud fra dine oplysninger.",
  },
  {
    title: "Du vælger selv",
    text: "Sammenlign tilbuddene. Du er ikke forpligtet til at sige ja til nogen.",
  },
];

/**
 * Shown after a lead has been saved. The tip about unknown numbers matters:
 * a lead the partner cannot reach is worth nothing to them (or to Meta).
 */
export default function ThankYouPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-10 sm:py-16">
      <div className="space-y-3">
        <CheckCircle2Icon aria-hidden className="size-12 text-brand" />
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Tak for din forespørgsel
        </h1>
        <p className="text-lg text-muted-foreground">
          Vi har modtaget den. Her er, hvad der sker nu.
        </p>
      </div>

      <ol className="space-y-4">
        {NEXT_STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex gap-3 rounded-lg border bg-cream p-4">
        <PhoneIncomingIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
        <p>
          <strong>Tag telefonen, også fra ukendte numre.</strong> Selskaberne
          ringer ofte for at give dig det rigtige tilbud. Hold også øje med din
          indbakke og spam-mappen.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Vil du have tilbud på flere forsikringer?</h2>
        <ul className="flex flex-wrap gap-2">
          {INSURANCE_TYPES.map((type) => {
            const Icon = INSURANCE_ICONS[type];
            return (
              <li key={type}>
                <Link
                  href={`/tilbud?forsikring=${INSURANCE_TYPE_INFO[type].slug}`}
                  className="flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <Icon aria-hidden className="size-4 text-brand" />
                  {INSURANCE_TYPE_INFO[type].shortLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Button asChild variant="outline" className="h-11 w-full sm:w-auto sm:self-start">
        <Link href="/">Til forsiden</Link>
      </Button>
    </main>
  );
}
