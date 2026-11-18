import { describe, expect, it } from "vitest";
import {
  between,
  DUST_BRIGHTNESS,
  dustLook,
  FINE_UNIT_MAX,
  HERO_BRIGHTNESS,
  HERO_SHARE,
  ORDINARY_BRIGHTNESS,
  paletteColor,
  ribbonLook,
  pickWeighted,
  powerLaw,
  SIZE_BASE_PX,
  SIZE_GAIN_PX,
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

  it("is always an ordinary star: fine or ambient, never a hero", () => {
    expect(share("flare")).toBe(0);
    // unit = 0.12 + rand^2.4 * 0.68 < 0.35 when rand < (0.23 / 0.68)^(1/2.4), about 64%.
    expect(share("fine")).toBeGreaterThan(0.62);
    expect(share("fine")).toBeLessThan(0.66);
  });

  it("sizes every grain on openai.com's ordinary range", () => {
    const min = SIZE_BASE_PX + 0.12 * SIZE_GAIN_PX;
    const max = SIZE_BASE_PX + 0.8 * SIZE_GAIN_PX;
    for (const look of looks) {
      expect(look.size).toBeGreaterThanOrEqual(min - 1e-9);
      expect(look.size).toBeLessThanOrEqual(max + 1e-9);
    }
  });

  it("skews grains toward the small end", () => {
    const small = looks.filter((look) => look.size < 2.6).length / count;
    // A uniform unit would put about 25% below 2.6px; rand^2.4 puts about 56%.
    expect(small).toBeGreaterThan(0.52);
  });

  it("is a little dimmer than the ribbons", () => {
    for (const look of looks) {
      expect(look.brightness).toBeGreaterThanOrEqual(ORDINARY_BRIGHTNESS.min * DUST_BRIGHTNESS - 1e-9);
      expect(look.brightness).toBeLessThanOrEqual(ORDINARY_BRIGHTNESS.max * DUST_BRIGHTNESS + 1e-9);
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
    expect(["fine", "ambient"]).toContain(look.tier);
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
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

  it("makes a small share hero stars", () => {
    expect(share("flare")).toBeGreaterThan(HERO_SHARE * 0.85);
    expect(share("flare")).toBeLessThan(HERO_SHARE * 1.15);
  });

  it("sizes ordinary stars 1.3-6.6px and hero stars 7-17px, as openai.com does", () => {
    for (const look of looks) {
      if (look.tier === "flare") {
        expect(look.size).toBeGreaterThanOrEqual(SIZE_BASE_PX + 0.85 * SIZE_GAIN_PX - 1e-9);
        expect(look.size).toBeLessThanOrEqual(SIZE_BASE_PX + 2.1 * SIZE_GAIN_PX + 1e-9);
      } else {
        expect(look.size).toBeGreaterThanOrEqual(SIZE_BASE_PX + 0.12 * SIZE_GAIN_PX - 1e-9);
        expect(look.size).toBeLessThanOrEqual(SIZE_BASE_PX + 0.8 * SIZE_GAIN_PX + 1e-9);
      }
    }
    expect(SIZE_BASE_PX + 0.12 * SIZE_GAIN_PX).toBeCloseTo(1.28, 2);
    expect(SIZE_BASE_PX + 2.1 * SIZE_GAIN_PX).toBeCloseTo(16.71, 2);
  });

  it("splits ordinary stars into fine and ambient at the unit threshold", () => {
    const edge = SIZE_BASE_PX + FINE_UNIT_MAX * SIZE_GAIN_PX;
    for (const look of looks.filter((item) => item.tier === "fine")) expect(look.size).toBeLessThan(edge);
    for (const look of looks.filter((item) => item.tier === "ambient")) expect(look.size).toBeGreaterThanOrEqual(edge);
  });

  it("runs ordinary stars at 0.56-1.34 brightness and hero stars hot, at 2-3.5", () => {
    for (const look of looks) {
      const range = look.tier === "flare" ? HERO_BRIGHTNESS : ORDINARY_BRIGHTNESS;
      expect(look.brightness).toBeGreaterThanOrEqual(range.min);
      expect(look.brightness).toBeLessThanOrEqual(range.max);
    }
    const heroes = looks.filter((look) => look.tier === "flare").map((look) => look.brightness);
    expect(mean(heroes)).toBeCloseTo(2.75, 1);
  });

  it("keeps most stars small specks", () => {
    const ordinary = looks.filter((look) => look.tier !== "flare").map((look) => look.size);
    expect(mean(ordinary)).toBeGreaterThan(2.3);
    expect(mean(ordinary)).toBeLessThan(2.9);
  });

  it("gives hero stars the full halo and the rest a faint one", () => {
    for (const look of looks) {
      const expected = look.tier === "flare" ? 1 : look.tier === "ambient" ? 0.55 : 0.3;
      expect(look.glow).toBe(expected);
    }
  });

  it("colours every star, hero stars included, from the palette", () => {
    const palette = new Set<number>(STAR_PALETTE.map((entry) => entry.value));
    for (const look of looks) expect(palette.has(look.color)).toBe(true);
  });

  it("uses the global random source when none is passed", () => {
    expect(["fine", "ambient", "flare"]).toContain(ribbonLook().tier);
  });
});
