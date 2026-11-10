import { PiggyBankIcon } from "lucide-react";

import { SAVINGS_CLAIM } from "@/config/site";

/** The savings claim under the heading of each insurance step. */
export function SavingsBanner() {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-medium">
      <PiggyBankIcon aria-hidden className="size-4 shrink-0 text-brand" />
      {SAVINGS_CLAIM}
    </p>
  );
}
