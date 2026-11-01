"use client";

import type { Ref } from "react";

import { Input } from "@/components/ui/input";
import type { NumberField, YearField } from "@/config/forms/types";
import { cn } from "@/lib/utils";
import {
  describedBy,
  FieldDescription,
  FieldError,
  FieldLabel,
  type FieldIds,
} from "./field-parts";

type NumberInputProps = {
  field: NumberField | YearField;
  ids: FieldIds;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
};

/**
 * A whole number or a year. Uses a text input with the numeric keyboard
 * (type="number" behaves badly on phones). Anything but digits is ignored,
 * so "1.500.000" is read as 1500000, and numbers are shown with Danish
 * thousands separators while typing.
 */
export function NumberInput({
  field,
  ids,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: NumberInputProps) {
  const isYear = field.type === "year";
  const unit = field.type === "number" ? field.unit : undefined;
  const maxDigits = isYear ? 4 : 9;

  return (
    <div className="space-y-2">
      <FieldLabel field={field} ids={ids} />
      <FieldDescription field={field} ids={ids} />
      <div className={cn("relative", isYear ? "max-w-32" : "max-w-56")}>
        <Input
          ref={inputRef}
          id={ids.input}
          type="text"
          inputMode="numeric"
          autoComplete={field.autoComplete ?? "off"}
          value={
            value === undefined
              ? ""
              : isYear
                ? String(value)
                : value.toLocaleString("da-DK")
          }
          onChange={(event) => {
            const digits = event.target.value
              .replace(/\D/g, "")
              .slice(0, maxDigits);
            onChange(digits === "" ? undefined : Number(digits));
          }}
          onBlur={onBlur}
          placeholder={field.placeholder}
          className={cn("h-11 text-base md:text-base", unit && "pr-14")}
          {...describedBy(field, ids, error)}
        />
        {unit && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          >
            {unit}
          </span>
        )}
      </div>
      <FieldError ids={ids} error={error} />
    </div>
  );
}
