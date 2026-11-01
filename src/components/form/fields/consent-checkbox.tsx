"use client";

import Link from "next/link";
import type { Ref } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import type { ConsentField } from "@/config/forms/types";
import { describedBy, FieldError, type FieldIds } from "./field-parts";

type ConsentCheckboxProps = {
  field: ConsentField;
  ids: FieldIds;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  onBlur: () => void;
  inputRef?: Ref<HTMLButtonElement>;
  error?: string;
};

/**
 * A consent: the full text next to a checkbox, so the user sees exactly
 * what they agree to. The whole card is tappable.
 */
export function ConsentCheckbox({
  field,
  ids,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: ConsentCheckboxProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-3 rounded-lg border bg-card p-4 has-[[data-state=checked]]:border-primary has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
        <Checkbox
          ref={inputRef}
          id={ids.input}
          checked={value === true}
          onCheckedChange={(state) => onChange(state === true)}
          onBlur={onBlur}
          className="mt-0.5 size-5"
          {...describedBy(field, ids, error)}
        />
        <div className="space-y-1 text-sm leading-relaxed">
          <label htmlFor={ids.input} className="block cursor-pointer">
            <span className="sr-only">{field.label}: </span>
            {field.text}
            {field.optional && (
              <span className="text-muted-foreground"> (valgfri)</span>
            )}
          </label>
          {field.link && (
            <Link
              href={field.link.href}
              target="_blank"
              className="inline-block min-h-6 underline underline-offset-4"
            >
              {field.link.label}
            </Link>
          )}
        </div>
      </div>
      <FieldError ids={ids} error={error} />
    </div>
  );
}
