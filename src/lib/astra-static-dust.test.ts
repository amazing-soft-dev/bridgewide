import { describe, expect, it } from "vitest";
import {
  seededRandom,
  STATIC_DUST_COUNT,
  staticDust,
  staticDustBackground,
} from "@/lib/astra-static-dust";
import { STAR_PALETTE } from "@/lib/astra-star-look";

describe("seededRandom", () => {
  it("gives the same sequence for the same seed and a different one for another", () => {
    const a = seededRandom(7);
    const b = seededRandom(7);
    const c = seededRandom(8);
    const first = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(first);
    expect([c(), c(), c()]).not.toEqual(first);
  });

  it("stays in [0, 1)", () => {
    const rand = seededRandom(123);
    for (let i = 0; i < 5000; i++) {
      const value = rand();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("staticDust", () => {
  it("is deterministic: the same dots on the server, the client and every visit", () => {
    expect(staticDust()).toEqual(staticDust());
    expect(staticDustBackground(staticDust())).toBe(staticDustBackground(staticDust()));
  });

  it("changes with the seed", () => {
    expect(staticDust(50, 1)).not.toEqual(staticDust(50, 2));
  });

  it("has the requested number of dots, and none for a count of 0 or less", () => {
    expect(staticDust()).toHaveLength(STATIC_DUST_COUNT);
    expect(staticDust(10)).toHaveLength(10);
    expect(staticDust(0)).toHaveLength(0);
    expect(staticDust(-5)).toHaveLength(0);
  });

  it("keeps every dot inside the box, visible and in the star palette", () => {
    const palette = new Set<number>(STAR_PALETTE.map((entry) => entry.value));
    for (const dot of staticDust(500)) {
      expect(dot.x).toBeGreaterThanOrEqual(0);
      expect(dot.x).toBeLessThan(100);
      expect(dot.y).toBeGreaterThanOrEqual(0);
      expect(dot.y).toBeLessThan(100);
      expect(dot.radius).toBeGreaterThanOrEqual(0.6);
      expect(dot.alpha).toBeGreaterThan(0);
      expect(dot.alpha).toBeLessThanOrEqual(1);
      expect(palette.has(dot.color)).toBe(true);
    }
  });

  it("has mostly small dots and a few larger ones, like the live sky", () => {
    const dots = staticDust(2000);
    const small = dots.filter((dot) => dot.radius < 1.1).length / dots.length;
    const large = dots.filter((dot) => dot.radius > 1.7).length / dots.length;
    expect(small).toBeGreaterThan(0.6);
    expect(large).toBeGreaterThan(0);
    expect(large).toBeLessThan(0.2);
  });
});

describe("staticDustBackground", () => {
  it("makes one radial gradient per dot, joined for a CSS background-image", () => {
    const css = staticDustBackground(staticDust(30));
    expect(css.match(/radial-gradient\(/g)).toHaveLength(30);
    expect(css.split("), radial-gradient(")).toHaveLength(30);
  });

  it("draws a soft dot: its colour at the centre fading to transparent", () => {
    const css = staticDustBackground([{ x: 12.345, y: 67.891, radius: 1.5, color: 0xff8a45, alpha: 0.5 }]);
    expect(css).toBe(
      "radial-gradient(1.5px 1.5px at 12.35% 67.89%, rgb(255 138 69 / 0.5) 0%, rgb(255 138 69 / 0) 100%)",
    );
  });

  it("has no NaN or undefined anywhere", () => {
    const css = staticDustBackground(staticDust());
    expect(css).not.toMatch(/NaN|undefined|Infinity/);
  });

  it("is an empty background for no dots", () => {
    expect(staticDustBackground([])).toBe("");
  });
});
