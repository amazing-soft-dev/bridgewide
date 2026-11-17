import { describe, expect, it } from "vitest";
import { RAY_REACH, WHITE_CORE_BASE, WHITE_CORE_EXTRA } from "@/lib/astra-star-shader-math";
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

describe("ray quad", () => {
  it("gives a star with rays a larger quad, from the tested reach", () => {
    expect(STAR_VERTEX).toContain("vQuad = vRay > 0.0 ? max(vHaloQuad, vSize * 5.0) : vHaloQuad;");
    expect(STAR_VERTEX).toContain(`${RAY_REACH.toFixed(1)} star radii`);
  });

  it("keeps the halo on its own quad, with the clip on the point quad", () => {
    expect(STAR_VERTEX).toContain("varying float vHaloQuad;");
    expect(STAR_FRAGMENT).toContain("varying float vHaloQuad;");
    expect(STAR_FRAGMENT).toContain("float r = d / (vHaloQuad * 0.5);");
    expect(STAR_FRAGMENT).toContain("if (d > vQuad * 0.5) discard;");
  });

  it("builds the halo quad the way the tested mirror does", () => {
    expect(STAR_VERTEX).toContain("vHaloQuad = max(vSize * mix(1.6, 3.6, vGlow), 4.0 * uPixelRatio);");
  });
});

describe("diffraction rays", () => {
  it("are built from the constants the tested maths uses", () => {
    expect(STAR_FRAGMENT).toContain("smoothstep(0.6, 5.0, p.x)");
    expect(STAR_FRAGMENT).toContain("smoothstep(0.6, 5.0, p.y)");
    expect(STAR_FRAGMENT).toContain("exp(-p.y * 3.0) * alongX");
    expect(STAR_FRAGMENT).toContain("exp(-p.x * 3.0) * alongY");
    expect(STAR_FRAGMENT).toContain("float rays = spike * 0.34 * vRay;");
  });

  it("add nothing for a star without rays, because the term is scaled by vRay", () => {
    expect(STAR_FRAGMENT).toContain("(halo + rays)");
    expect(STAR_FRAGMENT.match(/vRay/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("measure the position in star radii on both axes", () => {
    expect(STAR_FRAGMENT).toContain("abs((gl_PointCoord - 0.5) * vQuad) / max(vSize * 0.5, 0.0001)");
  });

  it("keep the core and halo terms as they were", () => {
    expect(STAR_FRAGMENT).toContain("float core = exp(-2.6 * (d / coreRadius) * (d / coreRadius));");
    expect(STAR_FRAGMENT).toContain(
      "float halo = mix(0.08, 0.24, heroGlow) * vGlow * exp(-6.5 * r * r) * (1.0 - smoothstep(0.5, 1.0, r));",
    );
    expect(STAR_FRAGMENT).toContain("vec3 coreColor = mix(vColor, vec3(1.0), (0.18 + 0.4 * vRay) * core);");
  });
});

describe("white-hot cores", () => {
  it("are built from the constants the tested maths uses", () => {
    expect(STAR_FRAGMENT).toContain(`${WHITE_CORE_BASE} + ${WHITE_CORE_EXTRA} * vRay`);
  });

  it("keep the old 0.18 whiteness for a star without rays, because the extra is scaled by vRay", () => {
    expect(WHITE_CORE_BASE).toBe(0.18);
    expect(STAR_FRAGMENT).not.toContain("vec3(1.0), 0.18 * core)");
    expect(STAR_FRAGMENT).toMatch(/\(0\.18 \+ 0\.4 \* vRay\) \* core/);
  });
});
