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

/** One star's look. Sizes are CSS px on the full 600px mark. */
export type Look = {
  tier: Tier;
  size: number;
  glow: number;
  color: number;
  brightness: number;
};

/** Dust tiers: 85% fine, 12% ambient and the remaining 3% bright. */
export const DUST_TIER_SHARES = { fine: 0.85, ambient: 0.12 } as const;

/**
 * Star palette: a cool blue-white majority with warm accents. Weights sum to 1.
 * Shared by the dust and the ribbon stars so the whole field reads as one sky.
 */
export const STAR_PALETTE = [
  { value: 0xc4dcff, weight: 0.36 }, // blue-white
  { value: 0xf2f6ff, weight: 0.14 }, // white
  { value: 0x8fcdff, weight: 0.22 }, // ice
  { value: 0xffbf8f, weight: 0.16 }, // peach
  { value: 0xff8a45, weight: 0.12 }, // amber
] as const satisfies readonly [Weighted<number>, ...Weighted<number>[]];

/** A star colour drawn from the palette by weight. */
export function paletteColor(rand: Rand = Math.random): number {
  return pickWeighted<number>(rand, STAR_PALETTE);
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/**
 * Background dust. Most grains are tiny and dim, a few are larger, and about
 * 3% are bright "flare" stars, so the sky has a few eye-catchers instead of
 * evenly sized beads. Brightness follows size inside a tier.
 */
export function dustLook(rand: Rand = Math.random): Look {
  const roll = rand();
  if (roll < DUST_TIER_SHARES.fine) {
    const t = powerLaw(rand, 2.4);
    return {
      tier: "fine",
      size: lerp(0.7, 1.8, t),
      glow: 0.15,
      color: paletteColor(rand),
      brightness: lerp(0.28, 0.62, t),
    };
  }
  if (roll < DUST_TIER_SHARES.fine + DUST_TIER_SHARES.ambient) {
    const t = powerLaw(rand, 1.6);
    return {
      tier: "ambient",
      size: lerp(1.6, 2.8, t),
      glow: 0.35,
      color: paletteColor(rand),
      brightness: lerp(0.45, 0.72, t),
    };
  }
  const t = rand();
  return {
    tier: "flare",
    size: lerp(2.8, 4.4, t),
    glow: 0.6,
    color: paletteColor(rand),
    brightness: lerp(0.85, 1, t),
  };
}

/** Ribbon tiers: 48% fine, 38% ambient, the remaining 14% flares. */
export const RIBBON_TIER_SHARES = { fine: 0.48, ambient: 0.38 } as const;
/** A quarter of the flares are large "hero" stars. */
export const HERO_SHARE = 0.25;

/**
 * A star on the mark's ribbons. The tier shares and the hero share are the
 * ones the ribbon always had, so its density of glow does not change; what
 * changes is the spread of sizes inside each tier, which is now skewed toward
 * the small end with a similar mean. A wide size range with no invisible
 * specks is what makes the line read as a glowing ribbon instead of a string
 * of equal beads.
 */
export function ribbonLook(rand: Rand = Math.random): Look {
  const roll = rand();
  if (roll < RIBBON_TIER_SHARES.fine) {
    // Small, but bright enough to stay visible next to the big stars.
    return {
      tier: "fine",
      size: lerp(1.1, 2.3, powerLaw(rand, 1.6)),
      glow: 0.3,
      color: paletteColor(rand),
      brightness: between(rand, 0.65, 0.9),
    };
  }
  if (roll < RIBBON_TIER_SHARES.fine + RIBBON_TIER_SHARES.ambient) {
    return {
      tier: "ambient",
      size: lerp(2.2, 4, powerLaw(rand, 1.4)),
      glow: 0.55,
      color: paletteColor(rand),
      brightness: between(rand, 0.65, 0.9),
    };
  }
  const warm = rand() < 0.2;
  if (rand() < HERO_SHARE) {
    return {
      tier: "flare",
      size: lerp(6.5, 9.8, powerLaw(rand, 1.15)),
      glow: 1,
      color: warm ? 0xffc9a0 : 0xcfe4ff,
      brightness: 1,
    };
  }
  return {
    tier: "flare",
    size: lerp(3.8, 6.3, powerLaw(rand, 1.2)),
    glow: 0.9,
    color: warm ? 0xffbb8a : 0xbcdcff,
    brightness: 0.95,
  };
}
