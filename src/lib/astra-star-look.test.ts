import { describe, expect, it } from "vitest";
import { between, pickWeighted, powerLaw, type Rand } from "@/lib/astra-star-look";

/** Small seeded generator (mulberry32) so every run sees the same stars. */
function seeded(seed: number): Rand {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const constant =
  (value: number): Rand =>
  () =>
    value;

describe("between", () => {
  it("maps the roll onto the range", () => {
    expect(between(constant(0), 2, 6)).toBe(2);
    expect(between(constant(0.5), 2, 6)).toBe(4);
    expect(between(constant(0.999999), 2, 6)).toBeLessThan(6);
  });
});

describe("powerLaw", () => {
  it("is uniform at exponent 1", () => {
    expect(powerLaw(constant(0.3), 1)).toBeCloseTo(0.3);
  });

  it("stays in [0, 1) and skews toward small values above 1", () => {
    const rand = seeded(7);
    let sum = 0;
    const count = 20000;
    for (let i = 0; i < count; i++) {
      const value = powerLaw(rand, 2.4);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
      sum += value;
    }
    // Mean of u^2.4 is 1 / 3.4, about 0.294: far below the uniform 0.5.
    expect(sum / count).toBeGreaterThan(0.27);
    expect(sum / count).toBeLessThan(0.32);
  });
});

describe("pickWeighted", () => {
  const entries = [
    { value: "a", weight: 1 },
    { value: "b", weight: 3 },
  ] as const;

  it("picks by cumulative weight, whatever the weights sum to", () => {
    expect(pickWeighted(constant(0), entries)).toBe("a");
    expect(pickWeighted(constant(0.24), entries)).toBe("a");
    expect(pickWeighted(constant(0.26), entries)).toBe("b");
    expect(pickWeighted(constant(0.999999), entries)).toBe("b");
  });

  it("never picks an entry with weight 0", () => {
    const rand = seeded(3);
    const zeroed = [
      { value: "x", weight: 0 },
      { value: "y", weight: 1 },
      { value: "z", weight: 0 },
    ] as const;
    for (let i = 0; i < 500; i++) expect(pickWeighted(rand, zeroed)).toBe("y");
  });

  it("follows the weights over many picks", () => {
    const rand = seeded(11);
    let b = 0;
    const count = 20000;
    for (let i = 0; i < count; i++) if (pickWeighted(rand, entries) === "b") b++;
    expect(b / count).toBeGreaterThan(0.73);
    expect(b / count).toBeLessThan(0.77);
  });
});
