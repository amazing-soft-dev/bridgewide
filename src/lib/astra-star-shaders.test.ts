import { describe, expect, it } from "vitest";
import { STAR_FRAGMENT, STAR_VERTEX } from "@/lib/astra-star-shaders";

/** Every `varying` declared in a shader, as "type name". */
function varyings(source: string): string[] {
  return [...source.matchAll(/^varying\s+(\w+)\s+(\w+);/gm)].map((match) => `${match[1]} ${match[2]}`);
}

describe("star shaders", () => {
  it("each have a main function and no unfilled template slot", () => {
    for (const source of [STAR_VERTEX, STAR_FRAGMENT]) {
      expect(source).toContain("void main()");
      expect(source).not.toContain("${");
      expect(source).not.toContain("NaN");
      expect(source).not.toContain("undefined");
    }
  });

  it("read the per-star attributes the component fills", () => {
    for (const attribute of ["size", "glow", "alpha"]) {
      expect(STAR_VERTEX).toContain(`attribute float ${attribute};`);
    }
  });

  it("set the point size from the quad", () => {
    expect(STAR_VERTEX).toContain("gl_PointSize = vQuad;");
  });

  it("write the colour with the star's own alpha", () => {
    expect(STAR_FRAGMENT).toContain("gl_FragColor");
    expect(STAR_FRAGMENT).toContain("* vAlpha");
  });

  it("agree on every varying the fragment shader reads", () => {
    const sent = new Set(varyings(STAR_VERTEX));
    for (const received of varyings(STAR_FRAGMENT)) expect(sent.has(received)).toBe(true);
  });
});

describe("ray attribute", () => {
  it("is declared by the vertex shader and passed on to the fragment shader", () => {
    expect(STAR_VERTEX).toContain("attribute float ray;");
    expect(STAR_VERTEX).toContain("varying float vRay;");
    expect(STAR_VERTEX).toContain("vRay = ray;");
    expect(STAR_FRAGMENT).toContain("varying float vRay;");
  });
});
