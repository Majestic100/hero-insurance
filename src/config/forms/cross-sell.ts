import type { InsuranceType } from "./insurance-types";

/**
 * "Tilføj flere forsikringer" on each insurance step: types that are often
 * bought together with it, best first. The form shows the first two that
 * are not selected yet. More types per lead means more value per lead and,
 * for the user, a bigger package discount.
 */
export const CROSS_SELL: Record<InsuranceType, readonly InsuranceType[]> = {
  car: ["accident_health", "home_contents", "house"],
  home_contents: ["accident_health", "travel", "car"],
  house: ["home_contents", "accident_health", "car"],
  accident_health: ["home_contents", "life", "travel"],
  travel: ["accident_health", "home_contents", "car"],
  holiday_home: ["home_contents", "house", "accident_health"],
  motorcycle_atv_moped: ["car", "accident_health", "home_contents"],
  boat: ["home_contents", "accident_health", "car"],
  caravan: ["car", "home_contents", "accident_health"],
  pet: ["home_contents", "accident_health", "travel"],
  life: ["accident_health", "home_contents", "house"],
  change_of_ownership: ["house", "home_contents", "accident_health"],
};

/** Short Danish pitch per type, shown on the suggestion. */
export const CROSS_SELL_PITCH: Record<InsuranceType, string> = {
  car: "Dækker skader med og på bilen",
  home_contents: "Dækker dine ting derhjemme",
  house: "Dækker selve huset",
  accident_health: "Beskytter dig ved uheld",
  travel: "Dækker på ferien",
  holiday_home: "Dækker sommerhuset",
  motorcycle_atv_moped: "Til MC, ATV og knallert",
  boat: "Dækker båden",
  caravan: "Dækker campingvognen",
  pet: "Dækker dyrlægeregninger",
  life: "Sikrer dine nærmeste",
  change_of_ownership: "Når du sælger eller køber bolig",
};
