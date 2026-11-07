import { Reveal } from "@/components/ui/Reveal";

/** "brand" is for a chip that sits on the brand-red band, where the red edge and square would vanish. */
export type ChipTone = "light" | "dark" | "brand";

const toneClass: Record<ChipTone, string> = {
  dark: "border-cloud/25 border-l-brand text-cloud",
  light: "border-ink/25 border-l-brand text-ink",
  brand: "border-white/35 border-l-white text-white",
};

const squareClass: Record<ChipTone, string> = {
  dark: "bg-brand",
  light: "bg-brand",
  brand: "bg-white",
};

/** The bordered chip itself: thick accent edge, small accent square, mono label. No motion. */
export function ChipLabel({ children, tone = "light" }: { children: string; tone?: ChipTone }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-[4px] border border-l-[3px] py-[7px] pr-3 pl-2.5 font-mono text-xs tracking-[0.14em] uppercase ${toneClass[tone]}`}
    >
      <span className={`inline-block size-[5px] rounded-[1px] ${squareClass[tone]}`} aria-hidden />
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
