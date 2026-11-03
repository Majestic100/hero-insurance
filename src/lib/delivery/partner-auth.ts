import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import { PARTNERS } from "@/config/partners";
import { getPartnerApiKey } from "@/lib/env/server";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/**
 * The partner that owns the API key in `Authorization: Bearer <key>`, or
 * undefined. Compares in constant time, and checks every partner, so the
 * answer time does not reveal which keys exist.
 */
export function findPartnerByAuthorization(header: string | null): string | undefined {
  const match = header?.match(/^Bearer (\S+)$/);
  if (!match) {
    return undefined;
  }
  const given = digest(match[1]);
  let found: string | undefined;
  for (const partner of PARTNERS) {
    const key = getPartnerApiKey(partner.id);
    if (key && timingSafeEqual(digest(key), given)) {
      found = partner.id;
    }
  }
  return found;
}
