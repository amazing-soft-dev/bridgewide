// The mark's pose and the Replay signal.
//
// On the comparable hero on openai.com a round Replay button in the corner
// brings the field back and plays the entrance again. A released drag eases
// the field back to rest (settleToward, FOLLOW_DAMPING). The button and the
// field talk through one window event, so neither has to know about the other.

/** The window event the Replay button sends and the star field listens for. */
export const ASTRA_REPLAY_EVENT = "astra:replay";

/** The mark's turn: `yaw` is sideways, `pitch` is tipped. Both are in radians. */
export type Pose = { yaw: number; pitch: number };

/** The pose at rest: a fresh object at the given angles. */
export function restState(rest: Pose): Pose {
  return { yaw: rest.yaw, pitch: rest.pitch };
}

/**
 * How fast a released mark turns back to rest, per second. openai.com's Astra
 * config ships `interaction: { faceForward: true, followDamping: 6 }`.
 */
export const FOLLOW_DAMPING = 6;
/** Radians from rest, on both axes, under which the mark counts as at rest. */
export const REST_EPSILON = 1e-4;

/** An angle wrapped to (-PI, PI]. */
export function wrapAngle(angle: number): number {
  const turn = Math.PI * 2;
  const wrapped = (((angle + Math.PI) % turn) + turn) % turn;
  return wrapped === 0 ? Math.PI : wrapped - Math.PI;
}

/**
 * The same orientation as `pose`, as close to `rest` as possible. A drag can
 * wind the mark round several times; settling from this pose takes the short
 * way back instead of unwinding every turn.
 */
export function nearestTurn(pose: Pose, rest: Pose): Pose {
  return {
    yaw: rest.yaw + wrapAngle(pose.yaw - rest.yaw),
    pitch: rest.pitch + wrapAngle(pose.pitch - rest.pitch),
  };
}

/**
 * One frame of easing toward rest: exponential damping, so the step does not
 * depend on the frame rate. A bad `dt` or damping moves nothing.
 */
export function settleToward(pose: Pose, rest: Pose, damping: number, dt: number): Pose {
  if (!Number.isFinite(damping) || !Number.isFinite(dt) || damping <= 0 || dt <= 0) {
    return { yaw: pose.yaw, pitch: pose.pitch };
  }
  const k = 1 - Math.exp(-damping * dt);
  return {
    yaw: pose.yaw + (rest.yaw - pose.yaw) * k,
    pitch: pose.pitch + (rest.pitch - pose.pitch) * k,
  };
}

/** True when `pose` is within REST_EPSILON of `rest` on both axes. */
export function isAtRest(pose: Pose, rest: Pose): boolean {
  return Math.abs(pose.yaw - rest.yaw) < REST_EPSILON && Math.abs(pose.pitch - rest.pitch) < REST_EPSILON;
}
