"use client";

import { usePathname } from "next/navigation";
import { AstraField } from "@/components/home/AstraField";

export function FooterMark() {
  return usePathname() === "/" ? <AstraField /> : null;
}
