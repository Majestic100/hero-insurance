"use client";

import type { ChangeEvent, Ref } from "react";

import { Input } from "@/components/ui/input";
import type { TextField, TextFormat } from "@/config/forms/types";
import {
  describedBy,
  FieldDescription,
  FieldError,
  FieldLabel,
  type FieldIds,
} from "./field-parts";
import { EuPlateBand } from "./eu-plate-band";
import { FieldLookupResult } from "./field-lookup-result";

type TextInputProps = {
  field: TextField;
  ids: FieldIds;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
};

/** The right keyboard on mobile for each text format. */
const INPUT_BY_FORMAT: Record<
  TextFormat | "none",
  {
    type: "text" | "email" | "tel";
    inputMode?: "email" | "tel" | "numeric";
    autoCapitalize?: "off";
  }
> = {
  none: { type: "text" },
  email: { type: "email", inputMode: "email", autoCapitalize: "off" },
  "phone-dk": { type: "tel", inputMode: "tel" },
  "postal-code-dk": { type: "text", inputMode: "numeric" },
};

export function TextInput({
  field,
  ids,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: TextInputProps) {
  const isPlate = field.normalize === "uppercase-no-spaces";
  const input = INPUT_BY_FORMAT[field.format ?? "none"];
  const inputProps = {
    ref: inputRef,
    id: ids.input,
    type: input.type,
    inputMode: input.inputMode,
    value: value ?? "",
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    onBlur,
    placeholder: field.placeholder,
    maxLength: field.maxLength ?? 100,
    autoComplete: field.autoComplete ?? "off",
    autoCapitalize: isPlate ? "characters" : input.autoCapitalize,
    spellCheck: isPlate || field.format ? false : undefined,
    ...describedBy(field, ids, error),
  };
  return (
    <div className="space-y-2">
      <FieldLabel field={field} ids={ids} />
      <FieldDescription field={field} ids={ids} />
      {isPlate ? (
        // Looks like a Danish plate: the EU band on the left. The box shows
        // focus and errors; the input inside has no border of its own.
        <div className="flex max-w-sm overflow-hidden rounded-md border-2 border-foreground/80 bg-white shadow-xs focus-within:ring-[3px] focus-within:ring-ring/50 has-[[aria-invalid=true]]:border-destructive">
          <EuPlateBand />
          <input
            {...inputProps}
            className="h-14 w-full min-w-0 bg-transparent px-4 text-2xl font-bold tracking-[0.12em] uppercase outline-none placeholder:font-semibold placeholder:text-muted-foreground/40 sm:text-3xl"
          />
        </div>
      ) : (
        <Input {...inputProps} className="h-11 text-base md:text-base" />
      )}
      {field.lookup && !error && (
        <FieldLookupResult lookup={field.lookup} value={value ?? ""} />
      )}
      <FieldError ids={ids} error={error} />
    </div>
  );
}
