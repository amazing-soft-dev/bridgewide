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
} from "react";
import { usePathname } from "next/navigation";

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

/** Tone of the marked section under the bar (sections set data-header-tone="dark"). */
function toneUnderBar(header: HTMLElement): Tone {
  const bar = header.querySelector<HTMLElement>("[data-header-bar]");
  const rect = (bar ?? header).getBoundingClientRect();
  const probe = Math.max(0, rect.top + rect.height / 2);
  let tone: Tone = "light";
  document.querySelectorAll<HTMLElement>("[data-header-tone]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe) {
      tone = el.dataset.headerTone === "dark" ? "dark" : "light";
    }
  });
  return tone;
}

export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [tone, setTone] = useState<Tone>("light");
  const [searchOpen, setSearchOpenState] = useState(false);

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

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    let last = window.scrollY;
    let frame = 0;

    const apply = () => {
      frame = 0;
      const y = window.scrollY;
      setSolid(y > SOLID_AT);
      setTone(toneUnderBar(header));

      const pinned =
        header.contains(document.activeElement) ||
        header.querySelector('[aria-expanded="true"]') !== null;

      if (y < HIDE_AFTER || pinned) {
        setHidden(false);
        last = y;
        return;
      }

      const delta = y - last;
      if (Math.abs(delta) <= DELTA) return;
      setHidden(delta > 0);
      last = y;
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

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
