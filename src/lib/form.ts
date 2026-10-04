import { regions, type Engagement, type RegionSlug } from "@/content/site";

export const limits = {
  name: 120,
  email: 320,
  company: 160,
  roleTitle: 160,
  message: 4000,
} as const;

export const engagementOptions = ["Permanent", "Contract"] as const satisfies readonly Engagement[];

const regionSlugs = new Set<string>(regions.map((region) => region.slug));
const engagements = new Set<string>(engagementOptions);

export type FieldOk<T extends string = string> = { ok: true; value: T };
export type FieldFail = { ok: false; error: string };
export type FieldResult<T extends string = string> = FieldOk<T> | FieldFail;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isRegionSlug(value: string): value is RegionSlug {
  return regionSlugs.has(value);
}

export function isEngagement(value: string): value is Engagement {
  return engagements.has(value);
}

export function regionName(slug: RegionSlug): string {
  return regions.find((region) => region.slug === slug)?.name ?? slug;
}

export function honeypotTripped(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

export function textField(
  value: unknown,
  max: number,
  label: string,
): FieldResult {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { ok: false, error: `${label} is required.` };
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    return { ok: false, error: `${label} is too long.` };
  }
  return { ok: true, value: trimmed };
}

export function emailField(value: unknown): FieldResult {
  const text = textField(value, limits.email, "Email");
  if (!text.ok) return text;
  if (!isEmail(text.value)) {
    return { ok: false, error: "Email must be a valid address." };
  }
  return text;
}

export function regionField(value: unknown): FieldResult<RegionSlug> {
  if (typeof value !== "string" || !isRegionSlug(value.trim())) {
    return { ok: false, error: "Choose a region." };
  }
  return { ok: true, value: value.trim() as RegionSlug };
}

export function engagementField(value: unknown): FieldResult<Engagement> {
  if (typeof value !== "string" || !isEngagement(value.trim())) {
    return { ok: false, error: "Choose an engagement." };
  }
  return { ok: true, value: value.trim() as Engagement };
}

export function allOk<T extends Record<string, FieldResult>>(
  fields: T,
): fields is { [K in keyof T]: Extract<T[K], FieldOk> } {
  return Object.values(fields).every((field) => field.ok);
}

export function fieldErrors<T extends Record<string, FieldResult>>(
  fields: T,
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key of Object.keys(fields) as Array<keyof T>) {
    const result = fields[key];
    if (!result.ok) errors[key] = result.error;
  }
  return errors;
}
