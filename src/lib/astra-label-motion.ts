// How the two words ("Bridge" and "Wide") arrive.
//
// On the comparable hero on openai.com (checked live) each word's letters slide
// in from the outside, one after another, starting with the letter nearest the
// middle of the stage. The left word slides in from the left (44 px), the right
// word from the right, each letter takes 1 s, and delay is 0.85 s plus 0.1 s
// for every letter further from the middle. These are pure functions so the
// timing can be tested without a browser.

/** Which side of the stage a word sits on. */
export type Side = "left" | "right";

/** How far, in px, a letter starts from its place. */
export const LABEL_SHIFT_PX = 44;
/** Delay of the letter nearest the middle, in seconds. */
export const LABEL_BASE_DELAY_S = 0.85;
/** Extra delay for each letter further from the middle, in seconds. */
export const LABEL_STEP_S = 0.1;
/** How long one letter takes to arrive, in seconds. */
export const LABEL_DURATION_S = 1;

/** Rounds away floating-point noise, so 0.85 + 0.1 * 2 is 1.05 and not 1.0499999999999998. */
function clean(seconds: number) {
  return Math.round(seconds * 1000) / 1000;
}

/** The sideways start of a letter: negative for the left word, positive for the right. */
export function labelShift(side: Side): number {
  return side === "left" ? -LABEL_SHIFT_PX : LABEL_SHIFT_PX;
}

/**
 * The delay of letter `index` in a word of `count` letters, in seconds.
 * The letter nearest the middle of the stage goes first: the last letter of the
 * left word, the first letter of the right word.
 */
export function labelDelay(index: number, count: number, side: Side): number {
  const fromMiddle = side === "left" ? count - 1 - index : index;
  return clean(LABEL_BASE_DELAY_S + LABEL_STEP_S * Math.max(0, fromMiddle));
}
