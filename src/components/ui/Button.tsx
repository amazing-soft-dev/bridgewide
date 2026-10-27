"use client";

import Link from "next/link";
import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode, type RefObject } from "react";

type Variant = "primary" | "secondary" | "onDark";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3.5 overflow-hidden isolate rounded-lg border-[1.5px] border-transparent font-semibold leading-none tracking-[0.01em] whitespace-nowrap no-underline cursor-pointer [clip-path:polygon(0_0,calc(100%_-_13px)_0,100%_13px,100%_100%,0_100%)] translate-x-[var(--mx,0px)] translate-y-[var(--my,0px)] [transition:translate_0.3s_cubic-bezier(0.2,0.8,0.2,1),scale_0.3s_cubic-bezier(0.2,0.8,0.2,1),color_0.35s_0.05s,border-color_0.35s] hover:translate-y-[calc(var(--my,0px)_-_2px)] focus-visible:translate-y-[calc(var(--my,0px)_-_2px)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:[transition:none] before:absolute before:-inset-[2px] before:-z-1 before:origin-left before:bg-ink before:content-[''] before:[scale:0_1] before:[transition:scale_0.6s_cubic-bezier(0.7,0,0.2,1)] hover:before:[scale:1_1] focus-visible:before:[scale:1_1] motion-reduce:before:[transition:none]";

/** Size and padding. `arrow: false` drops the arrow chip, so the label gets even padding. */
function sizeClass(arrow: boolean, compact: boolean) {
  if (compact) return "min-h-11 px-[18px] text-[12.5px]";
  return arrow ? "min-h-12 pl-[22px] pr-2 text-[13px]" : "min-h-12 px-[22px] text-[13px]";
}

const variantClass: Record<Variant, string> = {
  primary: "bg-brand text-white",
  secondary:
    "border-[color-mix(in_srgb,#111_26%,transparent)] bg-[color-mix(in_srgb,#fff_60%,transparent)] text-ink hover:border-ink hover:text-white focus-visible:border-ink focus-visible:text-white",
  onDark:
    "border-[color-mix(in_srgb,#fff_36%,transparent)] bg-[color-mix(in_srgb,#fff_8%,transparent)] text-white backdrop-blur-[10px] hover:border-ink hover:text-white focus-visible:border-ink focus-visible:text-white",
};

const arrowClass: Record<Variant, string> = {
  primary:
    "bg-white text-brand group-hover/btn:text-ink group-focus-visible/btn:text-ink",
  secondary:
    "bg-ink text-white group-hover/btn:bg-brand group-hover/btn:text-white group-focus-visible/btn:bg-brand group-focus-visible/btn:text-white",
  onDark:
    "bg-brand text-white group-hover/btn:bg-white group-hover/btn:text-ink group-focus-visible/btn:bg-white group-focus-visible/btn:text-ink",
};

const labelLine =
  "block [transition:translate_0.55s_cubic-bezier(0.7,0,0.2,1)] group-hover/btn:[translate:0_-100%] group-focus-visible/btn:[translate:0_-100%] motion-reduce:[transition:none]";

type CommonProps = {
  variant?: Variant;
  /** Show the arrow chip (default). Set false for the plain header button. */
  arrow?: boolean;
  /** 44px tall, 12.5px label. Used by the header call to action. */
  compact?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    href: ComponentPropsWithoutRef<typeof Link>["href"];
  };

type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: never;
  };

const MAGNET = 14;
const REACH = 64;

function Arrow({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden
      className={`grid h-[38px] w-[38px] flex-none place-items-center rounded-[5px] [rotate:-45deg] [transition:rotate_0.55s_cubic-bezier(0.2,0.9,0.2,1),background_0.35s,color_0.35s] group-hover/btn:[rotate:0deg] group-focus-visible/btn:[rotate:0deg] motion-reduce:[rotate:0deg] motion-reduce:[transition:none] ${arrowClass[variant]}`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12h14M13 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden leading-[1.15]">
      <span className={`${labelLine} relative`}>{children}</span>
      <span className={`${labelLine} absolute top-full left-0`} aria-hidden>
        {children}
      </span>
    </span>
  );
}

function useMagnet(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const near =
        Math.abs(dx) < rect.width / 2 + REACH && Math.abs(dy) < rect.height / 2 + REACH;
      el.style.setProperty("--mx", near ? `${((dx / rect.width) * MAGNET).toFixed(2)}px` : "0px");
      el.style.setProperty("--my", near ? `${((dy / rect.height) * MAGNET).toFixed(2)}px` : "0px");
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [ref]);
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  useMagnet(ref);
  const variant = props.variant ?? "primary";
  const arrow = props.arrow ?? true;
  const compact = props.compact ?? false;
  const className = [base, sizeClass(arrow, compact), variantClass[variant], props.className]
    .filter(Boolean)
    .join(" ");
  const body = (
    <>
      <Label>{props.children}</Label>
      {arrow ? <Arrow variant={variant} /> : null}
    </>
  );

  if ("href" in props && props.href != null) {
    const {
      variant: _variant,
      arrow: _arrow,
      compact: _compact,
      className: _className,
      children: _children,
      ...linkProps
    } = props;
    return (
      <Link
        ref={ref as RefObject<HTMLAnchorElement>}
        className={className}
        {...linkProps}
      >
        {body}
      </Link>
    );
  }

  const {
    variant: _variant,
    arrow: _arrow,
    compact: _compact,
    className: _className,
    children: _children,
    type = "button",
    ...buttonProps
  } = props;

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      className={className}
      type={type}
      {...buttonProps}
    >
      {body}
    </button>
  );
}
