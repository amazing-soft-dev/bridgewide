import { describe, expect, it, vi } from "vitest";
import {
  CONTEXT_RESTORE_MS,
  canCreateWebgl,
  type ProbeCanvas,
  type RunState,
  shouldRun,
} from "@/lib/astra-webgl";

/** A fake canvas that offers only the listed context kinds. */
function canvasWith(kinds: Record<string, unknown>): ProbeCanvas {
  return { getContext: (kind: string) => kinds[kind] ?? null };
}

describe("canCreateWebgl", () => {
  it("is true when WebGL 2 is available", () => {
    expect(canCreateWebgl(() => canvasWith({ webgl2: {} }))).toBe(true);
  });

  it("falls back to WebGL 1", () => {
    expect(canCreateWebgl(() => canvasWith({ webgl: {} }))).toBe(true);
  });

  it("is false when neither is available", () => {
    expect(canCreateWebgl(() => canvasWith({}))).toBe(false);
  });

  it("asks for WebGL 2 first and only tries WebGL 1 when that is missing", () => {
    const getContext = vi.fn((kind: string) => (kind === "webgl2" ? {} : null));
    expect(canCreateWebgl(() => ({ getContext }))).toBe(true);
    expect(getContext).toHaveBeenCalledTimes(1);
    expect(getContext).toHaveBeenCalledWith("webgl2");
  });

  it("is false when there is no canvas", () => {
    expect(canCreateWebgl(() => null)).toBe(false);
  });

  it("is false, not a thrown error, when the canvas factory throws", () => {
    expect(
      canCreateWebgl(() => {
        throw new Error("no document");
      }),
    ).toBe(false);
  });

  it("is false, not a thrown error, when getContext throws", () => {
    expect(
      canCreateWebgl(() => ({
        getContext: () => {
          throw new Error("blocked by policy");
        },
      })),
    ).toBe(false);
  });

  it("hands the probe context back, so the page keeps its context budget", () => {
    const loseContext = vi.fn();
    const context = { getExtension: vi.fn(() => ({ loseContext })) };
    expect(canCreateWebgl(() => canvasWith({ webgl2: context }))).toBe(true);
    expect(context.getExtension).toHaveBeenCalledWith("WEBGL_lose_context");
    expect(loseContext).toHaveBeenCalledTimes(1);
  });

  it("is still true when the context has no way to be handed back", () => {
    expect(canCreateWebgl(() => canvasWith({ webgl2: { getExtension: () => null } }))).toBe(true);
    expect(canCreateWebgl(() => canvasWith({ webgl2: { getExtension: () => ({}) } }))).toBe(true);
    expect(
      canCreateWebgl(() =>
        canvasWith({
          webgl2: {
            getExtension: () => {
              throw new Error("lost");
            },
          },
        }),
      ),
    ).toBe(false);
  });
});

describe("shouldRun", () => {
  const all: RunState = { inView: true, tabVisible: true, contextLive: true };

  it("runs only when the section is on screen, the tab is visible and the context is alive", () => {
    expect(shouldRun(all)).toBe(true);
  });

  it("stops when the section is off screen", () => {
    expect(shouldRun({ ...all, inView: false })).toBe(false);
  });

  it("stops in a hidden tab", () => {
    expect(shouldRun({ ...all, tabVisible: false })).toBe(false);
  });

  it("stops while the context is lost", () => {
    expect(shouldRun({ ...all, contextLive: false })).toBe(false);
  });

  it("is true for exactly one of the eight combinations", () => {
    const flags = [true, false];
    let running = 0;
    for (const inView of flags) {
      for (const tabVisible of flags) {
        for (const contextLive of flags) {
          if (shouldRun({ inView, tabVisible, contextLive })) running++;
        }
      }
    }
    expect(running).toBe(1);
  });
});

describe("CONTEXT_RESTORE_MS", () => {
  it("waits long enough for a normal restore, but not forever", () => {
    expect(CONTEXT_RESTORE_MS).toBeGreaterThanOrEqual(1000);
    expect(CONTEXT_RESTORE_MS).toBeLessThanOrEqual(10000);
  });
});
