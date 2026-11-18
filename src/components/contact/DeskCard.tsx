"use client";

import { useSyncExternalStore } from "react";
import { contact, type ContactHours } from "@/content/site";

const weekdays: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Whether the desk is open right now, read in its own time zone. */
export function deskIsOpen(hours: ContactHours, now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: hours.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const day = weekdays[read("weekday")];
  const time = `${read("hour")}:${read("minute")}`;
  if (day === undefined || !hours.days.includes(day)) return false;
  return time >= hours.opens && time < hours.closes;
}

/** Re-checks once a minute. The server and first client render say "Closed now". */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

function useDeskOpen() {
  return useSyncExternalStore(
    subscribe,
    () => deskIsOpen(contact.hours),
    () => false,
  );
}

const link =
  "text-inherit no-underline transition-colors duration-300 hover:text-brand focus-visible:text-brand";

/** The white card with the desk's phone, email, address, and hours. */
export function DeskCard() {
  const open = useDeskOpen();

  return (
    <address className="corner-cut mt-2 grid max-w-[380px] justify-items-start gap-1.5 rounded-lg border border-cloud-soft bg-white px-5 py-[18px] text-ink not-italic">
      <span className="flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] text-brand uppercase">
        The desk
        <em
          className={`rounded-[3px] px-2 py-[3px] not-italic ${
            open ? "bg-brand text-white" : "bg-cloud-soft text-ink"
          }`}
        >
          {open ? "Open now" : "Closed now"}
        </em>
      </span>
      <a
        href={`tel:${contact.phoneHref}`}
        className={`font-display text-[22px] leading-tight tracking-tight ${link}`}
      >
        {contact.phone}
      </a>
      <a href={`mailto:${contact.email}`} className={`text-[13px] leading-5 ${link}`}>
        {contact.email}
      </a>
      <span className="text-[13px] leading-5 text-ink-soft">{contact.location}</span>
      <span className="font-mono text-[11px] tracking-[0.12em] text-stone uppercase">
        {contact.hours.label}
      </span>
    </address>
  );
}
