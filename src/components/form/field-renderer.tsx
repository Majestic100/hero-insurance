"use client";

import { useId } from "react";
import { Controller, get, useFormState, type Control } from "react-hook-form";

import type { FieldConfig, StepConfig } from "@/config/forms/types";
import type { FormValues } from "@/lib/form/step-sequence";
import { ChoiceCards } from "./fields/choice-cards";
import { ConsentCheckbox } from "./fields/consent-checkbox";
import { fieldIds } from "./fields/field-parts";
import { NumberInput } from "./fields/number-input";
import { SelectInput } from "./fields/select-input";
import { SingleChoiceCards } from "./fields/single-choice-cards";
import { TextInput } from "./fields/text-input";

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
  const ids = fieldIds(useId());
  const { errors } = useFormState({ control, name });
  const error = (get(errors, name) as { message?: string } | undefined)
    ?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: input }) => {
        const shared = {
          ids,
          onBlur: input.onBlur,
          inputRef: input.ref,
          error,
        };
        switch (field.type) {
          case "multi-choice":
            return (
              <ChoiceCards
                {...shared}
                field={field}
                value={(input.value as string[] | undefined) ?? []}
                onChange={input.onChange}
              />
            );
          case "single-choice":
            return (
              <SingleChoiceCards
                {...shared}
                field={field}
                value={input.value as string | undefined}
                onChange={input.onChange}
              />
            );
          case "select":
            return (
              <SelectInput
                {...shared}
                field={field}
                value={input.value as string | undefined}
                onChange={input.onChange}
              />
            );
          case "text":
            return (
              <TextInput
                {...shared}
                field={field}
                value={input.value as string | undefined}
                onChange={input.onChange}
              />
            );
          case "consent":
            return (
              <ConsentCheckbox
                {...shared}
                field={field}
                value={input.value as boolean | undefined}
                onChange={input.onChange}
              />
            );
          case "number":
          case "year":
            return (
              <NumberInput
                {...shared}
                field={field}
                value={input.value as number | undefined}
                onChange={input.onChange}
              />
            );
        }
      }}
    />
  );
}
