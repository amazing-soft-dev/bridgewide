# Astra star field: the turned pose and Replay

On the star field after the footer (`src/components/home/AstraField.tsx`) a turned mark now stays turned, and a round Replay button in the corner puts it back and plays the entrance again. This matches the comparable hero on openai.com, which was read live in a browser. The event name and the pose helper live in `src/lib/astra-pose.ts`.

## What it does

- **The pose persists.** The spring that pulled the mark back to its rest pose after a drag is gone. A mark turned by dragging, or by the arrow keys, stays where the visitor left it. On the comparable hero a field turned with the arrow keys had not moved four seconds later.
- **Reduced motion pins it.** Visitors who ask for reduced motion always see the mark at rest, as before.
- **Replay.** `AstraReplayButton` is a 36 px round button in the bottom-right corner of the stage: a rotate-ccw icon on a 15% white disc that goes to 25% on hover. It is named "Replay the star field animation", has a focus ring, and is hidden under reduced motion, where there is no entrance to replay.
- **One event.** Clicking the button sends `ASTRA_REPLAY_EVENT` ("astra:replay") on `window`. The button does not need to know how the field draws; the field listens for the event.

## What the field does on Replay

1. Any drag in progress stops.
2. The pose goes back to rest (`restState({ yaw, pitch })`, a fresh object so rest is never changed).
3. The reveal clock restarts (`revealStart = now`), so every star fades in again from nothing. See `docs/astra-reveal.md`.

The button stops its pointer-down from reaching the stage, so pressing it never starts a drag.

## What it does not touch

The mark's shape, the ribbon paths, flow, gather, camera framing, bloom and every star's look. `src/components/brand/mark.ts` is unchanged.

## Tests

`src/lib/astra-pose.test.ts`: the event name, that it can be sent and heard, and that `restState` returns a fresh rest pose each time. `e2e/astra-replay.spec.ts`: the named button sits in the stage's corner, replaying by mouse and by keyboard raises no script error and leaves the field on screen, and the button is absent under reduced motion.
