import { describe, expect, it } from "vitest";
import {
  ASTRA_REPLAY_EVENT,
  FOLLOW_DAMPING,
  REST_EPSILON,
  isAtRest,
  nearestTurn,
  restState,
  settleToward,
  wrapAngle,
} from "@/lib/astra-pose";

describe("ASTRA_REPLAY_EVENT", () => {
  it("is a stable, namespaced event name", () => {
    expect(ASTRA_REPLAY_EVENT).toBe("astra:replay");
  });

  it("can be sent and heard on an event target", () => {
    const target = new EventTarget();
    let heard = 0;
    target.addEventListener(ASTRA_REPLAY_EVENT, () => heard++);
    target.dispatchEvent(new Event(ASTRA_REPLAY_EVENT));
    target.dispatchEvent(new Event("astra:other"));
    expect(heard).toBe(1);
  });
});

describe("restState", () => {
  it("is the rest angles", () => {
    expect(restState({ yaw: 0.62, pitch: -0.18 })).toEqual({ yaw: 0.62, pitch: -0.18 });
  });

  it("returns a fresh object each time, so a pose can be changed without changing rest", () => {
    const rest = { yaw: 1, pitch: 2 };
    const a = restState(rest);
    const b = restState(rest);
    a.yaw = 9;
    expect(b.yaw).toBe(1);
    expect(rest.yaw).toBe(1);
  });
});

describe("wrapAngle", () => {
  it("leaves an angle inside (-PI, PI] alone", () => {
    expect(wrapAngle(0.5)).toBeCloseTo(0.5);
    expect(wrapAngle(-3)).toBeCloseTo(-3);
    expect(wrapAngle(Math.PI)).toBeCloseTo(Math.PI);
  });

  it("brings a wound angle back into (-PI, PI]", () => {
    expect(wrapAngle(Math.PI * 2 + 0.25)).toBeCloseTo(0.25);
    expect(wrapAngle(-Math.PI * 4 - 0.25)).toBeCloseTo(-0.25);
    expect(wrapAngle(-Math.PI)).toBeCloseTo(Math.PI);
  });
});

describe("nearestTurn", () => {
  const rest = { yaw: 0.62, pitch: -0.18 };

  it("keeps a pose that is already the short way from rest", () => {
    const pose = nearestTurn({ yaw: 1.2, pitch: 0.1 }, rest);
    expect(pose.yaw).toBeCloseTo(1.2);
    expect(pose.pitch).toBeCloseTo(0.1);
  });

  it("unwinds full turns, keeping the same orientation", () => {
    const pose = nearestTurn({ yaw: 0.62 + Math.PI * 6 + 0.3, pitch: -0.18 - Math.PI * 2 }, rest);
    expect(pose.yaw).toBeCloseTo(0.92);
    expect(pose.pitch).toBeCloseTo(-0.18);
  });
});

describe("settleToward", () => {
  const rest = { yaw: 0, pitch: 0 };

  it("moves 1 - exp(-damping * dt) of the way in one frame", () => {
    const next = settleToward({ yaw: 1, pitch: -2 }, rest, FOLLOW_DAMPING, 1 / 60);
    const k = 1 - Math.exp(-FOLLOW_DAMPING / 60);
    expect(next.yaw).toBeCloseTo(1 - k);
    expect(next.pitch).toBeCloseTo(-2 * (1 - k));
  });

  it("does not depend on the frame rate", () => {
    let fast = { yaw: 1, pitch: 1 };
    for (let i = 0; i < 120; i++) fast = settleToward(fast, rest, FOLLOW_DAMPING, 1 / 120);
    let slow = { yaw: 1, pitch: 1 };
    for (let i = 0; i < 30; i++) slow = settleToward(slow, rest, FOLLOW_DAMPING, 1 / 30);
    expect(fast.yaw).toBeCloseTo(slow.yaw, 6);
    expect(fast.yaw).toBeCloseTo(Math.exp(-FOLLOW_DAMPING), 6);
  });

  it("comes to rest within about two seconds", () => {
    let pose = { yaw: Math.PI, pitch: -Math.PI / 2 };
    for (let i = 0; i < 120; i++) pose = settleToward(pose, rest, FOLLOW_DAMPING, 1 / 60);
    expect(isAtRest(pose, rest)).toBe(true);
  });

  it("moves nothing for a bad step or damping", () => {
    const pose = { yaw: 0.4, pitch: 0.2 };
    for (const [damping, dt] of [
      [FOLLOW_DAMPING, 0],
      [FOLLOW_DAMPING, -1],
      [FOLLOW_DAMPING, Number.NaN],
      [0, 1 / 60],
      [Number.POSITIVE_INFINITY, 1 / 60],
    ]) {
      expect(settleToward(pose, rest, damping, dt)).toEqual(pose);
    }
  });

  it("does not change the pose it is given", () => {
    const pose = { yaw: 0.4, pitch: 0.2 };
    settleToward(pose, rest, FOLLOW_DAMPING, 1 / 60);
    expect(pose).toEqual({ yaw: 0.4, pitch: 0.2 });
  });
});

describe("isAtRest", () => {
  it("is true only within REST_EPSILON on both axes", () => {
    const rest = { yaw: 0.62, pitch: -0.18 };
    expect(isAtRest(rest, rest)).toBe(true);
    expect(isAtRest({ yaw: 0.62 + REST_EPSILON / 2, pitch: -0.18 }, rest)).toBe(true);
    expect(isAtRest({ yaw: 0.62 + REST_EPSILON * 2, pitch: -0.18 }, rest)).toBe(false);
    expect(isAtRest({ yaw: 0.62, pitch: -0.18 - REST_EPSILON * 2 }, rest)).toBe(false);
  });
});
