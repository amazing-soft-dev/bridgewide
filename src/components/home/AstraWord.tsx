import type { ComponentProps, CSSProperties } from "react";
import { labelLetters, labelVars, type Side } from "@/lib/astra-label-motion";

type Props = Omit<ComponentProps<"p">, "children"> & {
  /** The word to show. */
  word: string;
  /** Which side of the stage the word sits on: its letters slide in from there. */
  side: Side;
  /** False shows the word as plain text, with no entrance (for the still sky). */
  animate?: boolean;
};

/**
 * One of the two words in the star field. Each letter is its own inline-block
 * that slides in on its own delay (see `src/lib/astra-label-motion.ts` and the
 * `.astra-letter` rule in the global stylesheet). The letters are plain text
 * inside the one element, so the word still reads, copies and is named as one word.
 */
export function AstraWord({ word, side, animate = true, ...rest }: Props) {
  if (!animate) return <p {...rest}>{word}</p>;
  const letters = labelLetters(word);
  return (
    <p {...rest}>
      {letters.map((letter, index) => (
        <span
          // The word never changes order, so the index is a stable key.
          key={index}
          data-motion
          className="astra-letter"
          style={labelVars(index, letters.length, side) as unknown as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </p>
  );
}
