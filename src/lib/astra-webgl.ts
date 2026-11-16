/**
 * WebGL support and lifecycle decisions for the Astra field after the footer.
 * Plain functions with no DOM access of their own (the canvas comes in as an
 * argument), so they can be tested without a browser.
 */

/** The part of a canvas the support check uses. */
export type ProbeCanvas = { getContext: (kind: string) => unknown };

type ProbeContext = { getExtension?: (name: string) => unknown };
type LoseContext = { loseContext?: () => void };

/**
 * Whether the browser can make a WebGL context (WebGL 2, or WebGL 1 as a
 * fallback). Any failure, such as a blocked GPU, a disabled setting or a
 * factory that throws, counts as no. When a context is made it is handed
 * straight back, because browsers cap how many live contexts a page may hold.
 */
export function canCreateWebgl(createCanvas: () => ProbeCanvas | null): boolean {
  try {
    const canvas = createCanvas();
    if (!canvas) return false;
    const context = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as ProbeContext | null;
    if (!context) return false;
    const lose = context.getExtension?.("WEBGL_lose_context") as LoseContext | null | undefined;
    lose?.loseContext?.();
    return true;
  } catch {
    return false;
  }
}
