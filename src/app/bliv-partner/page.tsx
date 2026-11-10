import {
  ArrowRightIcon,
  BarChart3Icon,
  DatabaseZapIcon,
  type LucideIcon,
  ShieldCheckIcon,
  WebhookIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList } from "@/components/marketing/faq-list";
import { Button } from "@/components/ui/button";
import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
} from "@/config/forms/insurance-types";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Bliv partner",
  description: `Modtag kvalificerede forespørgsler på forsikringer fra ${SITE.name}.`,
};

const MAILTO = `mailto:${SITE.email}?subject=${encodeURIComponent("Bliv partner")}`;

/** What we offer partners. Keep in sync with src/lib/delivery/README.md. */
const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: DatabaseZapIcon,
    title: "Komplette oplysninger",
    text: "Boligens data fra BBR og bilens data fra Motorregistret er hentet på forhånd. I får det, I skal bruge for at give en pris, uden at ringe og spørge.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Dokumenteret samtykke",
    text: "Hver forespørgsel har brugerens samtykke til at blive kontaktet af jer, med tidspunkt, den præcise tekst og version.",
  },
  {
    icon: WebhookIcon,
    title: "Levering med det samme",
    text: "Forespørgsler sendes til jer i realtid som signeret JSON til jeres HTTPS-adresse. Fejler en levering, prøver vi igen automatisk.",
  },
  {
    icon: BarChart3Icon,
    title: "Bedre kvalitet over tid",
    text: "Fortæl os, hvordan det gik (kontaktet, tilbud givet, solgt). Så optimerer vi vores annoncer efter de forespørgsler, der bliver til kunder.",
  },
];

const FAQ = [
  {
    question: "Hvordan modtager vi forespørgslerne?",
    answer:
      "Som standard via webhook: en signeret JSON-besked til jeres HTTPS-adresse, med det samme. Kan I ikke tage imod det, så skriv til os, så finder vi en løsning.",
  },
  {
    question: "Hvilke forsikringer kan vi få forespørgsler på?",
    answer:
      "Dem, I vælger. I aftalen bestemmer vi, hvilke forsikringstyper I modtager.",
  },
  {
    question: "Hvor kommer forespørgslerne fra?",
    answer:
      "Primært fra vores annoncer på Facebook og Instagram. Alle besøgende udfylder den samme formular, og vi beskytter den mod robotter.",
  },
  {
    question: "Hvad koster det?",
    answer: "Det aftaler vi med hver partner. Skriv til os, så tager vi en snak.",
  },
];

export default function BecomePartnerPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="bg-secondary">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium">For forsikringsselskaber</p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Få kunder, der selv har bedt om et tilbud
            </h1>
            <p className="text-lg text-muted-foreground">
              Hos {SITE.name} udfylder private kunder én formular og beder om
              tilbud på deres forsikringer. Bliv partner, og modtag
              forespørgslerne med det samme, med samtykke og komplette data.
            </p>
          </div>
          <Button asChild size="lg" variant="cta" className="mt-8 h-12 text-base sm:px-8">
            <a href={MAILTO}>
              Kontakt os
              <ArrowRightIcon aria-hidden />
            </a>
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Det får I
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 rounded-lg border p-5">
              <Icon aria-hidden className="size-6 shrink-0 text-brand" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y bg-cream">
        <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Forsikringer, vi formidler
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {INSURANCE_TYPES.map((type) => {
              const Icon = INSURANCE_ICONS[type];
              return (
                <li
                  key={type}
                  className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm"
                >
                  <Icon aria-hidden className="size-4 text-brand" />
                  {INSURANCE_TYPE_INFO[type].shortLabel}
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-muted-foreground">
            Kun forsikringer til private. Brugerne kan se alle modtagere på
            vores{" "}
            <Link href="/partnere" className="font-medium underline underline-offset-4">
              partnerliste
            </Link>
            .
          </p>
        </div>
      </section>

      <FaqList items={FAQ} />

      <CtaBand
        title="Lad os tage en snak"
        text={`Skriv til ${SITE.email}, så vender vi tilbage.`}
        href={MAILTO}
        label="Kontakt os"
      />
    </main>
  );
}
