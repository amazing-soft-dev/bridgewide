"use client";

import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Word-rise headline. The last word gets a brand wipe.
 * On a light ground that word turns white once the wipe arrives.
 * On a dark ground the word stays white.
 */
export function AccentLine({
  text,
  on,
  tone = "light",
  className = "",
}: {
  text: string;
  on: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/);
  const shown = on || reduced;

  return (
    <span className={className}>
      {words.map((word, index) => {
        const last = index === words.length - 1;
        const delay = 140 + index * 60;
        return (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden align-top">
            <span
              data-motion="reveal"
              className={`relative inline-block transition-transform duration-1000 ease-[cubic-bezier(0.2,0.75,0.2,1)] ${
                shown ? "translate-y-0" : "translate-y-[108%]"
              }`}
              style={{ transitionDelay: `${delay}ms` }}
            >
              {last ? (
                <span
                  aria-hidden
                  data-motion="reveal"
                  className={`absolute inset-x-[-0.06em] top-[0.12em] bottom-[0.02em] -z-10 origin-left rounded-[0.08em] bg-brand transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${
                    shown ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ transitionDelay: "700ms" }}
                />
              ) : null}
              <span
                className={
                  last && tone === "light"
                    ? `relative z-10 transition-colors duration-300 ${shown ? "text-white delay-1000" : "text-ink"}`
                    : "relative z-10"
                }
              >
                {word}
              </span>
              {index < words.length - 1 ? "\u00A0" : null}
            </span>
          </span>
        );
      })}
    </span>
  );
}
