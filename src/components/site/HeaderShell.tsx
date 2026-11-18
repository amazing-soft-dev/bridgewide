"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname } from "next/navigation";
import { useScrollFrame } from "@/hooks/scroll-frame";

/** Past this scroll depth the bar turns solid and the announcement strip collapses. */
const SOLID_AT = 48;
/** The header only hides on scroll-down after this depth. */
const HIDE_AFTER = 160;
const DELTA = 6;

type Tone = "light" | "dark";

type HeaderUi = {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

const HeaderUiContext = createContext<HeaderUi>({
  searchOpen: false,
  setSearchOpen: () => {},
});

export function useHeaderUi() {
  return useContext(HeaderUiContext);
}

const TONE_SELECTOR = "[data-header-tone]";

function holdsToneSection(node: Node) {
  return node instanceof HTMLElement && (node.matches(TONE_SELECTOR) || node.querySelector(TONE_SELECTOR) !== null);
}

/**
 * Tone of the marked section under the bar (sections set data-header-tone="dark").
 *
 * An IntersectionObserver watches a one-pixel line at the bar's midpoint, so
 * the answer updates without any work on the scroll frame. Sections that
 * mount later (the home page loads most of them on demand) and route changes
 * rebuild the observer; a resize does too, because the line is set in pixels.
 * Overlapping sections resolve to the last one in document order, matching
 * the seams, which pull each section up over the one before it.
 */
function useHeaderTone(headerRef: RefObject<HTMLElement | null>, pathname: string): Tone {
  const [tone, setTone] = useState<Tone>("light");

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let observer: IntersectionObserver | null = null;
    let sections: HTMLElement[] = [];
    const under = new Set<Element>();
    let pending = 0;

    const compute = () => {
      let next: Tone = "light";
      for (const section of sections) {
        if (under.has(section)) next = section.dataset.headerTone === "dark" ? "dark" : "light";
      }
      setTone(next);
    };

    const build = () => {
      observer?.disconnect();
      under.clear();
      const bar = header.querySelector<HTMLElement>("[data-header-bar]") ?? header;
      const rect = bar.getBoundingClientRect();
      const probe = Math.max(0, Math.round(rect.top + rect.height / 2));
      const below = Math.max(0, window.innerHeight - probe - 1);
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) under.add(entry.target);
            else under.delete(entry.target);
          }
          compute();
        },
        { rootMargin: `-${probe}px 0px -${below}px 0px`, threshold: 0 },
      );
      sections = Array.from(document.querySelectorAll<HTMLElement>(TONE_SELECTOR));
      sections.forEach((section) => observer?.observe(section));
    };

    const schedule = () => {
      if (!pending) {
        pending = requestAnimationFrame(() => {
          pending = 0;
          build();
        });
      }
    };

    build();
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        const nodes = [...record.addedNodes, ...record.removedNodes];
        if (nodes.some(holdsToneSection)) {
          schedule();
          return;
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", schedule);

    return () => {
      observer?.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", schedule);
      if (pending) cancelAnimationFrame(pending);
    };
  }, [headerRef, pathname]);

  return tone;
}

export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const tone = useHeaderTone(ref, pathname);
  const [searchOpen, setSearchOpenState] = useState(false);
  const last = useRef(0);

  const setSearchOpen = useCallback((open: boolean) => {
    setSearchOpenState(open);
    if (open) setHidden(false);
  }, []);

  // Close the search drawer after navigation (adjust state during render, not in an effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setSearchOpenState(false);
  }

  useScrollFrame(() => {
    const header = ref.current;
    if (!header) return;
    const y = window.scrollY;
    const pinned =
      header.contains(document.activeElement) ||
      header.querySelector('[aria-expanded="true"]') !== null;
    const delta = y - last.current;
    const settle = y < HIDE_AFTER || pinned;
    if (settle || Math.abs(delta) > DELTA) last.current = y;

    return () => {
      setSolid(y > SOLID_AT);
      if (settle) setHidden(false);
      else if (Math.abs(delta) > DELTA) setHidden(delta > 0);
    };
  });

  const ui = useMemo(() => ({ searchOpen, setSearchOpen }), [searchOpen, setSearchOpen]);

  const dark = tone === "dark";
  const className = [
    "sthd",
    dark && !solid ? "is-dark" : "",
    solid ? "is-solid" : "",
    solid && dark ? "is-darksolid" : "",
    hidden && !searchOpen ? "is-hide" : "",
    searchOpen ? "is-search" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <HeaderUiContext.Provider value={ui}>
      <header
        ref={ref}
        data-tone={searchOpen ? "light" : tone}
        className={className}
        onFocus={() => setHidden(false)}
      >
        {children}
      </header>
    </HeaderUiContext.Provider>
  );
}
