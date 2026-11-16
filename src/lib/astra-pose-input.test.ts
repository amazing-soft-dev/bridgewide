import { describe, expect, it } from "vitest";
import {
  addTurn,
  DRAG_RADIANS_PER_PX,
  dragTurn,
  KEY_RADIANS,
  keyTurn,
} from "@/lib/astra-pose-input";

describe("dragTurn", () => {
  it("turns the mark by a fixed amount per pixel", () => {
    expect(dragTurn(100, 0)).toEqual({ yaw: 100 * DRAG_RADIANS_PER_PX, pitch: 0 });
    expect(dragTurn(0, -40)).toEqual({ yaw: 0, pitch: -40 * DRAG_RADIANS_PER_PX });
  });

  it("keeps the sign of the drag, so dragging right turns it right", () => {
    expect(dragTurn(10, 10).yaw).toBeGreaterThan(0);
    expect(dragTurn(-10, -10).pitch).toBeLessThan(0);
  });

  it("is the same speed sideways and up and down", () => {
    const turn = dragTurn(20, 20);
    expect(turn.yaw).toBe(turn.pitch);
  });

  it("turns nothing for a number that is not finite", () => {
    expect(dragTurn(Number.NaN, 5)).toEqual({ yaw: 0, pitch: 0 });
    expect(dragTurn(5, Number.POSITIVE_INFINITY)).toEqual({ yaw: 0, pitch: 0 });
  });
});

describe("keyTurn", () => {
  it("maps each arrow key to one turn step", () => {
    expect(keyTurn("ArrowLeft")).toEqual({ yaw: -KEY_RADIANS, pitch: 0 });
    expect(keyTurn("ArrowRight")).toEqual({ yaw: KEY_RADIANS, pitch: 0 });
    expect(keyTurn("ArrowUp")).toEqual({ yaw: 0, pitch: -KEY_RADIANS });
    expect(keyTurn("ArrowDown")).toEqual({ yaw: 0, pitch: KEY_RADIANS });
  });

  it("ignores every other key, so they keep their normal job", () => {
    for (const key of ["Tab", "Enter", " ", "Escape", "a", "Home", "PageDown", ""]) {
      expect(keyTurn(key)).toBeNull();
    }
  });

  it("makes one key press equal a 16 px drag", () => {
    expect(keyTurn("ArrowRight")?.yaw).toBeCloseTo(dragTurn(16, 0).yaw, 10);
  });

  it("turns left and right by opposite amounts", () => {
    const left = keyTurn("ArrowLeft");
    const right = keyTurn("ArrowRight");
    expect(left && right && left.yaw + right.yaw).toBe(0);
  });
});

describe("addTurn", () => {
  it("adds a turn to a pose", () => {
    expect(addTurn({ yaw: 0.5, pitch: -0.25 }, { yaw: 0.25, pitch: 0.5 })).toEqual({
      yaw: 0.75,
      pitch: 0.25,
    });
  });

  it("leaves both inputs unchanged", () => {
    const pose = { yaw: 1, pitch: 2 };
    const turn = { yaw: 3, pitch: 4 };
    addTurn(pose, turn);
    expect(pose).toEqual({ yaw: 1, pitch: 2 });
    expect(turn).toEqual({ yaw: 3, pitch: 4 });
  });

  it("returns to the start after opposite key presses", () => {
    const start = { yaw: 0.3, pitch: 0.1 };
    const left = keyTurn("ArrowLeft");
    const right = keyTurn("ArrowRight");
    if (!left || !right) throw new Error("arrow keys must turn the mark");
    const back = addTurn(addTurn(start, right), left);
    expect(back.yaw).toBeCloseTo(start.yaw, 12);
    expect(back.pitch).toBe(start.pitch);
  });
});
