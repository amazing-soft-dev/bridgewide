// How a person turns the mark: dragging and the arrow keys.
//
// The numbers match the comparable hero on openai.com (checked live): one
// pixel of drag turns the field 0.005 rad, and one arrow-key press turns it
// 0.08 rad, the same as a 16 px drag. These are pure functions so the field
// only has to apply what they return.

/** Radians the mark turns for each pixel of drag. */
export const DRAG_RADIANS_PER_PX = 0.005;
/** Radians the mark turns for one arrow-key press (a 16 px drag). */
export const KEY_RADIANS = 0.08;

/** A change in the mark's pose: `yaw` turns it sideways, `pitch` tips it. */
export type Turn = { yaw: number; pitch: number };

const NONE: Turn = { yaw: 0, pitch: 0 };

/** The turn for a drag of `dx` by `dy` pixels. A bad number turns nothing. */
export function dragTurn(dx: number, dy: number): Turn {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return { ...NONE };
  return { yaw: dx * DRAG_RADIANS_PER_PX, pitch: dy * DRAG_RADIANS_PER_PX };
}

/**
 * The turn for one key press, or null for a key that does not turn the mark.
 * Left and right turn it sideways; up and down tip it.
 */
export function keyTurn(key: string): Turn | null {
  switch (key) {
    case "ArrowLeft":
      return { yaw: -KEY_RADIANS, pitch: 0 };
    case "ArrowRight":
      return { yaw: KEY_RADIANS, pitch: 0 };
    case "ArrowUp":
      return { yaw: 0, pitch: -KEY_RADIANS };
    case "ArrowDown":
      return { yaw: 0, pitch: KEY_RADIANS };
    default:
      return null;
  }
}

/** The pose after applying a turn. Neither input is changed. */
export function addTurn(pose: Turn, turn: Turn): Turn {
  return { yaw: pose.yaw + turn.yaw, pitch: pose.pitch + turn.pitch };
}
