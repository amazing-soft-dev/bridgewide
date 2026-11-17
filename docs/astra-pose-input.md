# Astra star field: turning the mark

The star field after the footer (`src/components/home/AstraField.tsx`) lets a visitor turn the BridgeWide mark by dragging it or with the arrow keys. The numbers live in `src/lib/astra-pose-input.ts`, where they are tested without WebGL. They match the comparable hero on openai.com, which was read live in a browser.

## What it does

- **A real button.** A `<button>` is laid over the stage, named "Drag or use arrow keys to turn the BridgeWide mark". It is in the tab order, so a keyboard visitor can reach it, and it shows a 2 px white focus ring inset from the stage edge when reached by keyboard.
- **Drag.** `dragTurn(dx, dy)` turns the mark 0.005 rad for each pixel dragged, on both axes. Sideways used to be 0.0075 rad per pixel, so a drag now turns the mark a third less sideways, as on the comparable hero.
- **Arrow keys.** `keyTurn(key)` gives one step of 0.08 rad for each arrow press (the same as a 16 px drag): left and right turn the mark sideways, up and down tip it. The handler calls `preventDefault`, so the page does not scroll. Every other key returns `null` and keeps its normal job, and Alt, Ctrl and Meta arrows are left alone so browser shortcuts such as Alt+Left (Back) still work.
- **Pointer capture.** A drag captures the pointer, so it keeps turning the mark when the pointer leaves the stage. Only the primary pointer starts a drag, and a drag ends on pointer-up, pointer-cancel, lost capture, window blur and a hidden tab.
- **Reduced motion.** The button is hidden (`motion-reduce:hidden`), and the mark stays at rest, as before.

## What it does not touch

The mark's shape, the ribbon paths, flow, gather, camera framing, bloom and every star's look. `src/components/brand/mark.ts` is unchanged. The pose still comes from the same `orbit` ref the draw loop reads.

## Tuning

| Constant | Meaning |
| --- | --- |
| `DRAG_RADIANS_PER_PX` | Radians the mark turns for each pixel of drag. |
| `KEY_RADIANS` | Radians the mark turns for one arrow-key press. |

## Tests

`src/lib/astra-pose-input.test.ts`: the drag maths and its signs, equal speed on both axes, non-finite input, each arrow key, unknown keys, the 16 px equivalence, and adding a turn to a pose. `e2e/astra-controls.spec.ts`: the named button takes focus, arrow keys do not scroll the page, Tab moves on, and the button is absent under reduced motion.
