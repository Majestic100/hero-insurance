"use client";

import { Controller, get, useFormState, type Control } from "react-hook-form";

import type { FieldConfig, StepConfig } from "@/config/forms/types";
import type { FormValues } from "@/lib/form/step-sequence";
import { ChoiceCards } from "./fields/choice-cards";

/** Path of a field in the form values; insurance fields are namespaced. */
export function fieldPath(step: StepConfig, field: FieldConfig): string {
  return step.insuranceType ? `${step.insuranceType}.${field.name}` : field.name;
}

type FieldRendererProps = {
  step: StepConfig;
  field: FieldConfig;
  control: Control<FormValues>;
};

/** Renders one configured field. Add a case here for each new field type. */
export function FieldRenderer({ step, field, control }: FieldRendererProps) {
  const name = fieldPath(step, field);
  const { errors } = useFormState({ control, name });
  const error = (get(errors, name) as { message?: string } | undefined)
    ?.message;

  switch (field.type) {
    case "multi-choice":
      return (
        <Controller
          control={control}
          name={name}
          render={({ field: input }) => (
            <ChoiceCards
              field={field}
              value={(input.value as string[] | undefined) ?? []}
              onChange={input.onChange}
              onBlur={input.onBlur}
              inputRef={input.ref}
              error={error}
            />
          )}
        />
      );
  }
}
