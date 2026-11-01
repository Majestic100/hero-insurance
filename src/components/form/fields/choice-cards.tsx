"use client";

import type { Ref } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import type { MultiChoiceField } from "@/config/forms/types";
import { cn } from "@/lib/utils";
import { getOptionIcon } from "../option-icons";
import {
  describedBy,
  FieldDescription,
  FieldError,
  FieldLegend,
  type FieldIds,
} from "./field-parts";

type ChoiceCardsProps = {
  field: MultiChoiceField;
  ids: FieldIds;
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  /** Attached to the first option, so the form can focus the field on error. */
  inputRef?: Ref<HTMLButtonElement>;
  error?: string;
};

/**
 * Multi-select as large cards, easy to tap on mobile. "list" shows
 * full-width rows (min. 56px); "grid" shows compact tiles with an icon,
 * 2 per row on mobile and 3 from the `sm` breakpoint (min. 96px tall).
 */
export function ChoiceCards({
  field,
  ids,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: ChoiceCardsProps) {
  const isGrid = field.layout === "grid";

  function toggle(optionValue: string, checked: boolean) {
    const next = checked
      ? [...value, optionValue]
      : value.filter((item) => item !== optionValue);
    // Keep config order, so the stored value does not depend on click order.
    onChange(
      field.options
        .map((option) => option.value)
        .filter((item) => next.includes(item)),
    );
  }

  return (
    <fieldset className="space-y-2" {...describedBy(field, ids, error)}>
      <FieldLegend field={field} />
      <FieldDescription field={field} ids={ids} />
      <div
        className={cn("grid gap-3", isGrid && "grid-cols-2 sm:grid-cols-3")}
      >
        {field.options.map((option, index) => {
          const optionId = `${ids.input}-${option.value}`;
          const checked = value.includes(option.value);
          const Icon = getOptionIcon(option.icon);
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "relative flex cursor-pointer rounded-lg border bg-card transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                isGrid
                  ? "min-h-24 flex-col items-center justify-center gap-2 px-3 pt-5 pb-3 text-center"
                  : "min-h-14 items-center gap-4 px-4 py-3",
              )}
            >
              <Checkbox
                ref={index === 0 ? inputRef : undefined}
                id={optionId}
                checked={checked}
                onCheckedChange={(state) => toggle(option.value, state === true)}
                onBlur={onBlur}
                aria-invalid={error ? true : undefined}
                className={cn(isGrid ? "absolute top-2 right-2" : "size-5")}
              />
              {Icon && (
                <Icon
                  aria-hidden
                  className="size-6 shrink-0 text-muted-foreground"
                />
              )}
              <span className={cn("grid gap-0.5", isGrid && "text-sm")}>
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError ids={ids} error={error} />
    </fieldset>
  );
}
