"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { deskIsOpen } from "@/components/contact/DeskCard";
import { contact } from "@/content/site";

const link = "text-sm text-cloud no-underline transition-colors duration-300 hover:text-brand";

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: contact.hours.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Re-reads once a minute. The server and first client render show no time, so the markup matches. */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

type DeskClock = { time: string; open: boolean };

/** The same object is returned while the minute lasts, as useSyncExternalStore requires. */
let cached: DeskClock | null = null;

function readClock(): DeskClock {
  const now = new Date();
  const time = clock.format(now);
  if (!cached || cached.time !== time) cached = { time, open: deskIsOpen(contact.hours, now) };
  return cached;
}

function useDeskClock() {
  return useSyncExternalStore(subscribe, readClock, () => null);
}

/**
 * The desk column in the footer: email, phone with a WhatsApp link to the
 * same number, the city with the desk's live local time, and the hours.
 */
export function FooterDesk() {
  const state = useDeskClock();

  return (
    <div>
      <h2 className="font-mono text-[11px] tracking-[0.16em] text-cloud-soft uppercase">The desk</h2>
      <ul className="mt-4 grid gap-2">
        <li>
          <a href={`mailto:${contact.email}`} className={`${link} text-[13px] break-all`}>
            {contact.email}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <a href={`tel:${contact.phoneHref}`} className={`${link} inline-flex items-center gap-2 whitespace-nowrap`}>
            <PhoneIcon />
            {contact.phone}
          </a>
          <a
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${contact.phone}`}
            title="WhatsApp"
            className={link}
          >
            <WhatsAppIcon />
          </a>
        </li>
        <li>
          <Link href="/engineers" className={link}>
            Send a CV
          </Link>
        </li>
        <li className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-[0.06em] text-cloud-soft uppercase">
          <span>{contact.address.split(",")[0]}</span>
          {state ? (
            <>
              <span aria-hidden>·</span>
              <time dateTime={state.time}>{state.time}</time>
              <span
                className={`rounded-[2px] px-1.5 py-0.5 ${state.open ? "bg-brand text-white" : "bg-white/10 text-cloud"}`}
              >
                {state.open ? "Open" : "Closed"}
              </span>
            </>
          ) : null}
        </li>
        <li className="font-mono text-[11px] tracking-[0.06em] text-cloud-soft/80 uppercase">{contact.hours.label}</li>
      </ul>
    </div>
  );
}
