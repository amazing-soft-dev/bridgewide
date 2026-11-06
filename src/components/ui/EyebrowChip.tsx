import { Reveal } from "@/components/ui/Reveal";

/**
 * The bordered eyebrow with a thick brand edge and a small brand square,
 * used above section headings on the contact page.
 */
export function EyebrowChip({
  children,
  tone = "light",
  immediate = false,
}: {
  children: string;
  tone?: "light" | "dark";
  immediate?: boolean;
}) {
  const colour =
    tone === "dark" ? "border-cloud/25 text-cloud" : "border-ink/25 text-ink";

  return (
    <Reveal immediate={immediate} className="w-max max-w-full">
      <p
        className={`m-0 inline-flex items-center gap-2.5 rounded-[4px] border border-l-[3px] border-l-brand py-[7px] pr-3 pl-2.5 font-mono text-xs tracking-[0.14em] uppercase ${colour}`}
      >
        <span className="inline-block size-[5px] rounded-[1px] bg-brand" aria-hidden />
        {children}
      </p>
    </Reveal>
  );
}
