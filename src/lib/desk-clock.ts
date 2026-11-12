/** Desk clock. Close and digest decisions use Pacific time, not the visitor's zone. */

export const DESK_TIME_ZONE = "America/Los_Angeles";

export type Closeable = { closesOn?: string };

/**
 * Override the clock in tests and the Playwright server with ROLE_CLOCK.
 * An invalid value is ignored so a bad env does not close every role.
 */
export function deskNow(fallback = new Date()): Date {
  const override = process.env.ROLE_CLOCK;
  if (!override) return fallback;
  const parsed = Date.parse(override);
  if (Number.isNaN(parsed)) return fallback;
  return new Date(parsed);
}

/** 18:00 America/Los_Angeles on the given calendar date, as an absolute instant. */
export function pacificClose(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: DESK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  let utc = Date.UTC(year, month - 1, day, 18, 0, 0);
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const parts = formatter.formatToParts(new Date(utc));
    const read = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value);
    const diffHours = (day - read("day")) * 24 + (18 - read("hour")) - read("minute") / 60;
    if (diffHours === 0) return new Date(utc);
    utc += diffHours * 3_600_000;
  }
  return new Date(utc);
}

/** Open when there is no close date, or until 18:00 Pacific on that date. */
export function isRoleOpen(role: Closeable, now = deskNow()): boolean {
  if (!role.closesOn) return true;
  const close = pacificClose(role.closesOn);
  if (!close) return true;
  return now.getTime() < close.getTime();
}

/** YYYY-MM-DD in Pacific time. */
export function pacificDate(now = deskNow()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DESK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isWeekdayPacific(now = deskNow()): boolean {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: DESK_TIME_ZONE,
    weekday: "short",
  }).format(now);
  return weekday !== "Sat" && weekday !== "Sun";
}

/** A role is "New" for 14 days after its own posted date. */
export function isRecentlyPosted(postedOn: string, now = deskNow()): boolean {
  const start = Date.parse(`${postedOn}T00:00:00Z`);
  if (!Number.isFinite(start)) return false;
  const age = now.getTime() - start;
  return age >= 0 && age < 14 * 86_400_000;
}
