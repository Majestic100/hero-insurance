import { ArrowRightIcon, CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList } from "@/components/marketing/faq-list";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { SavingsHighlight } from "@/components/marketing/savings-highlight";
import { UspList } from "@/components/marketing/usp-list";
import { Button } from "@/components/ui/button";
import { INSURANCE_TYPE_INFO } from "@/config/forms/insurance-types";
import type { LandingPageContent } from "@/config/landing-pages";

export function landingPageMetadata(page: LandingPageContent): Metadata {
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: page.path },
  };
}

/** A landing page for one insurance type. Every button opens the form with it preselected. */
export function LandingPage({ page }: { page: LandingPageContent }) {
  const info = INSURANCE_TYPE_INFO[page.insuranceType];
  const Icon = INSURANCE_ICONS[page.insuranceType];
  const formHref = `/tilbud?forsikring=${info.slug}`;

  return (
    <main className="flex flex-1 flex-col">
      <section className="bg-secondary/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
          <div className="max-w-2xl space-y-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Icon aria-hidden className="size-5" />
              {info.label}
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {page.heading}
            </h1>
            <SavingsHighlight />
            <p className="text-lg text-muted-foreground">{page.intro}</p>
          </div>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
            <Button asChild size="lg" className="h-12 text-base sm:px-8">
              <Link href={formHref}>
                Få tilbud på {info.shortLabel.toLowerCase()}
                <ArrowRightIcon aria-hidden />
              </Link>
            </Button>
            <UspList />
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="border-y bg-cream">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 sm:py-16 md:grid-cols-[3fr_2fr]">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              {page.coverage.title}
            </h2>
            <ul className="mt-6 space-y-4">
              {page.coverage.items.map((item) => (
                <li key={item.title} className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              {page.priceFactors.title}
            </h2>
            <ul className="mt-6 space-y-3">
              {page.priceFactors.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Selskaberne vurderer prisen forskelligt. Derfor kan det betale
              sig at få tilbud fra flere.
            </p>
          </div>
        </div>
      </section>

      <FaqList items={page.faq} />

      <CtaBand
        title={`Få tilbud på din ${info.label.toLowerCase()}`}
        text="Det tager få minutter, og det er gratis og uforpligtende."
        href={formHref}
      />
    </main>
  );
}
