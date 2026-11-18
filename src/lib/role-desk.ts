import { people, roles, rolesListedOn, type Person, type Role, type RoleTag } from "@/content/site";
import { isRecentlyPosted, isRoleOpen } from "@/lib/desk-clock";

const scarcityTags = new Set<RoleTag>(["2 Left", "6 Seats", "12 Seats"]);

const DAY = 86_400_000;

export function roleRef(slug: string): string {
  const index = roles.findIndex((role) => role.slug === slug);
  const place = index < 0 ? 0 : index;
  return `BW-${1000 + (place + 1) * 7}`;
}

export function postedLabel(iso: string = rolesListedOn): string {
  const time = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(time)) return iso;
  return new Date(time).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Days since the shared list date. Under 30 days stays relative; after that, "18 Oct". */
export function listedAge(iso: string = rolesListedOn, now = Date.now()): string {
  const start = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(start)) return iso;
  const today = new Date(now);
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const days = Math.max(0, Math.round((todayUtc - start) / DAY));
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  return new Date(start).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function consultantFor(name: string): Person | undefined {
  return people.find((person) => person.name === name);
}

export function relatedRoles(role: Role, limit = 3): Role[] {
  const rest = roles.filter((item) => item.slug !== role.slug && isRoleOpen(item));
  return [
    ...rest.filter((item) => item.region === role.region),
    ...rest.filter((item) => item.region !== role.region),
  ].slice(0, limit);
}

export function placeLine(role: Role): string {
  return `${role.city} · ${role.workMode}`;
}

export function isNewTag(tag: string | undefined): boolean {
  return !!tag && /new/i.test(tag);
}

export function visibleTags(role: Role): RoleTag[] {
  return (role.tags ?? []).filter((tag) => {
    if (scarcityTags.has(tag)) return false;
    if (tag === "New") return isRecentlyPosted(role.postedOn);
    return true;
  });
}

export function firstTag(role: Role): RoleTag | undefined {
  return visibleTags(role)[0];
}

export type RoleQuery = {
  q: string;
  region: string;
  engagement: string;
  city: string;
};

export function filterRoles(list: readonly Role[], query: RoleQuery): Role[] {
  const words = query.q.trim().toLowerCase();
  return list.filter((role) => {
    if (query.region && role.region !== query.region) return false;
    if (query.engagement && role.engagement !== query.engagement) return false;
    if (query.city && role.city !== query.city) return false;
    if (!isRoleOpen(role)) return false;
    if (!words) return true;
    const haystack = [
      role.title,
      role.city,
      role.country,
      role.engagement,
      role.workMode,
      role.discipline,
      role.summary,
      ...role.duties,
      ...role.requirements,
    ]
      .join(" ")
      .toLowerCase();
    return words.split(/\s+/).filter(Boolean).every((token) => haystack.includes(token));
  });
}

export function uniqueInOrder(values: readonly string[]): string[] {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}
