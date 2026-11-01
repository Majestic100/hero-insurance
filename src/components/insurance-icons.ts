import {
  CaravanIcon,
  CarIcon,
  HeartHandshakeIcon,
  HeartPulseIcon,
  HouseIcon,
  KeyIcon,
  MotorbikeIcon,
  PawPrintIcon,
  PlaneIcon,
  SailboatIcon,
  SofaIcon,
  TreePineIcon,
  type LucideIcon,
} from "lucide-react";

import type { InsuranceType } from "@/config/forms/insurance-types";

/** Icon per insurance type. Kept out of the config, which is plain data. */
export const INSURANCE_ICONS: Record<InsuranceType, LucideIcon> = {
  car: CarIcon,
  home_contents: SofaIcon,
  house: HouseIcon,
  accident_health: HeartPulseIcon,
  travel: PlaneIcon,
  holiday_home: TreePineIcon,
  motorcycle_atv_moped: MotorbikeIcon,
  boat: SailboatIcon,
  caravan: CaravanIcon,
  pet: PawPrintIcon,
  life: HeartHandshakeIcon,
  change_of_ownership: KeyIcon,
};
