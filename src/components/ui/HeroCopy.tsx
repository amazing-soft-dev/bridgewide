import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";

const titleClass = {
  light: "font-display mt-4 text-4xl leading-[1.05] text-ink md:text-6xl",
  dark: "font-display mt-4 text-4xl leading-[1.05] text-cloud md:text-6xl",
};

const ledeClass = {
  light: "mt-6 max-w-xl text-lg leading-8 text-ink-soft",
  dark: "mt-6 max-w-xl text-lg leading-8 text-cloud",
};

/**
 * The copy stack every hero shares: eyebrow, the page's one <h1>, the lede,
 * an optional meta line, and the actions. The heading rises without fading
 * so it paints at once; it is usually the page's LCP element.
 */
export function HeroCopy({
  eyebrow,
  title,
  titleId,
  lede,
  meta,
  actions,
  tone = "light",
  titleClassName,
  ledeClassName,
  actionsClassName = "mt-8 flex flex-wrap gap-3",
}: {
  eyebrow: string;
  title: string;
  titleId?: string;
  lede: string;
  meta?: ReactNode;
  actions?: ReactNode;
  tone?: "light" | "dark";
  titleClassName?: string;
  ledeClassName?: string;
  actionsClassName?: string;
}) {
  return (
    <>
      <p className="eyebrow">
        <SplitWords text={eyebrow} immediate />
      </p>
      <h1 id={titleId} className={titleClassName ?? titleClass[tone]}>
        <SplitWords text={title} immediate keepVisible delay={0.08} />
      </h1>
      <Reveal immediate delay={0.16}>
        <p className={ledeClassName ?? ledeClass[tone]}>{lede}</p>
      </Reveal>
      {meta ? <div className="mt-6 text-sm text-stone">{meta}</div> : null}
      {actions ? (
        <Reveal immediate delay={0.24} className={actionsClassName}>
          {actions}
        </Reveal>
      ) : null}
    </>
  );
}
