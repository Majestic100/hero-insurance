"use client";

import { CheckIcon, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

import type { FieldLookup } from "@/config/forms/types";
import {
  fieldLookupUrl,
  runFieldLookup,
  type FieldLookupResult as Result,
} from "@/lib/form/field-lookup";

const DEBOUNCE_MS = 300;

/**
 * What a register says about the field's value, e.g. the vehicle for a
 * license plate. Announced politely to screen readers; never an error.
 */
export function FieldLookupResult({ lookup, value }: { lookup: FieldLookup; value: string }) {
  const url = fieldLookupUrl(lookup, value);
  const [result, setResult] = useState<{ url: string; result: Result }>();

  useEffect(() => {
    if (!url) {
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void runFieldLookup(lookup, url, controller.signal).then((answer) => {
        if (answer && !controller.signal.aborted) {
          setResult({ url, result: answer });
        }
      });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lookup, url]);

  // Only show the answer for the value currently in the field.
  const current = url && result?.url === url ? result.result : undefined;
  return (
    <p aria-live="polite" className="min-h-5 text-sm">
      {current?.status === "found" && (
        <span className="flex items-center gap-1.5 font-medium">
          <CheckIcon aria-hidden className="size-4 shrink-0 text-primary" />
          {current.text}
        </span>
      )}
      {current?.status === "not-found" && (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <InfoIcon aria-hidden className="size-4 shrink-0" />
          {current.text}
        </span>
      )}
    </p>
  );
}
