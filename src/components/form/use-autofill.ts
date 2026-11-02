"use client";

import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { FieldConfig, StepConfig } from "@/config/forms/types";
import {
  fitsField,
  getAutofillRequests,
  mayAutofill,
  runAutofill,
  type AutofillRequest,
} from "@/lib/form/autofill";
import type { FormValues } from "@/lib/form/step-sequence";
import { fieldPath } from "./field-renderer";

/**
 * Runs the step's autofill lookups (e.g. city from postal code, BBR facts
 * from the address) whenever their source changes, and fills in the result
 * unless the user has typed something else in the field.
 */
export function useAutofill(
  step: StepConfig,
  fields: readonly FieldConfig[],
  values: FormValues,
  form: UseFormReturn<FormValues>,
) {
  // Path -> the value we filled in last, to tell it from the user's own.
  const lastFilled = useRef<Record<string, unknown>>({});
  const requests = getAutofillRequests(step, fields, values);
  // A stable key, so the effect only runs when a lookup changes.
  const key = JSON.stringify(requests);

  useEffect(() => {
    let cancelled = false;
    for (const request of JSON.parse(key) as AutofillRequest[]) {
      const field = fields.find((candidate) => candidate.name === request.target);
      if (!field) {
        continue;
      }
      const path = fieldPath(step, field);
      void runAutofill(request).then((value) => {
        if (
          cancelled ||
          !fitsField(field, value) ||
          !mayAutofill(form.getValues(path), lastFilled.current[path])
        ) {
          return;
        }
        lastFilled.current[path] = value;
        form.setValue(path, value, { shouldDirty: true });
        form.clearErrors(path);
      });
    }
    return () => {
      cancelled = true;
    };
    // `fields` and `step` change with every render; `key` captures what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, form]);
}
