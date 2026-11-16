"use client";

import { ASTRA_REPLAY_EVENT } from "@/lib/astra-pose";

/**
 * The round button in the corner of the star field. It asks the field to put the
 * mark back at rest and play the entrance again, through a window event, so the
 * button does not need to know how the field draws. Hidden for visitors who ask
 * for reduced motion, who get no entrance to replay.
 */
export function AstraReplayButton() {
  return (
    <button
      type="button"
      aria-label="Replay the star field animation"
      // Pressing the button must not start a drag on the stage behind it.
      onPointerDown={(event) => event.stopPropagation()}
      onClick={() => window.dispatchEvent(new Event(ASTRA_REPLAY_EVENT))}
      className="absolute right-3 bottom-3 z-20 grid size-9 cursor-pointer place-items-center rounded-full bg-white/15 text-white/80 outline-white/70 transition-colors hover:bg-white/25 hover:text-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:hidden"
    >
      <svg
        aria-hidden
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </button>
  );
}
