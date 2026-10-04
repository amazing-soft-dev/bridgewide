"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type NavItem = {
  label: string;
  href: string;
};

export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="ml-auto inline-flex items-center px-3 py-2 text-sm font-medium text-ink focus-visible:outline-ink xl:hidden"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <div
          id={menuId}
          className="absolute inset-x-0 top-full border-b border-cloud-soft bg-cloud text-ink xl:hidden"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-4">
            <nav aria-label="Primary">
              <ul className="grid gap-1">
                {items.map((item) => {
                  const current =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block py-2 text-ink no-underline"
                        aria-current={current ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="grid gap-2">
              <Button
                href="/engineers"
                variant="secondary"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Find a role
              </Button>
              <Button
                href="/employers"
                variant="primary"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Hire engineers
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
