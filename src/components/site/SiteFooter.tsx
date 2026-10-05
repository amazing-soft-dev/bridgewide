import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { contact, nav, sampleFiguresNote } from "@/content/site";

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const linkClass = "text-sm text-cloud no-underline hover:text-brand";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cloud">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="grid content-start gap-4">
          <Logo variant="full" className="text-cloud" />
          <p className="text-sm text-cloud-soft">{contact.location}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="grid content-start gap-2">
          <li>
            <a href={`mailto:${contact.email}`} className={linkClass}>
              {contact.email}
            </a>
          </li>
          <li>
            <a href={telHref(contact.phone)} className={linkClass}>
              {contact.phone}
            </a>
          </li>
          <li>
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/terms" className={linkClass}>
              Terms
            </Link>
          </li>
        </ul>
      </div>
      <div className="border-t border-ink-soft">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-sm leading-6 text-cloud">
          <span className="font-mono tracking-wide text-brand uppercase">
            {sampleFiguresNote}.
          </span>{" "}
          Placement counts, salary bands, retention stats, and team names on
          this site are illustrative.
        </p>
      </div>
    </footer>
  );
}
