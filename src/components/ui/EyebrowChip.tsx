import { Reveal } from "@/components/ui/Reveal";

export type ChipTone = "light" | "dark";

const toneClass: Record<ChipTone, string> = {
  dark: "border-cloud/25 text-cloud",
  light: "border-ink/25 text-ink",
};

/** The bordered chip itself: thick brand edge, small brand square, mono label. No motion. */
export function ChipLabel({ children, tone = "light" }: { children: string; tone?: ChipTone }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-[4px] border border-l-[3px] border-l-brand py-[7px] pr-3 pl-2.5 font-mono text-xs tracking-[0.14em] uppercase ${toneClass[tone]}`}
    >
      <span className="inline-block size-[5px] rounded-[1px] bg-brand" aria-hidden />
      {children}
    </span>
  );
}

/**
 * The bordered eyebrow with a thick brand edge and a small brand square,
 * used above section headings on the contact page and in the photo heroes.
 */
export function EyebrowChip({
  children,
  tone = "light",
  immediate = false,
}: {
  children: string;
  tone?: ChipTone;
  immediate?: boolean;
}) {
  return (
    <Reveal immediate={immediate} className="w-max max-w-full">
      <p className="m-0">
        <ChipLabel tone={tone}>{children}</ChipLabel>
      </p>
    </Reveal>
  );
}
