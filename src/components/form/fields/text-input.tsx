"use client";

import type { Ref } from "react";

import { Input } from "@/components/ui/input";
import type { TextField } from "@/config/forms/types";
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
  return (
    <div className="space-y-2">
      <FieldLabel field={field} ids={ids} />
      <FieldDescription field={field} ids={ids} />
      <Input
        ref={inputRef}
        id={ids.input}
        type="text"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={field.placeholder}
        maxLength={field.maxLength ?? 100}
        autoComplete={field.autoComplete ?? "off"}
        autoCapitalize={isPlate ? "characters" : undefined}
        spellCheck={isPlate ? false : undefined}
        className={cn("h-11 text-base md:text-base", isPlate && "uppercase")}
        {...describedBy(field, ids, error)}
      />
      <FieldError ids={ids} error={error} />
    </div>
  );
}
