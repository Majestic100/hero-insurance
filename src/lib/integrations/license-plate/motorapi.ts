import "server-only";

import { getMotorApiEnv } from "@/lib/env/server";
import { createTtlCache } from "../cache";
import { normalizePlate, vehicleFromMotorApi, type VehicleFacts } from "./vehicle-parse";

/**
 * License plate lookups via MotorAPI (https://www.motorapi.dk), which
 * serves the Danish motor register (DMR). Server only: the key must never
 * reach the browser. MotorAPI sees the plates we look up (never who the
 * user is); a data processing agreement covers it. To be replaced by our
 * own copy of the register later (see docs/huskeliste.md).
 */

const BASE_URL = "https://v1.motorapi.dk/vehicles";

export class LicensePlateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LicensePlateError";
  }
}

const cache = createTtlCache<VehicleFacts | null>(24 * 60 * 60 * 1000, 5000);

export function isLicensePlateLookupConfigured(): boolean {
  return getMotorApiEnv() !== undefined;
}

/**
 * The vehicle with this plate, or null when the register has none. Throws
 * LicensePlateError when not configured or MotorAPI fails, so callers can
 * tell "unknown plate" from "could not check". Errors contain no plate.
 */
export async function lookupVehicle(
  plate: string,
  { timeoutMs = 5000 }: { timeoutMs?: number } = {},
): Promise<VehicleFacts | null> {
  const env = getMotorApiEnv();
  if (!env) {
    throw new LicensePlateError("MotorAPI is not configured");
  }
  const normalized = normalizePlate(plate);
  if (!normalized) {
    return null;
  }
  const cached = cache.get(normalized);
  if (cached !== undefined) {
    return cached;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/${encodeURIComponent(normalized)}`, {
      headers: { "X-AUTH-TOKEN": env.MOTORAPI_API_KEY, Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (error) {
    throw new LicensePlateError(
      `MotorAPI request failed: ${error instanceof Error ? error.name : "unknown"}`,
    );
  }
  if (response.status === 404) {
    cache.set(normalized, null);
    return null;
  }
  if (!response.ok) {
    throw new LicensePlateError(`MotorAPI answered ${response.status}`);
  }
  const vehicle = vehicleFromMotorApi(await response.json()) ?? null;
  cache.set(normalized, vehicle);
  return vehicle;
}
