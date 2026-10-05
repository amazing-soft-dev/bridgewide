import Link from "next/link";
import { markPath, markViewBox } from "@/components/brand/mark";

export function BridgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={markViewBox}
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d={markPath} />
    </svg>
  );
}

type LogoVariant = "full" | "mark" | "wordmark";

type LogoProps = {
  className?: string;
  variant?: LogoVariant;
};

export function Logo({ className, variant = "full" }: LogoProps) {
  const showMark = variant !== "wordmark";
  const showWord = variant !== "mark";

  return (
    <Link
      href="/"
      aria-label="BridgeWide"
      className={[
        "inline-flex items-center gap-[0.4em] text-[1.15rem] leading-none font-sans font-extrabold tracking-[-0.045em] whitespace-nowrap no-underline sm:text-[1.3rem]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showMark ? (
        <BridgeMark
          className={
            variant === "mark"
              ? "h-[1em] w-auto shrink-0"
              : "h-[0.86em] w-auto shrink-0"
          }
        />
      ) : null}
      {showWord ? <span>BridgeWide</span> : null}
    </Link>
  );
}
