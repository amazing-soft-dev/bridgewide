"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

export type AccordionItem = {
  id: string;
  label?: string;
  question: string;
  answer: string;
};

export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const baseId = useId();

  return (
    <div className="border-t border-ink/15">
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id} className="border-b border-ink/15">
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span>
                  {item.label ? (
                    <span className="mb-2 block font-mono text-xs tracking-[0.16em] text-brand uppercase">
                      {item.label}
                    </span>
                  ) : null}
                  <span className="font-display text-2xl leading-tight text-ink md:text-3xl">
                    {item.question}
                  </span>
                </span>
                <span aria-hidden className="mt-1 font-mono text-lg text-brand">
                  {open ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId}>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key={item.id}
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-6 text-base leading-7 text-ink-soft">
                      {item.answer}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
