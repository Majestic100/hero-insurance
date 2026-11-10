import { formConfig } from "@/config/forms";
import {
  INSURANCE_TYPE_INFO,
  isInsuranceType,
} from "@/config/forms/insurance-types";
import type { FieldConfig, FormConfig } from "@/config/forms/types";

/**
 * A readable Danish summary of a lead's answers, for whoever calls the
 * customer from GoHighLevel. Uses the form config to turn codes into the
 * labels the user saw (e.g. "under_10000" -> "Under 10.000 km"). Pure, so it
 * is unit tested.
 */

export type StoredInsurance = { insurance_type: string; answers: unknown };

function displayValue(field: FieldConfig, value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  switch (field.type) {
    case "single-choice":
    case "select":
      return field.options.find((option) => option.value === value)?.label ?? String(value);
    case "multi-choice":
      return Array.isArray(value) && value.length > 0
        ? value
            .map((item) => field.options.find((option) => option.value === item)?.label ?? String(item))
            .join(", ")
        : undefined;
    case "address":
      return typeof value === "object" && value !== null && "text" in value
        ? String((value as { text: unknown }).text)
        : undefined;
    case "number":
      return field.unit ? `${value} ${field.unit}` : String(value);
    case "consent":
      return undefined;
    default:
      return String(value);
  }
}

/** "Toyota Yaris 1.0, 2018" from the motor register data saved with the lead. */
function describeRegistry(registry: unknown): string[] {
  if (!registry || typeof registry !== "object") return [];
  return Object.values(registry as Record<string, unknown>).flatMap((record) => {
    const item = record as { summary?: Record<string, unknown>; vehicle?: Record<string, unknown> } | null;
    const vehicle = item?.summary ?? item?.vehicle;
    if (!vehicle) return [];
    const name = [vehicle.make, vehicle.model, vehicle.variant].filter(Boolean).join(" ");
    const year = vehicle.model_year ?? vehicle.modelYear;
    const fuel = vehicle.fuel_type ?? vehicle.fuelType;
    const firstRegistration = vehicle.first_registration ?? vehicle.firstRegistration;
    const details = [
      year ? `årgang ${year}` : undefined,
      fuel ? String(fuel) : undefined,
      typeof firstRegistration === "string"
        ? `1. indregistrering ${firstRegistration.slice(0, 10)}`
        : undefined,
    ].filter(Boolean);
    return name ? [`Fra Motorregistret: ${name}${details.length ? ` (${details.join(", ")})` : ""}`] : [];
  });
}

export function buildAnswersSummary(
  insurances: readonly StoredInsurance[],
  config: FormConfig = formConfig,
): string {
  const blocks = insurances.flatMap(({ insurance_type: type, answers }) => {
    if (!isInsuranceType(type)) return [];
    const step = config.steps.find((candidate) => candidate.insuranceType === type);
    const values = (answers ?? {}) as Record<string, unknown>;
    const lines = (step?.fields ?? []).flatMap((field) => {
      const shown = displayValue(field, values[field.name]);
      return shown === undefined ? [] : [`${field.label}: ${shown}`];
    });
    lines.push(...describeRegistry(values.registry));
    return [`${INSURANCE_TYPE_INFO[type].label}\n${lines.map((line) => `- ${line}`).join("\n")}`];
  });
  return blocks.join("\n\n");
}
