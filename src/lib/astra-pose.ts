// The mark's pose and the Replay signal.
//
// On the comparable hero on openai.com (checked live) a turned field stays
// where the visitor left it, and a round Replay button in the corner brings
// it back and plays the entrance again. The button and the field talk through
// one window event, so neither has to know about the other.

/** The window event the Replay button sends and the star field listens for. */
export const ASTRA_REPLAY_EVENT = "astra:replay";

/** The mark's turn: `yaw` is sideways, `pitch` is tipped. Both are in radians. */
export type Pose = { yaw: number; pitch: number };

/** The pose at rest: a fresh object at the given angles. */
export function restState(rest: Pose): Pose {
  return { yaw: rest.yaw, pitch: rest.pitch };
}
