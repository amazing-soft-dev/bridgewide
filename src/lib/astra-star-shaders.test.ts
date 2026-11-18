import { describe, expect, it } from "vitest";
import {
  COLOR_ENERGY_GAIN,
  CORE_EDGE,
  CORE_POWER,
  FILTERED_AREA,
  MIN_QUAD_PX,
  RAY_BRIGHTNESS,
  RAY_FADE_FROM,
  RAY_FALLOFF,
  RAY_GAIN,
  UNRESOLVED_CORE,
  WHITE_CORE,
} from "@/lib/astra-star-shader-math";
import { glsl, STAR_FRAGMENT, STAR_VERTEX } from "@/lib/astra-star-shaders";

/** Every `varying` declared in a shader, as "type name". */
function varyings(source: string): string[] {
  return [...source.matchAll(/^varying\s+(\w+)\s+(\w+);/gm)].map((match) => `${match[1]} ${match[2]}`);
}

describe("glsl", () => {
  it("always writes a float literal", () => {
    expect(glsl(4)).toBe("4.0");
    expect(glsl(0.28)).toBe("0.28");
  });
});

describe("star shaders", () => {
  it("each have a main function and no unfilled template slot", () => {
    for (const source of [STAR_VERTEX, STAR_FRAGMENT]) {
      expect(source).toContain("void main()");
      expect(source).not.toContain("${");
      expect(source).not.toContain("NaN");
      expect(source).not.toContain("undefined");
    }
  });

  it("read the per-star attributes the component fills, brightness among them", () => {
    for (const attribute of ["size", "bright", "alpha"]) {
      expect(STAR_VERTEX).toContain(`attribute float ${attribute};`);
    }
    expect(STAR_VERTEX).not.toContain("attribute float glow;");
    expect(STAR_VERTEX).not.toContain("attribute float ray;");
  });

  it("draw each star on its own diameter, never under the minimum quad", () => {
    expect(STAR_VERTEX).toContain(`gl_PointSize = max(vDiameter, ${glsl(MIN_QUAD_PX)});`);
  });

  it("agree on every varying the fragment shader reads", () => {
    const sent = new Set(varyings(STAR_VERTEX));
    for (const received of varyings(STAR_FRAGMENT)) expect(sent.has(received)).toBe(true);
  });

  it("write HDR emission with the star's coverage as alpha", () => {
    expect(STAR_FRAGMENT).toContain("* vBright * (1.0 + colorEnergy * " + glsl(COLOR_ENERGY_GAIN) + ")");
    expect(STAR_FRAGMENT).toContain("gl_FragColor = vec4(emission, alpha);");
    expect(STAR_FRAGMENT).toContain("* vAlpha;");
  });
});

describe("the fragment shader is built from the tested maths", () => {
  it("uses the core's edge and power", () => {
    expect(STAR_FRAGMENT).toContain(`smoothstep(${glsl(CORE_EDGE)}, 1.0, distanceToCenter), ${glsl(CORE_POWER)})`);
  });

  it("uses the ray falloff, fade, gain and brightness range", () => {
    expect(STAR_FRAGMENT).toContain(`exp(-abs(point.y) * ${glsl(RAY_FALLOFF)})`);
    expect(STAR_FRAGMENT).toContain(`smoothstep(${glsl(RAY_FADE_FROM)}, 1.0, abs(point.x))`);
    expect(STAR_FRAGMENT).toContain(`* ${glsl(RAY_GAIN)}`);
    expect(STAR_FRAGMENT).toContain(`smoothstep(${glsl(RAY_BRIGHTNESS.from)}, ${glsl(RAY_BRIGHTNESS.to)}, vBright)`);
  });

  it("uses the filtered point and white-core constants", () => {
    expect(STAR_FRAGMENT).toContain(`* ${glsl(FILTERED_AREA)} * vDiameter * vDiameter`);
    expect(STAR_FRAGMENT).toContain(`mix(${glsl(UNRESOLVED_CORE)}, core, resolved)`);
    expect(STAR_FRAGMENT).toContain(
      `smoothstep(${glsl(WHITE_CORE.from)}, ${glsl(WHITE_CORE.to)}, vBright) * ${glsl(WHITE_CORE.gain)}`,
    );
  });

  it("drops a fragment with no coverage", () => {
    expect(STAR_FRAGMENT).toContain("if (alpha <= 0.0) discard;");
  });
});
