import type { LucideIcon } from "lucide-react";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { isInsuranceType } from "@/config/forms/insurance-types";

/**
 * Resolves the `icon` key of a choice option to an icon component. Config
 * stays plain data; icons live here. Add new icon sets as they are needed.
 */
export function getOptionIcon(key: string | undefined): LucideIcon | undefined {
  if (isInsuranceType(key)) {
    return INSURANCE_ICONS[key];
  }
  return undefined;
}
