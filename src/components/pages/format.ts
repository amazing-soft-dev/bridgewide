import { regions, roles, type Region, type RegionSlug, type Role } from "@/content/site";

export function regionFor(slug: RegionSlug): Region {
  const region = regions.find((item) => item.slug === slug);
  if (!region) {
    throw new Error(`Missing region: ${slug}`);
  }
  return region;
}

export function rolesIn(slug: RegionSlug): readonly Role[] {
  return roles.filter((role) => role.region === slug);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export const pageWrap = "mx-auto w-full max-w-6xl px-4";

export const textLink =
  "text-ink underline decoration-brand underline-offset-4 hover:text-ink-soft";

export const lightTextLink =
  "text-cloud underline decoration-brand underline-offset-4 hover:text-brand";
