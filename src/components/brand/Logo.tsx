import Link from "next/link";
import { markPaths, markViewBox } from "@/components/brand/mark";

export function BridgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={markViewBox}
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      {markPaths.map((d) => (
        <path key={d.slice(0, 32)} d={d} />
      ))}
    </svg>
  );
}

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={[
        "inline-flex items-center gap-[0.4em] text-[1.12rem] leading-none font-sans font-extrabold tracking-[-0.045em] whitespace-nowrap text-brand no-underline sm:text-[1.28rem]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <BridgeMark className="h-[0.88em] w-auto shrink-0" />
      <span>BridgeWide</span>
    </Link>
  );
}
