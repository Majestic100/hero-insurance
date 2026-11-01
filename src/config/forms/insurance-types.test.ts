import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
  insuranceTypeFromSlug,
} from "./insurance-types";

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");

/** Insurance types allowed by the latest migration that sets the constraint. */
function typesAllowedByDatabase(): string[] {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
  for (const file of files.reverse()) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    const match = sql.match(/insurance_type in \(([^)]*)\)/);
    if (match) {
      return [...match[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
    }
  }
  throw new Error("No migration defines the insurance_type constraint");
}

describe("insurance types", () => {
  it("match the database check constraint", () => {
    expect([...typesAllowedByDatabase()].sort()).toEqual(
      [...INSURANCE_TYPES].sort(),
    );
  });

  it("have unique, ASCII-only slugs that map back to the type", () => {
    const slugs = INSURANCE_TYPES.map((type) => INSURANCE_TYPE_INFO[type].slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const type of INSURANCE_TYPES) {
      const { slug } = INSURANCE_TYPE_INFO[type];
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(insuranceTypeFromSlug(slug)).toBe(type);
    }
  });
});
