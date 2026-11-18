"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/**
 * The three.js star field behind the home footer. Loaded only on `/`, and only
 * in the browser: the component is 1,000 lines on its own before three.js, so
 * it stays out of the shared layout bundle every other page downloads.
 */
const AstraField = dynamic(
  () => import("@/components/home/AstraField").then((mod) => mod.AstraField),
  { ssr: false },
);

export function FooterMark() {
  return usePathname() === "/" ? <AstraField /> : null;
}
