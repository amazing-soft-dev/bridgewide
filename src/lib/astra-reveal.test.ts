import { describe, expect, it } from "vitest";
import {
  firstSight,
  REVEAL_SECONDS,
  REVEAL_WINDOW,
  revealClock,
  revealProgress,
  revealSize,
} from "@/lib/astra-reveal";

const seeds = Array.from({ length: 50 }, (_, index) => index / 50);
const steps = Array.from({ length: 101 }, (_, index) => index / 100);

describe("revealProgress", () => {
  it("starts at 0 for every star", () => {
    for (const seed of seeds) expect(revealProgress(0, seed)).toBe(0);
  });

  it("ends at exactly 1 for every star, so the finished field is unchanged", () => {
    for (const seed of seeds) expect(revealProgress(1, seed)).toBe(1);
    // Even the latest possible seed.
    expect(revealProgress(1, 0.999999)).toBe(1);
  });

  it("never goes down as the reveal goes on", () => {
    for (const seed of seeds) {
      let last = -1;
      for (const t of steps) {
        const value = revealProgress(t, seed);
        expect(value).toBeGreaterThanOrEqual(last);
        last = value;
      }
    }
  });

  it("stays between 0 and 1", () => {
    for (const seed of seeds) {
      for (const t of steps) {
        const value = revealProgress(t, seed);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });

  it("staggers: an early seed is further along than a late one", () => {
    for (const t of [0.1, 0.25, 0.4, 0.6]) {
      expect(revealProgress(t, 0)).toBeGreaterThan(revealProgress(t, 0.9));
    }
  });

  it("holds a late star back until its delay has passed", () => {
    const lateStart = 0.99 * (1 - REVEAL_WINDOW);
    expect(revealProgress(lateStart * 0.9, 0.99)).toBe(0);
    expect(revealProgress(lateStart + 0.1, 0.99)).toBeGreaterThan(0);
  });

  it("brightens the whole sky as it arrives, not only star by star", () => {
    // The first star is fully in its own fade at 0.6, yet still dimmer than at the end.
    expect(revealProgress(REVEAL_WINDOW, 0)).toBeLessThan(1);
    expect(revealProgress(REVEAL_WINDOW, 0)).toBeGreaterThan(0.5);
  });

  it("clamps a reveal time outside 0 to 1 and a seed outside [0, 1)", () => {
    expect(revealProgress(-3, 0.5)).toBe(0);
    expect(revealProgress(9, 0.5)).toBe(1);
    expect(revealProgress(0.5, -4)).toBe(revealProgress(0.5, 0));
    expect(revealProgress(0.5, 7)).toBe(revealProgress(0.5, 1));
  });
});

describe("revealSize", () => {
  it("grows from nothing to full size", () => {
    expect(revealSize(0)).toBe(0);
    expect(revealSize(1)).toBe(1);
  });

  it("is the square root, so a star is already half-size at a quarter of the progress", () => {
    expect(revealSize(0.25)).toBeCloseTo(0.5, 12);
    expect(revealSize(0.04)).toBeCloseTo(0.2, 12);
  });

  it("grows faster than the fade at first, then settles", () => {
    for (const p of [0.05, 0.2, 0.5, 0.8]) expect(revealSize(p)).toBeGreaterThan(p);
    expect(revealSize(0.2) - revealSize(0.1)).toBeGreaterThan(revealSize(0.9) - revealSize(0.8));
  });

  it("never goes down as the progress grows", () => {
    let last = -1;
    for (const p of steps) {
      const value = revealSize(p);
      expect(value).toBeGreaterThanOrEqual(last);
      last = value;
    }
  });

  it("clamps a progress outside 0 to 1", () => {
    expect(revealSize(-2)).toBe(0);
    expect(revealSize(5)).toBe(1);
  });
});

describe("firstSight", () => {
  it("sets the start the first time and keeps it after, so the entrance never replays", () => {
    const first = firstSight(null, 1200);
    expect(first).toBe(1200);
    expect(firstSight(first, 9000)).toBe(1200);
    expect(firstSight(firstSight(first, 9000), 20000)).toBe(1200);
  });

  it("treats a start at time 0 as already started", () => {
    expect(firstSight(0, 500)).toBe(0);
  });
});

describe("revealClock", () => {
  const ms = REVEAL_SECONDS * 1000;

  it("keeps the sky hidden until the section has been seen", () => {
    expect(revealClock(5000, null, false)).toBe(0);
  });

  it("runs from 0 to 1 over the reveal time", () => {
    expect(revealClock(1000, 1000, false)).toBe(0);
    expect(revealClock(1000 + ms / 2, 1000, false)).toBeCloseTo(0.5, 12);
    expect(revealClock(1000 + ms, 1000, false)).toBe(1);
  });

  it("stays at 1 after the reveal is over", () => {
    expect(revealClock(1000 + ms * 10, 1000, false)).toBe(1);
  });

  it("never reads below 0 if the frame time is a little before the start", () => {
    expect(revealClock(990, 1000, false)).toBe(0);
  });

  it("is already complete under reduced motion, even before first sight", () => {
    expect(revealClock(0, null, true)).toBe(1);
    expect(revealClock(1000, 1000, true)).toBe(1);
  });

  it("gives every star its full alpha and size once complete under reduced motion", () => {
    const t = revealClock(0, null, true);
    for (const seed of seeds) {
      expect(revealProgress(t, seed)).toBe(1);
      expect(revealSize(revealProgress(t, seed))).toBe(1);
    }
  });
});
