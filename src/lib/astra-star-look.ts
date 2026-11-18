/**
 * Star looks for the Astra field after the footer: how big, bright and
 * coloured each star is. Pure functions with an injectable random source, so
 * the distributions can be tested without WebGL.
 */

/** A random source returning a number in [0, 1). Tests pass a seeded one. */
export type Rand = () => number;

/** A uniform value in [min, max). */
export function between(rand: Rand, min: number, max: number): number {
  return min + rand() * (max - min);
}

/**
 * A value in [0, 1) skewed toward 0. An exponent above 1 gives many small
 * values and a few large ones, which is how real star fields look; 1 is
 * uniform. The mean is 1 / (exponent + 1).
 */
export function powerLaw(rand: Rand, exponent: number): number {
  return rand() ** exponent;
}

export type Weighted<T> = { value: T; weight: number };

/**
 * Picks one entry with probability proportional to its weight. Weights need
 * not sum to 1, and an entry with weight 0 is never picked.
 */
export function pickWeighted<T>(rand: Rand, entries: readonly [Weighted<T>, ...Weighted<T>[]]): T {
  let total = 0;
  for (const entry of entries) total += Math.max(0, entry.weight);
  let roll = rand() * total;
  for (const entry of entries) {
    const weight = Math.max(0, entry.weight);
    if (weight === 0) continue;
    roll -= weight;
    if (roll < 0) return entry.value;
  }
  // Floating-point rounding can leave the roll at exactly 0: take the last live entry.
  const live = entries.filter((entry) => entry.weight > 0);
  return (live[live.length - 1] ?? entries[0]).value;
}

export type Tier = "fine" | "ambient" | "flare";

/** One star's look. Sizes are CSS px on the full 600px mark; brightness is an HDR multiplier. */
export type Look = {
  tier: Tier;
  size: number;
  color: number;
  brightness: number;
};

/**
 * Star palette: openai.com's "astra" palette, with the weights its picker uses
 * (cumulative .36 / .52 / .64 / .74 / 1). A cyan and blue majority, a quarter
 * near-white and about a fifth orange. Weights sum to 1. Shared by the dust
 * and the ribbon stars so the whole field reads as one sky.
 */
export const STAR_PALETTE = [
  { value: 0x6dcbf4, weight: 0.36 }, // cyan
  { value: 0x7ab1fe, weight: 0.16 }, // blue
  { value: 0xf87915, weight: 0.12 }, // orange
  { value: 0xfa994c, weight: 0.1 }, // light orange
  { value: 0xf5f6fb, weight: 0.26 }, // near-white
] as const satisfies readonly [Weighted<number>, ...Weighted<number>[]];

/** A star colour drawn from the palette by weight. */
export function paletteColor(rand: Rand = Math.random): number {
  return pickWeighted<number>(rand, STAR_PALETTE);
}

/**
 * openai.com's star size and brightness model. A star's point size in CSS px
 * on the full 600px mark is `SIZE_BASE_PX + unit * SIZE_GAIN_PX` (its shader:
 * `0.35 + starScale * 3.8` with `starScale = unit * 2.05`). Ordinary stars
 * take `unit = 0.12 + rand^2.4 * 0.68`, so most are 1-3px specks with a tail
 * to about 6.5px. Hero stars take `unit = 0.85 + 1.25 * rand` (7-17px).
 */
export const SIZE_BASE_PX = 0.35;
export const SIZE_GAIN_PX = 3.8 * 2.05;
/** Ordinary stars below this unit are "fine"; the rest are "ambient". */
export const FINE_UNIT_MAX = 0.35;
/**
 * Share of ribbon stars that are hero stars. openai.com picks
 * lerp(0.22, 1, sin(progress * PI)) * 0.085 along each arm (about 6%); the
 * mark's ribbons are shorter and denser, so a smaller share gives a similar
 * count of hero halos on screen.
 */
export const HERO_SHARE = 0.028;
/** Ordinary brightness is 0.56-1.34 and hero brightness 2-3.5: HDR multipliers on the colour. */
export const ORDINARY_BRIGHTNESS = { min: 0.56, max: 1.34 } as const;
export const HERO_BRIGHTNESS = { min: 2, max: 3.5 } as const;
/** Dust is the ordinary star at this share of its brightness, so the sky sits behind the mark. */
export const DUST_BRIGHTNESS = 0.8;

function ordinaryLook(rand: Rand, brightnessScale: number): Look {
  const unit = 0.12 + powerLaw(rand, 2.4) * 0.68;
  const tier: Tier = unit < FINE_UNIT_MAX ? "fine" : "ambient";
  return {
    tier,
    size: SIZE_BASE_PX + unit * SIZE_GAIN_PX,
    color: paletteColor(rand),
    brightness: between(rand, ORDINARY_BRIGHTNESS.min, ORDINARY_BRIGHTNESS.max) * brightnessScale,
  };
}

function heroLook(rand: Rand): Look {
  return {
    tier: "flare",
    size: SIZE_BASE_PX + between(rand, 0.85, 2.1) * SIZE_GAIN_PX,
    color: paletteColor(rand),
    brightness: between(rand, HERO_BRIGHTNESS.min, HERO_BRIGHTNESS.max),
  };
}

/** Background dust: always an ordinary star, a little dimmer than the ribbons. */
export function dustLook(rand: Rand = Math.random): Look {
  return ordinaryLook(rand, DUST_BRIGHTNESS);
}

/** A star on the mark's ribbons: an ordinary star, or now and then a hero star. */
export function ribbonLook(rand: Rand = Math.random): Look {
  return rand() < HERO_SHARE ? heroLook(rand) : ordinaryLook(rand, 1);
}
