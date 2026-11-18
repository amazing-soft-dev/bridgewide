import type { Role } from "@/content/site";
import { isRoleOpen, isWeekdayPacific, type Closeable } from "@/lib/desk-clock";

export function digestText(list: readonly (Role & Closeable)[], now = new Date()): string {
  const open = list.filter((role) => isRoleOpen(role, now));
  const closed = list.filter((role) => !isRoleOpen(role, now));
  return [
    `Open: ${open.length}`,
    `Closed: ${closed.length}`,
    "Closed titles:",
    ...(closed.length ? closed.map((role) => `- ${role.title} (${role.region})`) : ["- none"]),
    "Remaining titles:",
    ...(open.length ? open.map((role) => `- ${role.title} (${role.region})`) : ["- none"]),
  ].join("\n");
}

/** The digest goes out on Pacific weekdays. The cron runs once a day, and nothing is stored. */
export function isDigestDay(now = new Date()): boolean {
  return isWeekdayPacific(now);
}
