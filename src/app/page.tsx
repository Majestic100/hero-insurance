import { CarIcon, ChevronRightIcon, HouseIcon, SofaIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
  type InsuranceType,
} from "@/config/forms/insurance-types";

const ICONS: Record<InsuranceType, LucideIcon> = {
  car: CarIcon,
  home_contents: SofaIcon,
  house: HouseIcon,
};

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-10 sm:py-16">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sammenlign forsikringer
        </h1>
        <p className="text-lg text-muted-foreground">
          Få tilbud på bil-, indbo- og husforsikring ét sted. Det tager få
          minutter.
        </p>
      </div>

      <nav aria-label="Vælg forsikring" className="grid gap-3">
        {INSURANCE_TYPES.map((type) => {
          const info = INSURANCE_TYPE_INFO[type];
          const Icon = ICONS[type];
          return (
            <Link
              key={type}
              href={`/tilbud?forsikring=${info.slug}`}
              className="flex min-h-16 items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Icon aria-hidden className="size-6 shrink-0 text-muted-foreground" />
              <span className="grid flex-1 gap-0.5">
                <span className="font-medium">{info.label}</span>
                <span className="text-sm text-muted-foreground">
                  {info.description}
                </span>
              </span>
              <ChevronRightIcon aria-hidden className="size-5 text-muted-foreground" />
            </Link>
          );
        })}
      </nav>

      <Button asChild size="lg" className="h-11 w-full sm:w-auto sm:self-start">
        <Link href="/tilbud">Kom i gang</Link>
      </Button>
    </main>
  );
}
