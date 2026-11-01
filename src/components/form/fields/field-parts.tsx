import { Label } from "@/components/ui/label";
import type { FieldConfig } from "@/config/forms/types";
import { cn } from "@/lib/utils";

/** Ids that connect a field's input with its description and error. */
export type FieldIds = {
  input: string;
  description: string;
  error: string;
};

export function fieldIds(baseId: string): FieldIds {
  return {
    input: `${baseId}-input`,
    description: `${baseId}-description`,
    error: `${baseId}-error`,
  };
}

/** Props that link an input to its help text and error, for screen readers. */
export function describedBy(
  field: FieldConfig,
  ids: FieldIds,
  error: string | undefined,
) {
  const describedByIds = [
    field.description ? ids.description : undefined,
    error ? ids.error : undefined,
  ].filter(Boolean);
  return {
    "aria-describedby": describedByIds.length
      ? describedByIds.join(" ")
      : undefined,
    "aria-invalid": error ? true : undefined,
  };
}

function LabelText({ field }: { field: FieldConfig }) {
  return (
    <>
      {field.label}
      {field.optional && (
        <span className="font-normal text-muted-foreground">(valgfri)</span>
      )}
    </>
  );
}

/** Label for a single input (text, number, year, select). */
export function FieldLabel({ field, ids }: { field: FieldConfig; ids: FieldIds }) {
  return (
    <Label
      htmlFor={ids.input}
      className={cn("text-base leading-snug", field.hideLabel && "sr-only")}
    >
      <LabelText field={field} />
    </Label>
  );
}

/** Legend for a group of options (single- and multi-choice). */
export function FieldLegend({ field }: { field: FieldConfig }) {
  return (
    <legend
      className={cn(
        "mb-3 flex items-center gap-2 text-base leading-snug font-medium",
        field.hideLabel && "sr-only",
      )}
    >
      <LabelText field={field} />
    </legend>
  );
}

export function FieldDescription({
  field,
  ids,
}: {
  field: FieldConfig;
  ids: FieldIds;
}) {
  if (!field.description) {
    return null;
  }
  return (
    <p id={ids.description} className="text-sm text-muted-foreground">
      {field.description}
    </p>
  );
}

export function FieldError({ ids, error }: { ids: FieldIds; error?: string }) {
  if (!error) {
    return null;
  }
  return (
    <p id={ids.error} role="alert" className="text-sm text-destructive">
      {error}
    </p>
  );
}
