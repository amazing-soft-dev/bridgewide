import { describe, expect, it } from "vitest";
import {
  DRIFT_REACH,
  DRIFT_SPEED,
  dustDrift,
  dustParallax,
  dustTwinkle,
  PARALLAX_REACH,
  TWINKLE_DEPTH,
} from "@/lib/astra-dust-motion";

const seeds = Array.from({ length: 64 }, (_, index) => (index + 0.5) / 64);
const times = Array.from({ length: 200 }, (_, index) => index * 0.37);

describe("dustDrift", () => {
  it("is exactly zero at time 0, so dust starts where it rests", () => {
    for (const seed of seeds) {
      for (const depth of [0, 0.5, 1]) {
        const offset = dustDrift(0, seed, depth);
        expect(offset.x).toBeCloseTo(0, 12);
        expect(offset.y).toBeCloseTo(0, 12);
      }
    }
  });

  it("stays within twice the reach for its depth", () => {
    for (const depth of [0, 0.5, 1]) {
      const reach = DRIFT_REACH.far + (DRIFT_REACH.near - DRIFT_REACH.far) * depth;
      for (const seed of seeds) {
        for (const time of times) {
          const offset = dustDrift(time, seed, depth);
          expect(Math.abs(offset.x)).toBeLessThanOrEqual(2 * reach + 1e-12);
          expect(Math.abs(offset.y)).toBeLessThanOrEqual(2 * reach + 1e-12);
        }
      }
    }
  });

  it("reaches further for near dust than for far dust", () => {
    const widest = (depth: number) =>
      Math.max(...seeds.flatMap((seed) => times.map((time) => Math.abs(dustDrift(time, seed, depth).x))));
    expect(widest(1)).toBeGreaterThan(widest(0) * 2);
  });

  it("moves near dust faster than far dust", () => {
    const meanStep = (depth: number) =>
      seeds.reduce((sum, seed) => sum + Math.abs(dustDrift(0.25, seed, depth).x), 0) / seeds.length;
    // Near dust has both a wider reach and a higher speed: well over the reach ratio alone.
    expect(meanStep(1) / meanStep(0)).toBeGreaterThan(DRIFT_REACH.near / DRIFT_REACH.far);
  });

  it("loops: x repeats after one period of its speed", () => {
    const period = (Math.PI * 2) / DRIFT_SPEED.near;
    for (const seed of seeds) {
      const first = dustDrift(1.3, seed, 1).x;
      const again = dustDrift(1.3 + period, seed, 1).x;
      expect(again).toBeCloseTo(first, 9);
    }
  });

  it("is deterministic and different for different seeds", () => {
    expect(dustDrift(3.2, 0.31, 0.6)).toEqual(dustDrift(3.2, 0.31, 0.6));
    expect(dustDrift(3.2, 0.31, 0.6).x).not.toBeCloseTo(dustDrift(3.2, 0.77, 0.6).x, 6);
  });

  it("holds still at strength 0", () => {
    for (const time of times) {
      expect(dustDrift(time, 0.4, 1, 0)).toEqual({ x: 0, y: 0 });
    }
  });

  it("clamps an out-of-range depth and strength", () => {
    expect(dustDrift(2, 0.2, 5)).toEqual(dustDrift(2, 0.2, 1));
    expect(dustDrift(2, 0.2, -3)).toEqual(dustDrift(2, 0.2, 0));
    expect(dustDrift(2, 0.2, 1, 9)).toEqual(dustDrift(2, 0.2, 1, 1));
  });
});

describe("dustTwinkle", () => {
  const sweep = Array.from({ length: 2000 }, (_, index) => index * 0.01);

  it("stays between 1 - depth and 1", () => {
    for (const time of sweep) {
      const value = dustTwinkle(time, 1.1, 0.9);
      expect(value).toBeGreaterThanOrEqual(1 - TWINKLE_DEPTH - 1e-12);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it("uses the whole range over time", () => {
    const values = sweep.map((time) => dustTwinkle(time, 0.3, 1.2));
    expect(Math.min(...values)).toBeLessThan(1 - TWINKLE_DEPTH + 0.01);
    expect(Math.max(...values)).toBeGreaterThan(0.99);
  });

  it("is a steady 1 at strength 0", () => {
    for (const time of sweep) expect(dustTwinkle(time, 2, 1.5, 0)).toBe(1);
  });

  it("twinkles faster with a higher rate", () => {
    const dips = (rate: number) => {
      let count = 0;
      for (let index = 1; index < sweep.length - 1; index++) {
        const before = dustTwinkle(sweep[index - 1] ?? 0, 0, rate);
        const here = dustTwinkle(sweep[index] ?? 0, 0, rate);
        const after = dustTwinkle(sweep[index + 1] ?? 0, 0, rate);
        if (here < before && here < after) count++;
      }
      return count;
    };
    expect(dips(2)).toBeGreaterThan(dips(1));
  });

  it("is deterministic and offset by phase", () => {
    expect(dustTwinkle(4.2, 0.5, 1)).toBe(dustTwinkle(4.2, 0.5, 1));
    expect(dustTwinkle(4.2, 0.5, 1)).not.toBeCloseTo(dustTwinkle(4.2, 2.5, 1), 6);
  });

  it("clamps an out-of-range strength", () => {
    expect(dustTwinkle(1, 0, 1, 9)).toBe(dustTwinkle(1, 0, 1, 1));
    expect(dustTwinkle(1, 0, 1, -2)).toBe(1);
  });
});

describe("dustParallax", () => {
  it("is zero in the middle of the scroll", () => {
    for (const depth of [0, 0.4, 1]) expect(dustParallax(0.5, depth)).toBe(0);
  });

  it("slides up as the scroll goes down, and back down before the middle", () => {
    expect(dustParallax(1, 1)).toBeGreaterThan(0);
    expect(dustParallax(0, 1)).toBeLessThan(0);
    expect(dustParallax(1, 1)).toBeCloseTo(-dustParallax(0, 1), 12);
  });

  it("grows with the square of the depth, so far dust barely moves", () => {
    expect(dustParallax(1, 0)).toBe(0);
    expect(dustParallax(1, 1) / dustParallax(1, 0.5)).toBeCloseTo(4, 10);
    expect(dustParallax(1, 1)).toBeCloseTo(PARALLAX_REACH / 2, 12);
  });

  it("never moves more than half the reach either way", () => {
    for (let scroll = -0.5; scroll <= 1.5; scroll += 0.05) {
      expect(Math.abs(dustParallax(scroll, 1))).toBeLessThanOrEqual(PARALLAX_REACH / 2 + 1e-12);
    }
  });

  it("is a plain zero at strength 0, not a negative zero", () => {
    expect(Object.is(dustParallax(0.1, 1, 0), 0)).toBe(true);
    expect(Object.is(dustParallax(0.9, 1, 0), 0)).toBe(true);
  });

  it("clamps an out-of-range scroll, depth and strength", () => {
    expect(dustParallax(7, 1)).toBe(dustParallax(1, 1));
    expect(dustParallax(-7, 1)).toBe(dustParallax(0, 1));
    expect(dustParallax(1, 9)).toBe(dustParallax(1, 1));
    expect(dustParallax(1, 1, 9)).toBe(dustParallax(1, 1, 1));
  });
});
