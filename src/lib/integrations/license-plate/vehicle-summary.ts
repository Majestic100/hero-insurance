import type { VehicleFacts } from "./vehicle-parse";

/**
 * The vehicle data partners get for a license plate, in fixed fields (the
 * same for every lead), next to the full register data. Pure, so it is
 * unit tested.
 */

/** VIN position 10: model year codes, a 30-year cycle starting in 1980. */
const VIN_YEAR_CODES = "ABCDEFGHJKLMNPRSTVWXY123456789";

/**
 * The model year from position 10 of the VIN, if the make uses it (many
 * European makes, e.g. the VW group, do; others put "Z" or "0"). The code
 * repeats every 30 years, so the candidate closest to (and not after) the
 * first registration year + 1 is taken.
 */
export function modelYearFromVin(vin: string | undefined, firstRegistrationYear?: number): number | undefined {
  if (!vin || vin.length !== 17) return undefined;
  const index = VIN_YEAR_CODES.indexOf(vin[9].toUpperCase());
  if (index === -1) return undefined;
  const limit = (firstRegistrationYear ?? new Date().getFullYear()) + 1;
  let year = 1980 + index;
  while (year + 30 <= limit) year += 30;
  return year <= limit ? year : undefined;
}

export type ModelYearSource = "register" | "vin" | "first_registration";

export type VehicleSummary = {
  make?: string;
  model?: string;
  variant?: string;
  model_year?: number;
  /** Where model_year comes from, most to least certain. */
  model_year_source?: ModelYearSource;
  first_registration?: string;
  fuel_type?: string;
  engine_power_kw?: number;
  weight_kg?: number;
  vin?: string;
  is_leasing?: boolean;
  last_inspection?: string;
};

function firstRegistrationYear(vehicle: VehicleFacts): number | undefined {
  const year = Number(String(vehicle.firstRegistration ?? "").slice(0, 4));
  return year > 1900 ? year : undefined;
}

export function summarizeVehicle(vehicle: VehicleFacts): VehicleSummary {
  const registered = firstRegistrationYear(vehicle);
  const vin = typeof vehicle.vin === "string" ? vehicle.vin : undefined;

  let model_year: number | undefined;
  let model_year_source: ModelYearSource | undefined;
  if (typeof vehicle.modelYear === "number" && vehicle.modelYear > 1900) {
    model_year = vehicle.modelYear;
    model_year_source = "register";
  } else if (modelYearFromVin(vin, registered)) {
    model_year = modelYearFromVin(vin, registered);
    model_year_source = "vin";
  } else if (registered) {
    model_year = registered;
    model_year_source = "first_registration";
  }

  const mot = vehicle.motInfo as { date?: unknown } | undefined;
  const weight = vehicle.cerbWeight ?? vehicle.ownWeight;
  const summary: VehicleSummary = {
    make: vehicle.make,
    model: vehicle.model,
    variant: vehicle.variant,
    model_year,
    model_year_source,
    first_registration:
      typeof vehicle.firstRegistration === "string" ? vehicle.firstRegistration.slice(0, 10) : undefined,
    fuel_type: typeof vehicle.fuelType === "string" ? vehicle.fuelType : undefined,
    engine_power_kw: typeof vehicle.enginePower === "number" ? vehicle.enginePower : undefined,
    weight_kg: typeof weight === "number" ? weight : undefined,
    vin,
    is_leasing: typeof vehicle.isLeasing === "boolean" ? vehicle.isLeasing : undefined,
    last_inspection: typeof mot?.date === "string" ? mot.date : undefined,
  };
  return Object.fromEntries(
    Object.entries(summary).filter(([, value]) => value !== undefined),
  ) as VehicleSummary;
}
