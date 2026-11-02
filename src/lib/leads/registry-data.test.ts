import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const lookupVehicle = vi.fn();
const configured = vi.fn(() => true);
vi.mock("@/lib/integrations/license-plate/motorapi", () => ({
  lookupVehicle: (...args: unknown[]) => lookupVehicle(...args),
  isLicensePlateLookupConfigured: () => configured(),
}));

const { formConfig } = await import("@/config/forms");
const { addRegistryData } = await import("./registry-data");

const values = {
  insuranceTypes: ["car", "travel"],
  car: { hasLicensePlate: "yes", licensePlate: "AB12345" },
  travel: { tripType: "annual" },
};

describe("addRegistryData", () => {
  beforeEach(() => {
    lookupVehicle.mockReset();
    configured.mockReturnValue(true);
  });

  it("saves the vehicle under the insurance's answers, looked up on the server", async () => {
    lookupVehicle.mockResolvedValue({ make: "Toyota", model: "Yaris" });
    const result = await addRegistryData(formConfig, values);
    expect(lookupVehicle).toHaveBeenCalledWith("AB12345", { timeoutMs: 3000 });
    expect(result.car).toMatchObject({
      licensePlate: "AB12345",
      registry: {
        licensePlate: { source: "motorapi", vehicle: { make: "Toyota", model: "Yaris" } },
      },
    });
    // The input is not changed.
    expect(values.car).not.toHaveProperty("registry");
  });

  it("saves the lead without vehicle data when the lookup fails or finds nothing", async () => {
    lookupVehicle.mockRejectedValue(new Error("MotorAPI answered 500"));
    const failed = await addRegistryData(formConfig, values);
    expect(failed.car).not.toHaveProperty("registry");

    lookupVehicle.mockResolvedValue(null);
    expect((await addRegistryData(formConfig, values)).car).not.toHaveProperty("registry");
  });

  it("skips unselected insurances and does nothing when not configured", async () => {
    await addRegistryData(formConfig, { ...values, insuranceTypes: ["travel"] });
    expect(lookupVehicle).not.toHaveBeenCalled();

    configured.mockReturnValue(false);
    expect(await addRegistryData(formConfig, values)).toBe(values);
    expect(lookupVehicle).not.toHaveBeenCalled();
  });
});
