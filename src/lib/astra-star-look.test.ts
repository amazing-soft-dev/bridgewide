import { describe, expect, it } from "vitest";
import {
  between,
  dustLook,
  paletteColor,
  pickWeighted,
  powerLaw,
  STAR_PALETTE,
  type Rand,
} from "@/lib/astra-star-look";

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

describe("dustLook", () => {
  const count = 30000;
  const rand = seeded(21);
  const looks = Array.from({ length: count }, () => dustLook(rand));
  const share = (tier: string) => looks.filter((look) => look.tier === tier).length / count;

  it("splits into fine, ambient and a rare bright tier", () => {
    expect(share("fine")).toBeGreaterThan(0.835);
    expect(share("fine")).toBeLessThan(0.865);
    expect(share("ambient")).toBeGreaterThan(0.11);
    expect(share("ambient")).toBeLessThan(0.13);
    expect(share("flare")).toBeGreaterThan(0.023);
    expect(share("flare")).toBeLessThan(0.037);
  });

  it("keeps every tier inside its size range, with bright dust larger than any fine grain", () => {
    for (const look of looks) {
      if (look.tier === "fine") {
        expect(look.size).toBeGreaterThanOrEqual(0.7);
        expect(look.size).toBeLessThanOrEqual(1.8);
      } else if (look.tier === "ambient") {
        expect(look.size).toBeGreaterThanOrEqual(1.6);
        expect(look.size).toBeLessThanOrEqual(2.8);
      } else {
        expect(look.size).toBeGreaterThanOrEqual(2.8);
        expect(look.size).toBeLessThanOrEqual(4.4);
      }
      expect(look.brightness).toBeGreaterThan(0);
      expect(look.brightness).toBeLessThanOrEqual(1);
    }
  });

  it("skews fine grains toward the small end", () => {
    const fine = looks.filter((look) => look.tier === "fine");
    const small = fine.filter((look) => look.size < 1.25).length / fine.length;
    // A uniform spread would put half below the midpoint; the skew puts about 75%.
    expect(small).toBeGreaterThan(0.7);
  });

  it("gives bigger fine grains more brightness", () => {
    const fine = looks.filter((look) => look.tier === "fine");
    for (const look of fine) {
      const t = (look.size - 0.7) / 1.1;
      expect(look.brightness).toBeCloseTo(0.28 + 0.34 * t, 6);
    }
  });

  it("colours dust from the star palette, warm accents included", () => {
    const palette = new Set<number>(STAR_PALETTE.map((entry) => entry.value));
    for (const look of looks) expect(palette.has(look.color)).toBe(true);
    const warm = looks.filter((look) => look.color === 0xffbf8f || look.color === 0xff8a45);
    // Peach 16% + amber 12%.
    expect(warm.length / count).toBeGreaterThan(0.26);
    expect(warm.length / count).toBeLessThan(0.3);
  });

  it("uses the global random source when none is passed", () => {
    const look = dustLook();
    expect(["fine", "ambient", "flare"]).toContain(look.tier);
  });
});

describe("paletteColor", () => {
  it("has weights that sum to 1", () => {
    const total = STAR_PALETTE.reduce((sum, entry) => sum + entry.weight, 0);
    expect(total).toBeCloseTo(1, 10);
  });

  it("keeps a cool majority with about a quarter warm", () => {
    const rand = seeded(5);
    const count = 20000;
    let cool = 0;
    for (let i = 0; i < count; i++) {
      const color = paletteColor(rand);
      if (color !== 0xffbf8f && color !== 0xff8a45) cool++;
    }
    expect(cool / count).toBeGreaterThan(0.7);
    expect(cool / count).toBeLessThan(0.74);
  });
});
