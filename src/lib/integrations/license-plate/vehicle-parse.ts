/**
 * Vehicle data from a license plate lookup. Pure, so it is unit tested.
 */

/** Danish plates: 2-7 letters and digits, stored without spaces. */
export const PLATE_PATTERN = /^[A-ZÆØÅ0-9]{2,7}$/;

/** Uppercase without spaces or dashes, or undefined when not a plate. */
export function normalizePlate(plate: string): string | undefined {
  const normalized = plate.toUpperCase().replace(/[\s-]/g, "");
  return PLATE_PATTERN.test(normalized) ? normalized : undefined;
}

/**
 * Everything the register tells us about the vehicle, for the partners:
 * every field MotorAPI fills in, with camelCase keys (e.g. make, model,
 * variant, modelYear, firstRegistration, fuelType, enginePower, isLeasing,
 * leasingFrom, motInfo). Blank values are left out. The few fields we
 * read ourselves are typed.
 */
export type VehicleFacts = {
  registrationNumber?: string;
  make?: string;
  model?: string;
  variant?: string;
  modelYear?: number;
  /** ISO date, e.g. "2010-09-17+02:00". */
  firstRegistration?: string;
  [field: string]: unknown;
};

/**
 * Left out on purpose: the postal code where the vehicle is registered is
 * about the owner, not the vehicle, and we already have the user's own.
 */
const EXCLUDED_FIELDS = new Set(["registration_zipcode"]);

/** Values the register uses for "nothing". */
function isBlank(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    value === 0 ||
    (typeof value === "string" && (value.trim() === "" || value.trim() === "Ukendt"))
  );
}

const camelCase = (key: string) => key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

function clean(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(clean);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, inner]) => !isBlank(inner))
        .map(([key, inner]) => [camelCase(key), clean(inner)]),
    );
  }
  return typeof value === "string" ? value.trim() : value;
}

/** Reads a MotorAPI vehicle; undefined when it has no make or model. */
export function vehicleFromMotorApi(body: unknown): VehicleFacts | undefined {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return undefined;
  }
  const kept = Object.fromEntries(
    Object.entries(body).filter(([key]) => !EXCLUDED_FIELDS.has(key)),
  );
  const vehicle = clean(kept) as VehicleFacts;
  return vehicle.make || vehicle.model ? vehicle : undefined;
}

/** The model year, or else the year of first registration. */
export function vehicleYear(vehicle: VehicleFacts): number | undefined {
  if (typeof vehicle.modelYear === "number" && vehicle.modelYear > 1900) {
    return vehicle.modelYear;
  }
  const year = Number(String(vehicle.firstRegistration ?? "").slice(0, 4));
  return year > 1900 ? year : undefined;
}

/** One line for the user, e.g. "Toyota Yaris 1.0 (2018)". */
export function describeVehicle(vehicle: VehicleFacts): string {
  const name = [vehicle.make, vehicle.model, vehicle.variant]
    .filter(Boolean)
    .join(" ");
  const year = vehicleYear(vehicle);
  return year ? `${name} (${year})` : name;
}
