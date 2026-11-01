"use client";

import { useId, type Ref } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import type { MultiChoiceField } from "@/config/forms/types";

type ChoiceCardsProps = {
  field: MultiChoiceField;
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  /** Attached to the first option, so the form can focus the field on error. */
  inputRef?: Ref<HTMLButtonElement>;
  error?: string;
};

/** Multi-select as large cards: easy to tap on mobile (min. 56px tall). */
export function ChoiceCards({
  field,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: ChoiceCardsProps) {
  const id = useId();
  const errorId = `${id}-error`;

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
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="sr-only">{field.label}</legend>
      <div className="grid gap-3">
        {field.options.map((option, index) => {
          const optionId = `${id}-${option.value}`;
          const checked = value.includes(option.value);
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex min-h-14 cursor-pointer items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
            >
              <Checkbox
                ref={index === 0 ? inputRef : undefined}
                id={optionId}
                checked={checked}
                onCheckedChange={(state) => toggle(option.value, state === true)}
                onBlur={onBlur}
                aria-invalid={error ? true : undefined}
                className="size-5"
              />
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
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
