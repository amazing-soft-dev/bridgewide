import { staticDust, staticDustBackground } from "@/lib/astra-static-dust";

/** The same dots on every render: computed once, from a fixed seed. */
const background = staticDustBackground(staticDust());

/**
 * A still sky for visitors whose browser cannot run the WebGL star field:
 * soft dots drawn with CSS gradients, no mark, no animation. The words
 * "Bridge" and "Wide" stay on top of it in AstraField.
 */
export function AstraStaticDust() {
  return (
    <div
      aria-hidden
      data-astra-fallback="static-dust"
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: background }}
    />
  );
}
