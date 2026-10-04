import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary";

const variantClass: Record<Variant, string> = {
  primary: "bg-brand text-ink hover:bg-brand-deep focus-visible:outline-brand",
  secondary:
    "border border-ink bg-transparent text-ink hover:bg-cloud-soft focus-visible:outline-ink",
};

const baseClass =
  "inline-flex cursor-pointer items-center justify-center px-4 py-2.5 text-sm font-medium tracking-tight no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-60";

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

function classes(variant: Variant | undefined, className: string | undefined) {
  return [baseClass, variantClass[variant ?? "primary"], className]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const className = classes(props.variant, props.className);

  if ("href" in props && props.href != null) {
    const { variant: _variant, className: _className, ...linkProps } = props;
    return <Link className={className} {...linkProps} />;
  }

  const {
    variant: _variant,
    className: _className,
    type = "button",
    ...buttonProps
  } = props;

  return <button className={className} type={type} {...buttonProps} />;
}
