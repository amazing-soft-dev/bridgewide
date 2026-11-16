import { describe, expect, it } from "vitest";
import {
  coreWhite,
  RAY_FADE_FROM,
  RAY_GAIN,
  RAY_REACH,
  rayIntensity,
  rayShape,
  rayStrength,
  WHITE_CORE_BASE,
  WHITE_CORE_EXTRA,
} from "@/lib/astra-star-shader-math";

describe("rayStrength", () => {
  it("gives fine and ambient stars no rays, whatever their glow", () => {
    for (const glow of [0, 0.15, 0.3, 0.55, 0.9, 1]) {
      expect(rayStrength("fine", glow)).toBe(0);
      expect(rayStrength("ambient", glow)).toBe(0);
    }
  });

  it("gives a hero flare (glow 1) full strength", () => {
    expect(rayStrength("flare", 1)).toBe(1);
  });

  it("gives an ordinary flare (glow 0.9) about half", () => {
    expect(rayStrength("flare", 0.9)).toBeCloseTo(0.5, 12);
  });

  it("grows with glow and stays between 0.5 and 1 for flares", () => {
    let last = 0;
    for (let glow = 0; glow <= 1; glow += 0.05) {
      const value = rayStrength("flare", glow);
      expect(value).toBeGreaterThanOrEqual(0.5);
      expect(value).toBeLessThanOrEqual(1);
      expect(value).toBeGreaterThanOrEqual(last);
      last = value;
    }
  });
});

describe("rayShape", () => {
  it("is brightest on the axes and symmetric in all four directions", () => {
    for (const distance of [0.2, 1, 2.5, 4]) {
      const right = rayShape(distance, 0);
      expect(rayShape(-distance, 0)).toBeCloseTo(right, 12);
      expect(rayShape(0, distance)).toBeCloseTo(right, 12);
      expect(rayShape(0, -distance)).toBeCloseTo(right, 12);
    }
  });

  it("is 1 at the centre and strong close in along an axis", () => {
    expect(rayShape(0, 0)).toBe(1);
    expect(rayShape(RAY_FADE_FROM, 0)).toBeCloseTo(1, 12);
  });

  it("fades out along the length and is gone at the reach", () => {
    let last = 2;
    for (let x = RAY_FADE_FROM; x <= RAY_REACH; x += 0.25) {
      const value = rayShape(x, 0);
      expect(value).toBeLessThanOrEqual(last);
      last = value;
    }
    // At the tip only the far tail of the other ray is left (exp(-15) on the axis).
    expect(rayShape(RAY_REACH, 0)).toBeLessThan(1e-6);
    expect(rayShape(RAY_REACH + 3, 0)).toBeLessThan(1e-9);
  });

  it("is thin: a fraction of a radius off the axis the ray has mostly gone", () => {
    expect(rayShape(2, 0.25)).toBeLessThan(rayShape(2, 0) * 0.5);
    expect(rayShape(2, 1)).toBeLessThan(rayShape(2, 0) * 0.06);
  });

  it("leaves the diagonals dark away from the centre", () => {
    expect(rayShape(2, 2)).toBeLessThan(0.01);
    expect(rayShape(3, 3)).toBeLessThan(0.001);
  });

  it("stays between 0 and 1", () => {
    for (let x = -6; x <= 6; x += 0.3) {
      for (let y = -6; y <= 6; y += 0.3) {
        const value = rayShape(x, y);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("rayIntensity", () => {
  it("scales the shape by the gain and the star's strength", () => {
    expect(rayIntensity(1, 0, 1)).toBeCloseTo(rayShape(1, 0) * RAY_GAIN, 12);
    expect(rayIntensity(1, 0, 0.5)).toBeCloseTo(rayShape(1, 0) * RAY_GAIN * 0.5, 12);
  });

  it("adds nothing to a star without rays, anywhere", () => {
    for (let x = -6; x <= 6; x += 0.5) {
      for (let y = -6; y <= 6; y += 0.5) expect(rayIntensity(x, y, 0)).toBe(0);
    }
  });

  it("clamps an out-of-range strength", () => {
    expect(rayIntensity(1, 0, 4)).toBe(rayIntensity(1, 0, 1));
    expect(rayIntensity(1, 0, -4)).toBe(0);
  });
});

describe("coreWhite", () => {
  it("is exactly the old fixed amount for a star without rays", () => {
    expect(coreWhite(0)).toBe(WHITE_CORE_BASE);
    expect(WHITE_CORE_BASE).toBe(0.18);
  });

  it("is whiter for a star with rays", () => {
    expect(coreWhite(1)).toBeCloseTo(WHITE_CORE_BASE + WHITE_CORE_EXTRA, 12);
    expect(coreWhite(0.5)).toBeGreaterThan(coreWhite(0));
    expect(coreWhite(1)).toBeGreaterThan(coreWhite(0.5));
  });

  it("never mixes more than fully white, and clamps its input", () => {
    expect(coreWhite(1)).toBeLessThan(1);
    expect(coreWhite(9)).toBe(coreWhite(1));
    expect(coreWhite(-9)).toBe(coreWhite(0));
  });
});
