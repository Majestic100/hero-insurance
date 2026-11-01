"use client";

import type { Ref } from "react";

import { Input } from "@/components/ui/input";
import type { TextField, TextFormat } from "@/config/forms/types";
import { cn } from "@/lib/utils";
import {
  describedBy,
  FieldDescription,
  FieldError,
  FieldLabel,
  type FieldIds,
} from "./field-parts";

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
  return (
    <div className="space-y-2">
      <FieldLabel field={field} ids={ids} />
      <FieldDescription field={field} ids={ids} />
      <Input
        ref={inputRef}
        id={ids.input}
        type={input.type}
        inputMode={input.inputMode}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={field.placeholder}
        maxLength={field.maxLength ?? 100}
        autoComplete={field.autoComplete ?? "off"}
        autoCapitalize={isPlate ? "characters" : input.autoCapitalize}
        spellCheck={isPlate || field.format ? false : undefined}
        className={cn("h-11 text-base md:text-base", isPlate && "uppercase placeholder:normal-case")}
        {...describedBy(field, ids, error)}
      />
      <FieldError ids={ids} error={error} />
    </div>
  );
}
