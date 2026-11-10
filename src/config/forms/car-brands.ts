import type { ChoiceOption } from "./types";

/**
 * Car makes for the make dropdown (cars without a known plate), sold in
 * Denmark. Alphabetical; "Andet" last. Values are stored with the lead, so
 * never change a value, only add new makes.
 */
const MAKES = [
  "Aiways", "Aixam", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW",
  "BYD", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Cupra", "Dacia",
  "Dodge", "DS", "Ferrari", "Fiat", "Ford", "Genesis", "GWM", "Honda",
  "Hongqi", "Hyundai", "Jaguar", "Jeep", "Kia", "Lamborghini", "Lancia",
  "Land Rover", "Leapmotor", "Lexus", "Ligier", "Lotus", "Lucid", "Lynk & Co",
  "Maserati", "Maxus", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Microcar",
  "Mini", "Mitsubishi", "NIO", "Nissan", "Opel", "Peugeot", "Polestar",
  "Porsche", "Renault", "Rolls-Royce", "Saab", "Seat", "Skoda", "Smart",
  "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
  "Xpeng", "Zeekr",
] as const;

function toValue(make: string): string {
  return make
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

const [first, ...rest] = MAKES.map(
  (make): ChoiceOption => ({ value: toValue(make), label: make }),
);

export const CAR_MAKES: readonly [ChoiceOption, ...ChoiceOption[]] = [
  first,
  ...rest,
  { value: "other", label: "Andet mærke" },
];
