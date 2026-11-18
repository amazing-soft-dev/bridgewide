import { describe, expect, it } from "vitest";
import {
  between,
  dustLook,
  paletteColor,
  ribbonLook,
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
    const warm = looks.filter((look) => look.color === 0xf87915 || look.color === 0xfa994c);
    // Orange 12% + light orange 10%.
    expect(warm.length / count).toBeGreaterThan(0.2);
    expect(warm.length / count).toBeLessThan(0.24);
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

  it("matches openai.com's astra palette and picker", () => {
    expect(STAR_PALETTE.map((entry) => entry.value)).toEqual([0x6dcbf4, 0x7ab1fe, 0xf87915, 0xfa994c, 0xf5f6fb]);
    // Its picker: r < .36 cyan, < .52 blue, < .64 orange, < .74 light orange, else near-white.
    const at = (roll: number) => paletteColor(constant(roll));
    expect(at(0.35)).toBe(0x6dcbf4);
    expect(at(0.37)).toBe(0x7ab1fe);
    expect(at(0.53)).toBe(0xf87915);
    expect(at(0.65)).toBe(0xfa994c);
    expect(at(0.75)).toBe(0xf5f6fb);
  });

  it("keeps a cool majority, a quarter near-white and about a fifth warm", () => {
    const rand = seeded(5);
    const count = 20000;
    let cool = 0;
    let white = 0;
    for (let i = 0; i < count; i++) {
      const color = paletteColor(rand);
      if (color === 0x6dcbf4 || color === 0x7ab1fe) cool++;
      if (color === 0xf5f6fb) white++;
    }
    expect(cool / count).toBeGreaterThan(0.5);
    expect(cool / count).toBeLessThan(0.54);
    expect(white / count).toBeGreaterThan(0.24);
    expect(white / count).toBeLessThan(0.28);
  });
});

describe("ribbonLook", () => {
  const count = 40000;
  const rand = seeded(99);
  const looks = Array.from({ length: count }, () => ribbonLook(rand));
  const share = (tier: string) => looks.filter((look) => look.tier === tier).length / count;
  const hero = (look: { tier: string; size: number }) => look.tier === "flare" && look.size >= 6.5;
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

  it("keeps the ribbon's tier shares", () => {
    expect(share("fine")).toBeGreaterThan(0.465);
    expect(share("fine")).toBeLessThan(0.495);
    expect(share("ambient")).toBeGreaterThan(0.365);
    expect(share("ambient")).toBeLessThan(0.395);
    expect(share("flare")).toBeGreaterThan(0.13);
    expect(share("flare")).toBeLessThan(0.15);
  });

  it("keeps a quarter of the flares as hero stars", () => {
    const flares = looks.filter((look) => look.tier === "flare");
    const share = flares.filter(hero).length / flares.length;
    expect(share).toBeGreaterThan(0.22);
    expect(share).toBeLessThan(0.28);
  });

  it("keeps every size inside its range, with no star too small to see", () => {
    for (const look of looks) {
      expect(look.size).toBeGreaterThanOrEqual(1.1);
      expect(look.size).toBeLessThanOrEqual(9.8);
      expect(look.glow).toBeGreaterThan(0);
      expect(look.brightness).toBeGreaterThanOrEqual(0.65);
      expect(look.brightness).toBeLessThanOrEqual(1);
    }
    for (const look of looks.filter((item) => item.tier === "fine")) {
      expect(look.size).toBeLessThanOrEqual(2.3);
    }
  });

  it("keeps each tier's mean size close to the old uniform ranges, so the glow density holds", () => {
    const sizes = (pick: (look: { tier: string; size: number }) => boolean) =>
      mean(looks.filter(pick).map((look) => look.size));
    const within = (value: number, old: number) => Math.abs(value - old) / old < 0.12;
    expect(within(sizes((look) => look.tier === "fine"), 1.7)).toBe(true);
    expect(within(sizes((look) => look.tier === "ambient"), 3.1)).toBe(true);
    expect(within(sizes((look) => look.tier === "flare" && !hero(look)), 5)).toBe(true);
    expect(within(sizes(hero), 8)).toBe(true);
  });

  it("spreads sizes wider than the old tier ranges and skews them small", () => {
    const fine = looks.filter((look) => look.tier === "fine");
    const below = fine.filter((look) => look.size < 1.7).length / fine.length;
    // Old uniform 1.3-2.1: about half below 1.7. The skew puts clearly more there.
    expect(below).toBeGreaterThan(0.58);
    expect(Math.min(...fine.map((look) => look.size))).toBeLessThan(1.3);
    expect(Math.max(...fine.map((look) => look.size))).toBeGreaterThan(2.1);
  });

  it("keeps the flare colours as they were", () => {
    const flares = looks.filter((look) => look.tier === "flare");
    const colours = new Set(flares.map((look) => look.color));
    expect([...colours].sort()).toEqual([0xbcdcff, 0xcfe4ff, 0xffbb8a, 0xffc9a0].sort());
  });

  it("uses the global random source when none is passed", () => {
    expect(["fine", "ambient", "flare"]).toContain(ribbonLook().tier);
  });
});
