/**
 * A static sky for visitors whose browser cannot run the WebGL star field:
 * soft dots drawn with CSS radial gradients. It is deterministic (the same dots
 * on the server and the client, on every visit), uses the same dust look as the
 * live field, and draws no mark, so the section never looks broken.
 */

import { dustLook, type Rand } from "@/lib/astra-star-look";

export const STATIC_DUST_COUNT = 240;
export const STATIC_DUST_SEED = 0xa57a;

/** A small seeded generator (mulberry32), so the same seed always gives the same sky. */
export function seededRandom(seed: number): Rand {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One dot: position in % of the box, radius in CSS px, colour as 0xRRGGBB and opacity 0 to 1. */
export type StaticDust = { x: number; y: number; radius: number; color: number; alpha: number };

/** The smallest radius a dot is drawn with, so no dot is too small to see. */
const MIN_RADIUS = 0.6;

/** The dots of the static sky. The same arguments always give the same dots. */
export function staticDust(count = STATIC_DUST_COUNT, seed = STATIC_DUST_SEED): StaticDust[] {
  const rand = seededRandom(seed);
  return Array.from({ length: Math.max(0, Math.floor(count)) }, () => {
    const look = dustLook(rand);
    return {
      x: rand() * 100,
      y: rand() * 100,
      radius: Math.max(MIN_RADIUS, look.size * 0.6),
      color: look.color,
      alpha: Math.min(1, Math.max(0, look.brightness)),
    };
  });
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function channels(color: number): string {
  return `${(color >> 16) & 255} ${(color >> 8) & 255} ${color & 255}`;
}

/** The CSS `background-image` for a list of dots: one soft radial gradient per dot. */
export function staticDustBackground(dust: readonly StaticDust[]): string {
  return dust
    .map((dot) => {
      const rgb = channels(dot.color);
      const size = `${round(dot.radius)}px ${round(dot.radius)}px`;
      return (
        `radial-gradient(${size} at ${round(dot.x)}% ${round(dot.y)}%, ` +
        `rgb(${rgb} / ${round(dot.alpha)}) 0%, rgb(${rgb} / 0) 100%)`
      );
    })
    .join(", ");
}
