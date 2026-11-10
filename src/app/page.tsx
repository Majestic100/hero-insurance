import { MapPinHouseIcon, ScaleIcon } from "lucide-react";
import Link from "next/link";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, type FaqItem } from "@/components/marketing/faq-list";
import { InsurancePicker } from "@/components/marketing/insurance-picker";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { SavingsHighlight } from "@/components/marketing/savings-highlight";
import { UspList } from "@/components/marketing/usp-list";
import { SITE } from "@/config/site";

// Copy reviewed by the owner and legal (docs/huskeliste.md). Only claims we
// can document: no invented numbers, ratings or testimonials.

const FAQ: FaqItem[] = [
  {
    question: "Koster det noget?",
    answer:
      "Nej. Det er gratis for dig og helt uforpligtende. Du bestemmer selv, om du vil tage imod et tilbud.",
  },
  {
    question: "Hvem kontakter mig?",
    answer:
      "De forsikringsselskaber, du giver samtykke til, kontakter dig på telefon eller e-mail med et tilbud. Vi sender ikke din forespørgsel til andre selskaber.",
  },
  {
    question: "Hvilke oplysninger skal jeg give?",
    answer:
      "Kun det, selskaberne skal bruge for at give en pris: fx din adresse, dit fødselsår og oplysninger om bilen eller boligen. Vi spørger aldrig om dit helbred.",
  },
  {
    question: "Hvad sker der med mine oplysninger?",
    answer:
      "Vi gemmer dem i EU og sender dem kun til de selskaber, du giver samtykke til. Har du sagt ja til marketingcookies, sender vi også dine kontaktoplysninger i hashet form til Meta, så vi kan måle vores annoncer. Du kan læse mere i vores privatlivspolitik.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero: tick one or more types, then the form opens at the first. */}
      <section className="bg-secondary/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
          <div className="max-w-2xl space-y-4">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Få tilbud på dine forsikringer. Udfyld kun én formular.
            </h1>
            <SavingsHighlight />
            <p className="text-lg text-muted-foreground">
              Vælg de forsikringer, du vil have tilbud på, og lad
              forsikringsselskaberne give dig et bud.
            </p>
          </div>

          <div className="mt-8">
            <InsurancePicker />
          </div>
          <div className="mt-6">
            <UspList />
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* What sets us apart: register lookups fill in the boring parts. */}
      <section className="border-y bg-cream">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:grid-cols-2 sm:py-16">
          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Vi udfylder det kedelige for dig
            </h2>
            <p className="text-muted-foreground">
              Du skal ikke lede efter skøder eller registreringsattester. Vi
              henter oplysningerne fra de offentlige registre, og du kan altid
              rette dem.
            </p>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-4 rounded-lg border bg-card p-4">
              <MapPinHouseIcon aria-hidden className="size-6 shrink-0 text-brand" />
              <div>
                <h3 className="font-semibold">Skriv din adresse</h3>
                <p className="text-sm text-muted-foreground">
                  Så finder vi boligens areal, byggeår og tagtype i BBR.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-lg border bg-card p-4">
              <INSURANCE_ICONS.car aria-hidden className="size-6 shrink-0 text-brand" />
              <div>
                <h3 className="font-semibold">Skriv din nummerplade</h3>
                <p className="text-sm text-muted-foreground">
                  Så finder vi bilens mærke, model og motor i Motorregistret.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Mission. Never "we find the right insurance for you": that is
          advice (CLAUDE.md rule 7). The user chooses. */}
      <section className="mx-auto w-full max-w-5xl px-4 pt-12 sm:pt-16">
        <div className="flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
          <ScaleIcon aria-hidden className="size-8 shrink-0 text-brand" />
          <div className="space-y-2">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Du har ret til at kende dine muligheder
            </h2>
            <p className="text-muted-foreground">
              Vi vil ændre den måde, danskerne får tilbud på forsikringer. I
              dag skal du ringe rundt og fortælle det samme igen og igen, og
              derfor bliver mange hængende i forsikringer, der ikke længere
              passer til deres liv. Hos os udfylder du én formular, og
              selskaberne kommer til dig. Du vælger selv.{" "}
              <Link href="/om-os" className="font-medium underline underline-offset-4">
                Læs mere om os
              </Link>
            </p>
          </div>
        </div>
      </section>

      <FaqList items={FAQ} />

      <CtaBand
        title="Klar til at tjekke dine forsikringer?"
        text={`Det tager få minutter, og det er gratis at bruge ${SITE.name}.`}
      />
    </main>
  );
}
