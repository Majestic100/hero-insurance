import Link from "next/link";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { Button } from "@/components/ui/button";
import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
} from "@/config/forms/insurance-types";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:py-16">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sammenlign forsikringer
        </h1>
        <p className="text-lg text-muted-foreground">
          Vælg de forsikringer, du vil have tilbud på. Det tager få minutter.
        </p>
      </div>

      <nav
        aria-label="Vælg forsikring"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {INSURANCE_TYPES.map((type) => {
          const info = INSURANCE_TYPE_INFO[type];
          const Icon = INSURANCE_ICONS[type];
          return (
            <Link
              key={type}
              href={`/tilbud?forsikring=${info.slug}`}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border bg-card px-3 py-3 text-center text-sm font-medium transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Icon aria-hidden className="size-6 text-muted-foreground" />
              {info.shortLabel}
            </Link>
          );
        })}
      </nav>

      <Button asChild size="lg" className="h-11 w-full sm:w-auto sm:self-center">
        <Link href="/tilbud">Kom i gang</Link>
      </Button>
    </main>
  );
}
