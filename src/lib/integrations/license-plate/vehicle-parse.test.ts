import { describe, expect, it } from "vitest";

import { describeVehicle, normalizePlate, vehicleFromMotorApi } from "./vehicle-parse";

describe("normalizePlate", () => {
  it("uppercases and removes spaces and dashes", () => {
    expect(normalizePlate(" ab 12-345 ")).toBe("AB12345");
    expect(normalizePlate("æø 123")).toBe("ÆØ123");
  });

  it("rejects what cannot be a plate", () => {
    expect(normalizePlate("A")).toBeUndefined();
    expect(normalizePlate("AB123456")).toBeUndefined();
    expect(normalizePlate("AB/123")).toBeUndefined();
  });
});

describe("vehicleFromMotorApi", () => {
  it("reads MotorAPI's answer, numbers as numbers, and leaves out blanks", () => {
    expect(
      vehicleFromMotorApi({
        registration_number: "AT21931",
        status: "Registreret",
        type: "Personbil",
        vin: "VF1BB0A0526123456",
        make: "Toyota",
        model: "Yaris",
        variant: "1.0",
        model_year: "2018",
        fuel_type: "Benzin",
        engine_power: 51,
        own_weight: 0,
        color: "",
        coupling: false,
        unknown_field: "x",
      }),
    ).toEqual({
      registrationNumber: "AT21931",
      status: "Registreret",
      type: "Personbil",
      vin: "VF1BB0A0526123456",
      make: "Toyota",
      model: "Yaris",
      variant: "1.0",
      modelYear: 2018,
      fuelType: "Benzin",
      enginePower: 51,
      coupling: false,
    });
  });

  it("gives nothing without make and model", () => {
    expect(vehicleFromMotorApi({ registration_number: "AB12345" })).toBeUndefined();
    expect(vehicleFromMotorApi(null)).toBeUndefined();
  });
});

describe("describeVehicle", () => {
  it("names the vehicle for the user", () => {
    expect(describeVehicle({ make: "Toyota", model: "Yaris", variant: "1.0", modelYear: 2018 })).toBe(
      "Toyota Yaris 1.0 (2018)",
    );
    expect(describeVehicle({ make: "Vespa", model: "LX" })).toBe("Vespa LX");
  });
});
