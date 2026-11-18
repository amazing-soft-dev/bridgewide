import {
  contactTopics,
  regions,
  type ContactTopic,
  type Engagement,
  type RegionSlug,
} from "@/content/site";

export const limits = {
  name: 120,
  email: 320,
  company: 160,
  roleTitle: 160,
  message: 4000,
  phone: 40,
} as const;

export const engagementOptions = ["Permanent", "Contract"] as const satisfies readonly Engagement[];

/** What a CV is for. The footer's "Send a CV" serves both services, so the form asks. */
export const cvTracks = [
  { value: "staffing", label: "Staffing roles" },
  { value: "ai-training", label: "AI training" },
] as const;

export type CvTrack = (typeof cvTracks)[number]["value"];

const tracks = new Set<string>(cvTracks.map((track) => track.value));

export function cvTrackLabel(track: CvTrack): string {
  return cvTracks.find((item) => item.value === track)?.label ?? track;
}

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

/** Empty is valid and becomes "". A filled value uses the same limits as textField. */
export function optionalText(value: unknown, max: number, label: string): FieldResult {
  if (typeof value !== "string" || value.trim().length === 0) return { ok: true, value: "" };
  return textField(value, max, label);
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

const topics = new Set<string>(contactTopics);

/** The contact topic. Empty falls back to the first topic, so older clients still submit. */
export function topicField(value: unknown): FieldResult<ContactTopic> {
  if (value == null || value === "") return { ok: true, value: contactTopics[0] };
  if (typeof value !== "string" || !topics.has(value)) {
    return { ok: false, error: "Choose a topic from the list." };
  }
  return { ok: true, value: value as ContactTopic };
}

/** The CV's track. Empty means staffing, so a role application needs no field of its own. */
export function cvTrackField(value: unknown): FieldResult<CvTrack> {
  if (value == null || value === "") return { ok: true, value: "staffing" };
  if (typeof value !== "string" || !tracks.has(value)) {
    return { ok: false, error: "Choose what the CV is for." };
  }
  return { ok: true, value: value as CvTrack };
}

export function emailField(value: unknown): FieldResult {
  const text = textField(value, limits.email, "Email");
  if (!text.ok) return text;
  if (!isEmail(text.value)) {
    return { ok: false, error: "Email must be a valid address." };
  }
  return text;
}

export const rightToWorkChoices = ["Yes, I can work there", "Needs sponsorship"] as const;

export function rightToWorkField(value: unknown): FieldResult<(typeof rightToWorkChoices)[number]> {
  const text = textField(value, 40, "Right to work");
  if (!text.ok) return text;
  if (text.value !== "Yes, I can work there" && text.value !== "Needs sponsorship") {
    return { ok: false, error: "Say whether you can work in this region." };
  }
  return { ok: true, value: text.value };
}

export function regionListField(value: unknown): FieldResult<string> {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  const slugs = raw.map((item) => String(item).trim()).filter(Boolean);
  if (slugs.length === 0) return { ok: false, error: "Choose at least one region." };
  if (!slugs.every((slug) => isRegionSlug(slug))) {
    return { ok: false, error: "Choose a region from the list." };
  }
  return { ok: true, value: slugs.join(", ") };
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
