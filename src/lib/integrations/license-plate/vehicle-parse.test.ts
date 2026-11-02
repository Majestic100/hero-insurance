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

/** Shaped like a real MotorAPI answer (values made up). */
const motorApi = {
  registration_number: "AB12345",
  status: "Registreret",
  type: "Personbil",
  first_registration: "2010-09-17+02:00",
  vin: "WVWZZZ6RZAY000000",
  own_weight: null,
  cerb_weight: 1215,
  doors: null,
  make: "VOLKSWAGEN",
  model: "POLO",
  variant: "1,6 TDI",
  model_year: 0,
  color: "Ukendt",
  chassis_type: "",
  engine_power: 66,
  fuel_type: "Diesel",
  is_hybrid: false,
  is_leasing: false,
  registration_zipcode: "2100",
  mot_info: { type: "PeriodiskSyn", date: "2026-10-19", mileage: null },
};

describe("vehicleFromMotorApi", () => {
  it("keeps every filled-in field, camelCased, without blanks", () => {
    expect(vehicleFromMotorApi(motorApi)).toEqual({
      registrationNumber: "AB12345",
      status: "Registreret",
      type: "Personbil",
      firstRegistration: "2010-09-17+02:00",
      vin: "WVWZZZ6RZAY000000",
      cerbWeight: 1215,
      make: "VOLKSWAGEN",
      model: "POLO",
      variant: "1,6 TDI",
      enginePower: 66,
      fuelType: "Diesel",
      isHybrid: false,
      isLeasing: false,
      motInfo: { type: "PeriodiskSyn", date: "2026-10-19" },
    });
  });

  it("never keeps the owner's registration postal code", () => {
    expect(vehicleFromMotorApi(motorApi)).not.toHaveProperty("registrationZipcode");
  });

  it("gives nothing without make and model", () => {
    expect(vehicleFromMotorApi({ registration_number: "AB12345" })).toBeUndefined();
    expect(vehicleFromMotorApi(null)).toBeUndefined();
    expect(vehicleFromMotorApi([])).toBeUndefined();
  });
});

describe("describeVehicle", () => {
  it("names the vehicle, with the first registration year when the model year is missing", () => {
    expect(describeVehicle(vehicleFromMotorApi(motorApi)!)).toBe("VOLKSWAGEN POLO 1,6 TDI (2010)");
    expect(describeVehicle({ make: "Toyota", model: "Yaris", variant: "1.0", modelYear: 2018 })).toBe(
      "Toyota Yaris 1.0 (2018)",
    );
    expect(describeVehicle({ make: "Vespa", model: "LX" })).toBe("Vespa LX");
  });
});
