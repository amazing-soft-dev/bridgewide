"use client";

import Link from "next/link";
import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode, type RefObject } from "react";

type Variant = "primary" | "secondary" | "onDark";

const variantClass: Record<Variant, string> = {
  primary: "bw-btn-primary",
  secondary: "bw-btn-secondary",
  onDark: "bw-btn-onDark",
};

type CommonProps = {
  variant?: Variant;
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

function Arrow() {
  return (
    <span className="bw-arr" aria-hidden>
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
    <span className="bw-lbl">
      <span className="bw-l1">{children}</span>
      <span className="bw-l2" aria-hidden>
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
  const className = ["bw-btn", variantClass[variant], props.className].filter(Boolean).join(" ");
  const body = (
    <>
      <Label>{props.children}</Label>
      <Arrow />
    </>
  );

  if ("href" in props && props.href != null) {
    const { variant: _variant, className: _className, children: _children, ...linkProps } = props;
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
