import { describe, expect, it } from "vitest";
import {
  LABEL_BASE_DELAY_S,
  LABEL_SHIFT_PX,
  LABEL_STEP_S,
  labelDelay,
  labelShift,
} from "@/lib/astra-label-motion";

describe("labelShift", () => {
  it("starts the left word to the left and the right word to the right", () => {
    expect(labelShift("left")).toBe(-LABEL_SHIFT_PX);
    expect(labelShift("right")).toBe(LABEL_SHIFT_PX);
    expect(labelShift("left")).toBeLessThan(0);
    expect(labelShift("right")).toBeGreaterThan(0);
  });

  it("moves each word by 44 px, as on the comparable hero", () => {
    expect(Math.abs(labelShift("left"))).toBe(44);
  });
});

describe("labelDelay", () => {
  it("matches the comparable hero's GPT (left) and Astra (right) delays", () => {
    // G, P, T: the letter nearest the middle goes first.
    expect([0, 1, 2].map((index) => labelDelay(index, 3, "left"))).toEqual([1.05, 0.95, 0.85]);
    // A, s, t, r, a.
    expect([0, 1, 2, 3, 4].map((index) => labelDelay(index, 5, "right"))).toEqual([0.85, 0.95, 1.05, 1.15, 1.25]);
  });

  it("starts the letter nearest the middle at the base delay", () => {
    expect(labelDelay(5, 6, "left")).toBe(LABEL_BASE_DELAY_S);
    expect(labelDelay(0, 4, "right")).toBe(LABEL_BASE_DELAY_S);
  });

  it("adds one step for each letter further from the middle", () => {
    for (let index = 1; index < 6; index++) {
      expect(labelDelay(index, 6, "right") - labelDelay(index - 1, 6, "right")).toBeCloseTo(LABEL_STEP_S, 10);
      expect(labelDelay(index - 1, 6, "left") - labelDelay(index, 6, "left")).toBeCloseTo(LABEL_STEP_S, 10);
    }
  });

  it("gives the two sides mirror-image timing", () => {
    for (let index = 0; index < 6; index++) {
      expect(labelDelay(index, 6, "left")).toBe(labelDelay(5 - index, 6, "right"));
    }
  });

  it("returns clean numbers with no floating-point tail", () => {
    for (let index = 0; index < 12; index++) {
      for (const side of ["left", "right"] as const) {
        const delay = labelDelay(index, 12, side);
        expect(delay).toBe(Math.round(delay * 1000) / 1000);
      }
    }
  });

  it("never goes below the base delay, even for an index outside the word", () => {
    expect(labelDelay(9, 3, "left")).toBe(LABEL_BASE_DELAY_S);
    expect(labelDelay(-4, 3, "right")).toBe(LABEL_BASE_DELAY_S);
  });
});
