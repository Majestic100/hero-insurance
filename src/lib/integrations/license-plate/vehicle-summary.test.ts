import { describe, expect, it } from "vitest";

import { modelYearFromVin, summarizeVehicle } from "./vehicle-summary";

describe("modelYearFromVin", () => {
  it("reads position 10, in the cycle that fits the first registration", () => {
    expect(modelYearFromVin("WVWZZZ6RZAY000000", 2010)).toBe(2010);
    expect(modelYearFromVin("WVWZZZ6RZAY000000", 1981)).toBe(1980);
    expect(modelYearFromVin("WVWZZZAUZLP000000", 2019)).toBe(2020); // model year after registration
    expect(modelYearFromVin("WVWZZZAUZ8P000000", 2008)).toBe(2008);
  });

  it("gives up when the make does not use it", () => {
    expect(modelYearFromVin("WBA0000000Z000000", 2015)).toBeUndefined();
    expect(modelYearFromVin("WBA00000000000000", 2015)).toBeUndefined();
    expect(modelYearFromVin("TOO-SHORT")).toBeUndefined();
    expect(modelYearFromVin(undefined)).toBeUndefined();
  });
});

describe("summarizeVehicle", () => {
  it("prefers the register's model year, then the VIN, then the first registration", () => {
    expect(summarizeVehicle({ make: "Toyota", model: "Yaris", modelYear: 2018 })).toMatchObject({
      model_year: 2018,
      model_year_source: "register",
    });
    expect(
      summarizeVehicle({
        make: "VOLKSWAGEN",
        model: "POLO",
        variant: "1,6 TDI",
        vin: "WVWZZZ6RZAY000000",
        firstRegistration: "2010-09-17+02:00",
        fuelType: "Diesel",
        enginePower: 66,
        cerbWeight: 1215,
        isLeasing: false,
        motInfo: { type: "PeriodiskSyn", date: "2026-10-19" },
      }),
    ).toEqual({
      make: "VOLKSWAGEN",
      model: "POLO",
      variant: "1,6 TDI",
      model_year: 2010,
      model_year_source: "vin",
      first_registration: "2010-09-17",
      fuel_type: "Diesel",
      engine_power_kw: 66,
      weight_kg: 1215,
      vin: "WVWZZZ6RZAY000000",
      is_leasing: false,
      last_inspection: "2026-10-19",
    });
    expect(
      summarizeVehicle({ make: "BMW", model: "320", vin: "WBA0000000Z000000", firstRegistration: "2015-03-01" }),
    ).toMatchObject({ model_year: 2015, model_year_source: "first_registration" });
  });
});
