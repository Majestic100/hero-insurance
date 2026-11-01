"use client";

import { ChevronDownIcon } from "lucide-react";
import type { Ref } from "react";

import type { SelectField } from "@/config/forms/types";
import {
  describedBy,
  FieldDescription,
  FieldError,
  FieldLabel,
  type FieldIds,
} from "./field-parts";

type SelectInputProps = {
  field: SelectField;
  ids: FieldIds;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  onBlur: () => void;
  inputRef?: Ref<HTMLSelectElement>;
  error?: string;
};

/**
 * A native <select>: on phones it opens the system picker, which is easier
 * to use than a custom dropdown and works with every screen reader.
 */
export function SelectInput({
  field,
  ids,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: SelectInputProps) {
  return (
    <div className="space-y-2">
      <FieldLabel field={field} ids={ids} />
      <FieldDescription field={field} ids={ids} />
      <div className="relative">
        <select
          ref={inputRef}
          id={ids.input}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || undefined)}
          onBlur={onBlur}
          className="h-11 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-10 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          {...describedBy(field, ids, error)}
        >
          <option value="">{field.placeholder ?? "Vælg"}</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <FieldError ids={ids} error={error} />
    </div>
  );
}
