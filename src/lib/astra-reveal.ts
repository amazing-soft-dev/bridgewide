/**
 * The entrance of the Astra field: when the section first scrolls into view,
 * each star fades in on its own delay and grows from a point, instead of the
 * whole sky appearing on the first frame. Pure functions of time and a
 * per-star seed, so they can be tested without WebGL.
 */

/** Share of the reveal that one star's own fade takes; the rest is its delay range. */
export const REVEAL_WINDOW = 0.55;
/** How dim the whole sky is at the start of the reveal, as a share of full strength. */
export const REVEAL_SWELL_START = 0.35;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

/**
 * How far one star has appeared, 0 to 1. `t` is the progress of the whole
 * reveal (0 to 1) and `seed` is a per-star number in [0, 1) that sets when the
 * star starts: seed 0 starts at once, seed near 1 starts as late as it can and
 * still finish with the reveal. A slow swell over the whole reveal brightens
 * the sky as it arrives.
 *
 * It is 0 at t = 0, never goes down as t grows, and is exactly 1 at t = 1 for
 * every seed, so once the reveal is over the field looks as it always did.
 */
export function revealProgress(t: number, seed: number): number {
  const delay = clamp01(seed) * (1 - REVEAL_WINDOW);
  const own = smoothstep((clamp01(t) - delay) / REVEAL_WINDOW);
  const swell = REVEAL_SWELL_START + (1 - REVEAL_SWELL_START) * smoothstep(t);
  return own * swell;
}

/**
 * The size factor for a star at the given reveal progress: the square root, so
 * a star grows quickly out of a point and then settles, instead of crawling in.
 * 0 gives 0 and 1 gives exactly 1.
 */
export function revealSize(progress: number): number {
  return Math.sqrt(clamp01(progress));
}

/** Seconds from the first sight of the section until every star has appeared. */
export const REVEAL_SECONDS = 1.6;

/**
 * When the reveal started. Pass the value you have (null the first time) and
 * the current time in ms: the first sight sets it and later calls keep it, so
 * scrolling away and back does not replay the entrance.
 */
export function firstSight(startedAt: number | null, now: number): number {
  return startedAt ?? now;
}

/**
 * Progress of the whole reveal, 0 to 1, from the time the section was first
 * seen. Before it has been seen (`startedAt` null) the sky is still hidden. With
 * `still` (the visitor prefers reduced motion) the reveal is already complete,
 * so there is no entrance animation at all.
 */
export function revealClock(now: number, startedAt: number | null, still: boolean): number {
  if (still) return 1;
  if (startedAt === null) return 0;
  return clamp01((now - startedAt) / (REVEAL_SECONDS * 1000));
}
