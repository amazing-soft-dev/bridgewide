import { describe, expect, it } from "vitest";
import {
  COLOR_ENERGY_GAIN,
  core,
  colorEnergy,
  cubicCoverage,
  filteredCoverage,
  MIN_QUAD_PX,
  pointQuad,
  RAY_GAIN,
  rayIntensity,
  rayShape,
  rayStrength,
  resolved,
  smoothstep,
  UNRESOLVED_CORE,
  WHITE_CORE,
  whiteCore,
} from "@/lib/astra-star-shader-math";

describe("smoothstep", () => {
  it("is 0 below, 1 above and 0.5 halfway", () => {
    expect(smoothstep(1, 3, 0)).toBe(0);
    expect(smoothstep(1, 3, 4)).toBe(1);
    expect(smoothstep(1, 3, 2)).toBeCloseTo(0.5);
  });
});

describe("pointQuad", () => {
  it("is the star's diameter, but never under the minimum quad", () => {
    expect(pointQuad(12)).toBe(12);
    expect(pointQuad(1.5)).toBe(MIN_QUAD_PX);
  });
});

describe("cubicCoverage", () => {
  it("is the cubic B-spline: 2/3 at the centre, 1/6 at one pixel, 0 from two", () => {
    expect(cubicCoverage(0)).toBeCloseTo(2 / 3);
    expect(cubicCoverage(1)).toBeCloseTo(1 / 6);
    expect(cubicCoverage(-1)).toBeCloseTo(1 / 6);
    expect(cubicCoverage(2)).toBe(0);
    expect(cubicCoverage(3)).toBe(0);
  });

  it("sums to 1 across whole-pixel offsets, so a filtered point keeps its light", () => {
    let total = 0;
    for (let x = -2; x <= 2; x++) total += cubicCoverage(x);
    expect(total).toBeCloseTo(1, 6);
  });
});

describe("filteredCoverage", () => {
  it("grows with the square of the diameter", () => {
    expect(filteredCoverage(0, 0, 2) / filteredCoverage(0, 0, 1)).toBeCloseTo(4);
  });
});

describe("core", () => {
  it("is full at the centre and gone at the edge", () => {
    expect(core(0)).toBe(1);
    expect(core(0.05)).toBe(1);
    expect(core(1)).toBe(0);
  });

  it("falls steadily from the centre outward", () => {
    let last = core(0);
    for (let d = 0.1; d <= 1; d += 0.1) {
      const value = core(d);
      expect(value).toBeLessThanOrEqual(last);
      last = value;
    }
    expect(core(0.5)).toBeLessThan(0.35);
  });
});

describe("resolved", () => {
  it("is 0 for a sub-2px star and 1 from 4px", () => {
    expect(resolved(1)).toBe(0);
    expect(resolved(3)).toBeCloseTo(0.5);
    expect(resolved(6)).toBe(1);
  });
});

describe("rayStrength", () => {
  it("gives ordinary stars (brightness under 1.45) no rays", () => {
    for (const brightness of [0, 0.56, 1, 1.34, 1.45]) expect(rayStrength(brightness)).toBe(0);
  });

  it("grows with brightness and is full on the hottest hero stars", () => {
    expect(rayStrength(2)).toBeGreaterThan(0);
    expect(rayStrength(2.5)).toBeGreaterThan(rayStrength(2));
    expect(rayStrength(2.8)).toBe(1);
    expect(rayStrength(3.5)).toBe(1);
  });
});

describe("rayShape", () => {
  it("is brightest on the axes and the same in all four directions", () => {
    expect(rayShape(0.4, 0)).toBeCloseTo(rayShape(-0.4, 0));
    expect(rayShape(0, 0.4)).toBeCloseTo(rayShape(0, -0.4));
    expect(rayShape(0.4, 0)).toBeCloseTo(rayShape(0, 0.4));
    expect(rayShape(0, 0)).toBe(1);
  });

  it("is thin: a tenth of a radius off the axis it has mostly gone", () => {
    expect(rayShape(0.5, 0.1)).toBeLessThan(0.07 * rayShape(0.5, 0));
  });

  it("fades out toward the edge", () => {
    expect(rayShape(0.1, 0)).toBe(1);
    expect(rayShape(0.6, 0)).toBeLessThan(rayShape(0.3, 0));
    expect(rayShape(1, 0)).toBeCloseTo(0, 9);
  });
});

describe("rayIntensity", () => {
  it("is the shape times the gain times the strength", () => {
    expect(rayIntensity(0, 0, 3)).toBeCloseTo(RAY_GAIN);
    expect(rayIntensity(0.3, 0, 1)).toBe(0);
    expect(rayIntensity(0.3, 0, 2.2)).toBeCloseTo(rayShape(0.3, 0) * RAY_GAIN * rayStrength(2.2));
  });
});

describe("whiteCore", () => {
  it("leaves a dim star its own colour", () => {
    expect(whiteCore(1, 10, 0.8)).toBe(0);
  });

  it("turns a hot star's resolved centre white by up to the gain", () => {
    expect(whiteCore(1, 10, 3)).toBeCloseTo(WHITE_CORE.gain);
    expect(whiteCore(0.25, 10, 3)).toBeCloseTo(0.25 * WHITE_CORE.gain);
  });

  it("uses a fixed weight for a star too small to resolve", () => {
    expect(whiteCore(0, 1, 3)).toBeCloseTo(UNRESOLVED_CORE * WHITE_CORE.gain);
  });
});

describe("colorEnergy", () => {
  it("leaves white alone and lifts a saturated colour", () => {
    expect(colorEnergy(1, 1, 1)).toBe(1);
    expect(colorEnergy(1, 0.47, 0.08)).toBeCloseTo(1 + 0.92 * COLOR_ENERGY_GAIN);
    expect(colorEnergy(0, 0, 0)).toBeCloseTo(1 + COLOR_ENERGY_GAIN);
  });
});
