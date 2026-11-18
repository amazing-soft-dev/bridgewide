"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/brand/Logo";
import {
  SearchResults,
  useRoleSearch,
  type SearchRole,
} from "@/components/site/HeaderSearch";
import { useHeaderUi } from "@/components/site/HeaderShell";
import { Button } from "@/components/ui/Button";

type NavItem = {
  label: string;
  href: string;
};

type Props = {
  items: readonly NavItem[];
  roles: readonly SearchRole[];
  email: string;
  location: string;
};

export function MobileNav({ items, roles, email, location }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { setSearchOpen } = useHeaderUi();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hits = useRoleSearch(roles, query);

  // Close the menu after navigation. Adjusting state during render (instead of
  // in an effect) avoids an extra render pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    // The sheet is for narrow screens; close it if the viewport grows to the desktop header.
    const wide = window.matchMedia("(min-width: 1280px)");
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setOpen(false);
    router.push(hits[0] ? `/roles/${hits[0].slug}` : "/roles");
  }

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className="sthd-burger"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setSearchOpen(false);
          setOpen(true);
        }}
      >
        <span />
        <span />
      </button>
      {open
        ? createPortal(
            <div id={menuId} className="sthd-sheet" role="dialog" aria-modal="true" aria-label="Menu">
              <div className="sthd-shead">
                <Logo variant="full" className="text-brand" />
                <button
                  ref={closeRef}
                  type="button"
                  className="sthd-x"
                  aria-label="Close menu"
                  onClick={close}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M3 3l10 10M13 3L3 13"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <form className="sthd-sform" role="search" onSubmit={onSubmit}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <label htmlFor={`${menuId}-q`} className="sr-only">
                  Search roles
                </label>
                <input
                  id={`${menuId}-q`}
                  type="search"
                  autoComplete="off"
                  placeholder="Search roles — backend, Austin…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </form>
              {query.trim() !== "" ? (
                <div className="sthd-sres" aria-live="polite">
                  <SearchResults roles={roles} hits={hits} query={query} onNavigate={close} />
                </div>
              ) : (
                <nav aria-label="Primary" className="sthd-slinks">
                  {items.map((item, index) => {
                    const current =
                      pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        style={{ animationDelay: `${0.12 + index * 0.06}s` }}
                        onClick={close}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {item.label}
                        {item.href === "/roles" ? <em>{roles.length} open roles</em> : null}
                      </Link>
                    );
                  })}
                </nav>
              )}
              <div className="sthd-sbtns">
                <Button href="/employers" variant="primary" onClick={close}>
                  Hire engineers
                </Button>
                <Button href="/engineers" variant="onDark" className="sthd-ghost" onClick={close}>
                  Find a role
                </Button>
              </div>
              <div className="sthd-scontact">
                <a href={`mailto:${email}`}>{email}</a>
                <span>{location}</span>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
