"use client";

import { CheckIcon, PlusIcon } from "lucide-react";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { CROSS_SELL, CROSS_SELL_PITCH } from "@/config/forms/cross-sell";
import {
  INSURANCE_TYPE_INFO,
  type InsuranceType,
} from "@/config/forms/insurance-types";
import { cn } from "@/lib/utils";

type CrossSellProps = {
  current: InsuranceType;
  selected: readonly InsuranceType[];
  /** Types added from a suggestion: they stay visible, so they can be undone. */
  addedLater: readonly InsuranceType[];
  onChange: (type: InsuranceType, added: boolean) => void;
};

/**
 * "Tilføj flere forsikringer" on an insurance step: two related types, one
 * tap to add (or remove again). An added type gets its own step after the
 * current ones.
 */
export function CrossSell({ current, selected, addedLater, onChange }: CrossSellProps) {
  const suggestions = CROSS_SELL[current]
    .filter((type) => !selected.includes(type) || addedLater.includes(type))
    .slice(0, 2);
  if (suggestions.length === 0) return null;

  return (
    <section aria-label="Tilføj flere forsikringer" className="rounded-xl border bg-cream p-4">
      <h2 className="font-semibold">Få flere tilbud på én gang</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Flere forsikringer hos samme selskab giver ofte samlerabat.
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {suggestions.map((type) => {
          const added = selected.includes(type);
          const Icon = INSURANCE_ICONS[type];
          return (
            <li key={type}>
              <button
                type="button"
                aria-pressed={added}
                onClick={() => onChange(type, !added)}
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-lg border bg-card px-3 py-2 text-left transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  added && "border-primary bg-accent",
                )}
              >
                <Icon aria-hidden className="size-5 shrink-0 text-brand" />
                <span className="grid flex-1 gap-0.5">
                  <span className="font-medium">{INSURANCE_TYPE_INFO[type].shortLabel}</span>
                  <span className="text-sm text-muted-foreground">
                    {added ? "Tilføjet. Du får spørgsmålene bagefter." : CROSS_SELL_PITCH[type]}
                  </span>
                </span>
                {added ? (
                  <CheckIcon aria-hidden className="size-5 shrink-0 text-brand" />
                ) : (
                  <PlusIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
