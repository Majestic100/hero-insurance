import {
  ArrowRightIcon,
  BadgeCheckIcon,
  ChevronDownIcon,
  ClipboardListIcon,
  HandCoinsIcon,
  type LucideIcon,
  MapPinHouseIcon,
  MousePointerClickIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
  TimerIcon,
} from "lucide-react";
import Link from "next/link";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { Button } from "@/components/ui/button";
import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
} from "@/config/forms/insurance-types";
import { SITE } from "@/config/site";

// Draft copy (2026-11-10). Wording, claims and FAQ answers are reviewed by
// the owner and legal before launch (docs/huskeliste.md). Never add numbers
// (users, savings, ratings) or testimonials we cannot document.

const USPS: { icon: LucideIcon; text: string }[] = [
  { icon: BadgeCheckIcon, text: "Gratis og uforpligtende" },
  { icon: TimerIcon, text: "Tager få minutter" },
  { icon: ShieldCheckIcon, text: "Du vælger selv" },
];

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: MousePointerClickIcon,
    title: "Vælg forsikringer",
    text: "Vælg de forsikringer, du vil have tilbud på. Du kan vælge flere på én gang.",
  },
  {
    icon: ClipboardListIcon,
    title: "Svar på få spørgsmål",
    text: "Én formular for det hele. Vi udfylder meget af det for dig ud fra din adresse og nummerplade.",
  },
  {
    icon: PhoneCallIcon,
    title: "Modtag tilbud",
    text: "Forsikringsselskaberne kontakter dig med et tilbud. Du vælger selv, om du vil tage imod det.",
  },
];

const FAQ: { question: string; answer: string }[] = [
  {
    question: "Koster det noget?",
    answer:
      "Nej. Det er gratis for dig og helt uforpligtende. Du bestemmer selv, om du vil tage imod et tilbud.",
  },
  {
    question: "Hvordan tjener I penge?",
    answer:
      "Forsikringsselskaberne betaler os for at formidle din forespørgsel.",
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
      {/* Hero: one tap on a type opens the form with it preselected. */}
      <section className="bg-secondary/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
          <div className="max-w-2xl space-y-4">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Få tilbud på dine forsikringer. Udfyld kun én formular.
            </h1>
            <p className="text-lg text-muted-foreground">
              Vælg de forsikringer, du vil have tilbud på, og lad
              forsikringsselskaberne give dig et bud.
            </p>
          </div>

          <h2 className="mt-8 text-sm font-medium">Hvad vil du have tilbud på?</h2>
          <nav
            aria-label="Vælg forsikring"
            className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6"
          >
            {INSURANCE_TYPES.map((type) => {
              const info = INSURANCE_TYPE_INFO[type];
              const Icon = INSURANCE_ICONS[type];
              return (
                <Link
                  key={type}
                  href={`/tilbud?forsikring=${info.slug}`}
                  className="flex min-h-22 flex-col items-center justify-center gap-2 rounded-lg border bg-card px-2 py-3 text-center text-xs leading-tight font-medium shadow-xs transition-colors hover:border-brand hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:text-sm"
                >
                  <Icon aria-hidden className="size-6 text-brand" />
                  {info.shortLabel}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Button asChild size="lg" className="h-12 text-base sm:px-8">
              <Link href="/tilbud">
                Få tilbud
                <ArrowRightIcon aria-hidden />
              </Link>
            </Button>
            <ul className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
              {USPS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon aria-hidden className="size-4 text-brand" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Sådan virker det
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="flex gap-4 sm:flex-col">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon aria-hidden className="size-5" />
              </span>
              <div className="space-y-1">
                <h3 className="font-semibold">
                  {index + 1}. {title}
                </h3>
                <p className="text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

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

      {/* Transparency: how we make money. Builds trust, and partners must be
          named in the consent anyway. */}
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
          <HandCoinsIcon aria-hidden className="size-8 shrink-0 text-brand" />
          <div className="space-y-2">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Gratis for dig. Sådan tjener vi penge.
            </h2>
            <p className="text-muted-foreground">
              Forsikringsselskaberne betaler os for at formidle din
              forespørgsel. Derfor er det gratis for dig, og du er aldrig
              forpligtet til at købe noget. Vi sender kun dine oplysninger
              til de selskaber, du selv giver samtykke til.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ: native <details>, works without JavaScript. */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-12 sm:pb-16">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Spørgsmål og svar
        </h2>
        <div className="mt-6 divide-y rounded-lg border">
          {FAQ.map(({ question, answer }) => (
            <details key={question} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 font-medium [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDownIcon
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="px-4 pb-4 text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Klar til at tjekke dine forsikringer?
            </h2>
            <p className="opacity-90">
              Det tager få minutter, og det er gratis at bruge{" "}
              {SITE.name}.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-12 text-base sm:px-8"
          >
            <Link href="/tilbud">
              Få tilbud
              <ArrowRightIcon aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
