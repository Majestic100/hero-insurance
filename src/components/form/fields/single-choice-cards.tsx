"use client";

import type { Ref } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SingleChoiceField } from "@/config/forms/types";
import { cn } from "@/lib/utils";
import { getOptionIcon } from "../option-icons";
import {
  describedBy,
  FieldDescription,
  FieldError,
  FieldLegend,
  type FieldIds,
} from "./field-parts";

type SingleChoiceCardsProps = {
  field: SingleChoiceField;
  ids: FieldIds;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef?: Ref<HTMLButtonElement>;
  error?: string;
};

/**
 * One choice as large cards (radio buttons). "list" shows full-width rows;
 * "grid" shows 2 per row, for short labels like Ja/Nej.
 */
export function SingleChoiceCards({
  field,
  ids,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: SingleChoiceCardsProps) {
  const isGrid = field.layout === "grid";

  return (
    <fieldset className="space-y-2">
      <FieldLegend field={field} />
      <FieldDescription field={field} ids={ids} />
      <RadioGroup
        value={value ?? ""}
        onValueChange={onChange}
        className={cn("gap-3", isGrid && "grid-cols-2")}
        {...describedBy(field, ids, error)}
      >
        {field.options.map((option, index) => {
          const optionId = `${ids.input}-${option.value}`;
          const Icon = getOptionIcon(option.icon);
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex min-h-14 cursor-pointer items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
            >
              <RadioGroupItem
                ref={index === 0 ? inputRef : undefined}
                id={optionId}
                value={option.value}
                onBlur={onBlur}
                aria-invalid={error ? true : undefined}
                className="size-5"
              />
              {Icon && (
                <Icon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
              )}
              <span className="grid gap-0.5">
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
      </RadioGroup>
      <FieldError ids={ids} error={error} />
    </fieldset>
  );
}
