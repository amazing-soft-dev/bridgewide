"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { contact } from "@/content/site";

import type { FaqItem } from "@/components/ui/Faq";

export function QuestionDesk({ items }: { items: readonly FaqItem[] }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? "");
  const baseId = useId();

  return (
    <div className="grid items-start gap-6 min-[900px]:grid-cols-2">
      <ul className="m-0 grid list-none gap-2 p-0">
        {items.map((item, index) => {
          const open = item.id === openId;
          const buttonId = `${baseId}-${item.id}-button`;
          const panelId = `${baseId}-${item.id}-panel`;
          const number = String(index + 1).padStart(2, "0");

          return (
            <li key={item.id}>
              <button
                id={buttonId}
                type="button"
                aria-pressed={open}
                aria-controls={panelId}
                onClick={() => setOpenId(item.id)}
                className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors duration-300 ${
                  open ? "bg-brand text-white" : "bg-white text-ink hover:bg-cloud-soft"
                }`}
              >
                <span className={`font-mono text-xs ${open ? "text-white/80" : "text-stone"}`}>{number}</span>
                <span className="font-display text-base leading-snug md:text-lg">{item.question}</span>
                <span
                  className={`hidden font-mono text-[11px] tracking-[0.12em] uppercase min-[700px]:inline ${open ? "text-white/80" : "text-stone"}`}
                >
                  Candidates
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div>
        <div className="rounded-xl bg-ink px-6 py-7 text-cloud md:px-8 md:py-8">
          {items.map((item) => {
            const open = item.id === openId;
            const buttonId = `${baseId}-${item.id}-button`;
            const panelId = `${baseId}-${item.id}-panel`;

            return (
              <div key={item.id} id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} inert={!open}>
                <p className="font-mono text-xs tracking-[0.16em] text-cloud/60 uppercase">Candidates</p>
                <h3 className="font-display mt-4 text-3xl leading-tight">{item.question}</h3>
                <p className="mt-4 text-base leading-7 text-cloud/85">{item.answer}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">Still asking?</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">
              Write to the desk. A person answers, not a bot.
            </p>
            <a href={`mailto:${contact.email}`} className="mt-2 inline-block font-mono text-sm text-ink">
              {contact.email}
            </a>
          </div>
          <Button href="/ai-training/contact" compact>
            Contact the desk
          </Button>
        </div>
      </div>
    </div>
  );
}
