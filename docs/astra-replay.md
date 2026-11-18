# Astra star field: the turned pose, the return after a drag, and Replay

On the star field after the footer (`src/components/home/AstraField.tsx`) a released drag eases the mark back to rest, an arrow-key turn stays, and a round Replay button in the corner puts it back and plays the entrance again. The event name and the pose helpers live in `src/lib/astra-pose.ts`.

## What it does

- **A released drag returns to rest.** openai.com ships its Astra field with `interaction: { faceForward: true, followDamping: 6 }`. When a drag ends (pointer up or cancel, lost capture, window blur, hidden tab), the pose is wound to the nearest equivalent turn (`nearestTurn`) and eased back each frame by `settleToward`: it moves `1 - exp(-6 * dt)` of the way, so the curve is the same at any frame rate and the mark is home in about a second. The turn surface carries `data-settling="true"` while it eases. The renderer that reads those config keys on openai.com was not readable when checked, so the curve is inferred from the key names and values (#430).
- **A new drag catches it.** Pressing down mid-settle stops the settle and drags from wherever the mark is.
- **An arrow-key turn stays.** On the comparable hero a field turned with the arrow keys had not moved four seconds later (#414), so a key press stops any settle and the turn persists.
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

`src/lib/astra-pose.test.ts`: the event name, that it can be sent and heard, that `restState` returns a fresh rest pose each time, and the settle helpers (the per-frame step, frame-rate independence, home within two seconds, bad inputs, unwinding full turns). `e2e/astra-controls.spec.ts`: a released drag sets and then clears `data-settling`, and an arrow key stops a settle. `e2e/astra-replay.spec.ts`: the named button sits in the stage's corner, replaying by mouse and by keyboard raises no script error and leaves the field on screen, and the button is absent under reduced motion.
