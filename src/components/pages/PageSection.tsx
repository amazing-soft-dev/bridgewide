import Image from "next/image";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PageSection({
  id,
  label,
  title,
  lede,
  children,
  tone = "cloud",
  backgroundImage,
}: {
  id?: string;
  label: string;
  title?: string;
  lede?: ReactNode;
  children: ReactNode;
  tone?: "cloud" | "ink";
  /** Full-bleed photo behind the section. Referenced only by the caller that passes it. */
  backgroundImage?: string;
}) {
  const dark = tone === "ink";
  const headingId = title && id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-label={title ? undefined : label}
      className={`relative scroll-mt-24 overflow-hidden ${
        dark
          ? "bg-ink text-cloud"
          : "border-t border-cloud-soft bg-cloud text-ink"
      }`}
    >
      {backgroundImage ? (
        <>
          <Image src={backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(17_17_17/0.9)_0%,rgb(17_17_17/0.82)_48%,rgb(17_17_17/0.92)_100%)]"
            aria-hidden
          />
        </>
      ) : null}
      <div className="wrap relative py-16 md:py-24">
        <SectionHeading id={headingId} eyebrow={label} title={title} lede={lede} tone={dark ? "dark" : "light"} />
        <div className={title || lede ? "mt-10" : "mt-8"}>{children}</div>
      </div>
    </section>
  );
}
