import type { Role } from "@/content/site";
import { isRoleOpen, isWeekdayPacific, pacificDate, type Closeable } from "@/lib/desk-clock";

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

export function shouldSendDigest(lastDate: string | undefined, now = new Date()): boolean {
  if (!isWeekdayPacific(now)) return false;
  return lastDate !== pacificDate(now);
}
