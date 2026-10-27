"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useHeaderUi } from "@/components/site/HeaderShell";

/** The few role fields the header needs, so the full role copy stays out of this bundle. */
export type SearchRole = {
  slug: string;
  title: string;
  city: string;
  country: string;
  countryCode: string;
  discipline: string;
  engagement: string;
  workMode: string;
};

const SEARCH_BUTTON_ID = "header-search-button";
const SEARCH_PANEL_ID = "header-search";
const MAX_HITS = 5;

export function useRoleSearch(roles: readonly SearchRole[], query: string) {
  return useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return roles.filter((role) => {
      const haystack =
        `${role.title} ${role.city} ${role.country} ${role.countryCode} ${role.discipline} ${role.engagement} ${role.workMode}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [roles, query]);
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SearchResults({
  roles,
  hits,
  query,
  onNavigate,
}: {
  roles: readonly SearchRole[];
  hits: readonly SearchRole[];
  query: string;
  onNavigate: () => void;
}) {
  if (query.trim() === "") return null;
  return (
    <>
      {hits.length === 0 ? (
        <p className="sthd-none">No roles match “{query.trim()}”.</p>
      ) : (
        hits.slice(0, MAX_HITS).map((role) => (
          <Link
            key={role.slug}
            href={`/roles/${role.slug}`}
            className="sthd-hit"
            onClick={onNavigate}
          >
            <span className="sthd-code" aria-hidden>
              {role.countryCode}
            </span>
            <span>
              <b>{role.title}</b>
              <em>
                {role.city} · {role.engagement}
              </em>
            </span>
            <em>{role.workMode}</em>
          </Link>
        ))
      )}
      <Link href="/roles" className="sthd-all" onClick={onNavigate}>
        See all roles ({roles.length}) →
      </Link>
    </>
  );
}

export function SearchButton() {
  const { searchOpen, setSearchOpen } = useHeaderUi();
  return (
    <button
      id={SEARCH_BUTTON_ID}
      type="button"
      className="sthd-sbtn"
      aria-label="Search roles"
      aria-expanded={searchOpen}
      aria-controls={SEARCH_PANEL_ID}
      onClick={() => setSearchOpen(!searchOpen)}
    >
      <SearchIcon />
    </button>
  );
}

export function SearchDrawer({ roles }: { roles: readonly SearchRole[] }) {
  const { searchOpen, setSearchOpen } = useHeaderUi();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const hits = useRoleSearch(roles, query);

  useEffect(() => {
    if (!searchOpen) return;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSearchOpen(false);
      document.getElementById(SEARCH_BUTTON_ID)?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".sthd")) return;
      setSearchOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [searchOpen, setSearchOpen]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSearchOpen(false);
    router.push(hits[0] ? `/roles/${hits[0].slug}` : "/roles");
  }

  return (
    <div
      id={SEARCH_PANEL_ID}
      className={`sthd-search${searchOpen ? " is-on" : ""}`}
      role="search"
      inert={!searchOpen}
    >
      <form className="sthd-in sthd-form" onSubmit={onSubmit}>
        <label htmlFor="header-search-input" className="sr-only">
          Search roles
        </label>
        <SearchIcon />
        <input
          ref={inputRef}
          id="header-search-input"
          type="search"
          autoComplete="off"
          placeholder="Search roles — backend, frontend, Austin…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <kbd aria-hidden>Esc</kbd>
      </form>
      <div className="sthd-in">
        <div className="sthd-res" aria-live="polite">
          <SearchResults
            roles={roles}
            hits={hits}
            query={query}
            onNavigate={() => setSearchOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
