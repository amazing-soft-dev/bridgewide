"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";
import { contact } from "@/content/site";

import type { FaqItem } from "@/components/ui/Faq";

export type DeskLink = { label: string; href: string };

/** The "Still asking?" line under the answer panel. */
export type QuestionDeskFooter = {
  note: string;
  links: readonly DeskLink[];
  cta?: DeskLink;
};

const defaultFooter: QuestionDeskFooter = {
  note: "Write to the desk. A person answers, not a bot.",
  links: [{ label: contact.email, href: `mailto:${contact.email}` }],
  cta: { label: "Contact the desk", href: "/ai-training/contact" },
};

const stubBase =
  "corner-cut relative grid w-full grid-cols-[34px_minmax(0,1fr)] items-center gap-3 rounded-md border py-4 pr-[46px] pl-4 text-left transition-[translate,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:translate-x-1 focus-visible:translate-x-1 motion-reduce:transition-none min-[700px]:grid-cols-[34px_minmax(0,1fr)_auto]";

const holeBase =
  "absolute top-1/2 right-4 size-3 -translate-y-1/2 rounded-full border-[1.5px] transition-[background-color,border-color] duration-300";

export function QuestionDesk({
  items,
  label = "Candidates",
  footer = defaultFooter,
}: {
  items: readonly FaqItem[];
  /** Shown on stubs and the panel when an item carries no label of its own. */
  label?: string;
  footer?: QuestionDeskFooter;
}) {
  const [openId, setOpenId] = useState(items[0]?.id ?? "");
  const baseId = useId();

  return (
    <div className="grid items-start gap-[clamp(24px,4vw,64px)] min-[900px]:grid-cols-2">
      <RevealGroup as="ul" className="m-0 grid list-none gap-2.5 p-0" stagger={0.07}>
        {items.map((item, index) => {
          const open = item.id === openId;
          const buttonId = `${baseId}-${item.id}-button`;
          const panelId = `${baseId}-${item.id}-panel`;
          const number = String(index + 1).padStart(2, "0");

          return (
            <RevealItem as="li" key={item.id}>
              <button
                id={buttonId}
                type="button"
                aria-pressed={open}
                aria-controls={panelId}
                onClick={() => setOpenId(item.id)}
                className={`${stubBase} ${
                  open
                    ? "border-brand bg-brand text-white"
                    : "border-cloud-soft bg-white text-ink hover:bg-cloud"
                }`}
              >
                <span className={`font-mono text-xs ${open ? "text-white/90" : "text-stone"}`}>
                  {number}
                </span>
                <span className="font-display text-base leading-snug md:text-lg">{item.question}</span>
                <span
                  className={`hidden font-mono text-[11px] tracking-[0.12em] uppercase min-[700px]:inline ${
                    open ? "text-white/90" : "text-stone"
                  }`}
                >
                  {item.label ?? label}
                </span>
                <i
                  aria-hidden
                  className={`${holeBase} ${
                    open ? "border-transparent bg-cloud" : "border-dashed border-cloud-soft"
                  }`}
                />
              </button>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <div className="grid gap-[22px] min-[900px]:sticky min-[900px]:top-24">
        <div className="corner-cut-lg grid min-h-[280px] content-start gap-3.5 rounded-[10px] bg-ink px-6 py-7 text-cloud md:px-9 md:py-9">
          {items.map((item) => {
            const open = item.id === openId;
            const buttonId = `${baseId}-${item.id}-button`;
            const panelId = `${baseId}-${item.id}-panel`;

            return (
              <div
                key={item.id}
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!open}
                inert={!open}
                className="grid gap-3.5"
              >
                <p className="font-mono text-xs tracking-[0.16em] text-cloud/60 uppercase">
                  {item.label ?? label}
                </p>
                <h3 className="font-display text-3xl leading-tight">{item.question}</h3>
                <p className="text-base leading-7 text-cloud/85">
                  {open ? <SplitWords key={item.id} text={item.answer} immediate /> : item.answer}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">Still asking?</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">{footer.note}</p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {footer.links.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="border-b border-transparent font-mono text-sm text-ink no-underline transition-colors duration-300 hover:border-ink"
                >
                  {item.label}
                </a>
              ))}
            </p>
          </div>
          {footer.cta ? (
            <Button href={footer.cta.href} compact>
              {footer.cta.label}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
