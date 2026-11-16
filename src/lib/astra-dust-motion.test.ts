import { describe, expect, it } from "vitest";
import { DRIFT_REACH, DRIFT_SPEED, dustDrift } from "@/lib/astra-dust-motion";

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
