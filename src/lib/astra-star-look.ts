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
