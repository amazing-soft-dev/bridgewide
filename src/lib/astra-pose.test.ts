import { describe, expect, it } from "vitest";
import { ASTRA_REPLAY_EVENT, restState } from "@/lib/astra-pose";

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
  it("is the rest angles, not moving", () => {
    expect(restState({ yaw: 0.62, pitch: -0.18 })).toEqual({
      yaw: 0.62,
      pitch: -0.18,
      yawVelocity: 0,
      pitchVelocity: 0,
    });
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
