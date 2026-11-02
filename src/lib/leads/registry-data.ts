import "server-only";

import type { FormConfig } from "@/config/forms/types";
import { getSelectedTypes, type FormValues } from "@/lib/form/step-sequence";
import {
  isLicensePlateLookupConfigured,
  lookupVehicle,
} from "@/lib/integrations/license-plate/motorapi";
import type { VehicleFacts } from "@/lib/integrations/license-plate/vehicle-parse";

/** Short, so a slow register never holds up saving the lead. */
const LOOKUP_TIMEOUT_MS = 3000;

export type RegistryRecord = {
  source: "motorapi";
  fetchedAt: string;
  vehicle: VehicleFacts;
};

/**
 * Adds register data to the parsed values, for the partners: for every
 * selected insurance step, each field with `lookup: "dk-license-plate"` is
 * looked up on the server and saved under `registry.<field name>` in that
 * insurance's answers. Done here, never taken from the browser. Lookups
 * that fail or find nothing are left out; the lead is saved regardless.
 */
export async function addRegistryData(
  config: FormConfig,
  parsed: FormValues,
): Promise<FormValues> {
  if (!isLicensePlateLookupConfigured()) {
    return parsed;
  }
  const selected = getSelectedTypes(parsed);
  const values = structuredClone(parsed);
  const lookups: Promise<void>[] = [];

  for (const step of config.steps) {
    if (!step.insuranceType || !selected.includes(step.insuranceType)) {
      continue;
    }
    const answers = values[step.insuranceType] as FormValues | undefined;
    for (const field of step.fields) {
      const plate = answers?.[field.name];
      if (field.type !== "text" || field.lookup !== "dk-license-plate" || typeof plate !== "string") {
        continue;
      }
      lookups.push(
        lookupVehicle(plate, { timeoutMs: LOOKUP_TIMEOUT_MS })
          .then((vehicle) => {
            if (vehicle && answers) {
              const registry = (answers.registry ??= {}) as Record<string, RegistryRecord>;
              registry[field.name] = {
                source: "motorapi",
                fetchedAt: new Date().toISOString(),
                vehicle,
              };
            }
          })
          .catch((error: unknown) => {
            console.error(
              "[leads] registry lookup failed:",
              error instanceof Error ? error.message : "unknown",
            );
          }),
      );
    }
  }

  await Promise.all(lookups);
  return values;
}
