import { ArrowRightIcon, CheckIcon } from "lucide-react";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { Button } from "@/components/ui/button";
import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
} from "@/config/forms/insurance-types";
import { PRESELECT_PARAM, SKIP_SELECTION_STEP, STEP_PARAM } from "@/lib/form/url-params";

/**
 * Pick several insurance types on the homepage, then open the form at the
 * first insurance step. A plain GET form with checkboxes, so it works before
 * (and without) JavaScript: /tilbud?forsikring=bil&forsikring=hus&trin=videre.
 * With nothing ticked the form opens on the selection step.
 */
export function InsurancePicker() {
  return (
    <form action="/tilbud" method="get" aria-label="Vælg forsikringer">
      <fieldset>
        <legend className="text-sm font-medium">
          Hvad vil du have tilbud på? Vælg gerne flere.
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6">
          {INSURANCE_TYPES.map((type) => {
            const info = INSURANCE_TYPE_INFO[type];
            const Icon = INSURANCE_ICONS[type];
            return (
              <label
                key={type}
                className="group relative flex min-h-22 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border bg-card px-2 py-3 text-center text-xs leading-tight font-medium shadow-xs transition-colors select-none hover:border-brand hover:bg-accent has-checked:border-brand has-checked:bg-accent has-checked:ring-2 has-checked:ring-brand/30 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 sm:text-sm"
              >
                <input
                  type="checkbox"
                  name={PRESELECT_PARAM}
                  value={info.slug}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className="absolute -top-2 -right-2 hidden size-5 items-center justify-center rounded-full bg-brand text-white group-has-checked:flex"
                >
                  <CheckIcon className="size-3.5" strokeWidth={3} />
                </span>
                <Icon aria-hidden className="size-6 text-brand" />
                {info.shortLabel}
              </label>
            );
          })}
        </div>
      </fieldset>
      <input type="hidden" name={STEP_PARAM} value={SKIP_SELECTION_STEP} />
      <Button type="submit" size="lg" className="mt-6 h-12 w-full text-base sm:w-auto sm:px-8">
        Få tilbud
        <ArrowRightIcon aria-hidden />
      </Button>
    </form>
  );
}
