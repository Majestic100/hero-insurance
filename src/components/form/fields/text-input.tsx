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
  // Shared by <input> and <textarea>; ref and type are set per element.
  const inputProps = {
    id: ids.input,
    inputMode: field.inputMode ?? input.inputMode,
    value: value ?? "",
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
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
        // focus and errors; the input inside has no border of its own. Always
        // white with black text, like a real plate, whatever the page colors.
        <div className="flex max-w-sm overflow-hidden rounded-md border-2 border-black/80 bg-white text-black shadow-xs focus-within:ring-[3px] focus-within:ring-ring/50 has-[[aria-invalid=true]]:border-destructive">
          <EuPlateBand />
          <input
            {...inputProps}
            ref={inputRef}
            type={input.type}
            className="h-14 w-full min-w-0 bg-transparent px-4 text-2xl font-bold tracking-[0.12em] uppercase outline-none placeholder:font-semibold placeholder:text-black/30 sm:text-3xl"
          />
        </div>
      ) : field.multiline ? (
        <textarea
          {...inputProps}
          ref={inputRef as Ref<HTMLTextAreaElement>}
          rows={4}
          className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />
      ) : (
        <Input
          {...inputProps}
          ref={inputRef}
          type={input.type}
          className="h-11 text-base md:text-base"
        />
      )}
      {field.lookup && !error && (
        <FieldLookupResult lookup={field.lookup} value={value ?? ""} />
      )}
      <FieldError ids={ids} error={error} />
    </div>
  );
}
