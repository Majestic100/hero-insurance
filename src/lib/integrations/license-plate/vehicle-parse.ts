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
 * Everything the register tells us about the vehicle, for the partners.
 * Every field is optional: what the register lacks is left out.
 */
export type VehicleFacts = {
  registrationNumber?: string;
  status?: string;
  statusDate?: string;
  type?: string;
  use?: string;
  vin?: string;
  make?: string;
  model?: string;
  variant?: string;
  modelType?: string;
  modelYear?: number;
  color?: string;
  chassisType?: string;
  fuelType?: string;
  engineCylinders?: number;
  engineVolume?: number;
  enginePower?: number;
  ownWeight?: number;
  totalWeight?: number;
  axles?: number;
  seats?: number;
  doors?: number;
  coupling?: boolean;
};

/** MotorAPI field -> our field. */
const MOTORAPI_FIELDS: Record<string, keyof VehicleFacts> = {
  registration_number: "registrationNumber",
  status: "status",
  status_date: "statusDate",
  type: "type",
  use: "use",
  vin: "vin",
  make: "make",
  model: "model",
  variant: "variant",
  model_type: "modelType",
  model_year: "modelYear",
  color: "color",
  chassis_type: "chassisType",
  fuel_type: "fuelType",
  engine_cylinders: "engineCylinders",
  engine_volume: "engineVolume",
  engine_power: "enginePower",
  own_weight: "ownWeight",
  total_weight: "totalWeight",
  axels: "axles",
  seats: "seats",
  doors: "doors",
  coupling: "coupling",
};

const NUMBER_FIELDS = new Set<keyof VehicleFacts>([
  "modelYear",
  "engineCylinders",
  "engineVolume",
  "enginePower",
  "ownWeight",
  "totalWeight",
  "axles",
  "seats",
  "doors",
]);

/** Reads a MotorAPI vehicle; undefined when it has no make or model. */
export function vehicleFromMotorApi(body: unknown): VehicleFacts | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }
  const facts: Record<string, unknown> = {};
  for (const [source, target] of Object.entries(MOTORAPI_FIELDS)) {
    const value = (body as Record<string, unknown>)[source];
    if (NUMBER_FIELDS.has(target)) {
      const number = typeof value === "string" ? Number(value) : value;
      if (typeof number === "number" && Number.isFinite(number) && number > 0) {
        facts[target] = number;
      }
    } else if (target === "coupling") {
      if (typeof value === "boolean") {
        facts[target] = value;
      }
    } else if (typeof value === "string" && value.trim()) {
      facts[target] = value.trim();
    }
  }
  const vehicle = facts as VehicleFacts;
  return vehicle.make || vehicle.model ? vehicle : undefined;
}

/** One line for the user, e.g. "Toyota Yaris 1.0 (2018)". */
export function describeVehicle(vehicle: VehicleFacts): string {
  const name = [vehicle.make, vehicle.model, vehicle.variant]
    .filter(Boolean)
    .join(" ");
  return vehicle.modelYear ? `${name} (${vehicle.modelYear})` : name;
}
