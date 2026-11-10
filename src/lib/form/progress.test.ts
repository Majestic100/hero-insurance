import { describe, expect, it } from "vitest";

import {
  PROGRESS_LAST_STEP,
  PROGRESS_START,
  PROGRESS_STARTED,
  progressPercent,
} from "./progress";

describe("progressPercent", () => {
  it("moves forward when the first type is picked, and never back for more types", () => {
    expect(progressPercent(0, 3, false)).toBe(PROGRESS_START);
    expect(progressPercent(0, 4, true)).toBe(PROGRESS_STARTED);
    expect(progressPercent(0, 15, true)).toBe(PROGRESS_STARTED);
  });

  it("only grows from step to step, whatever the number of steps", () => {
    for (let total = 3; total <= 15; total++) {
      let previous = progressPercent(0, total, true);
      for (let index = 1; index < total; index++) {
        const current = progressPercent(index, total, true);
        expect(current).toBeGreaterThan(previous);
        previous = current;
      }
      expect(previous).toBe(PROGRESS_LAST_STEP);
    }
  });
});
