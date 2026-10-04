import Link from "next/link";
import { announcement } from "@/content/site";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-cloud">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 font-mono text-xs tracking-wide uppercase">
        <p>{announcement.liveRoleCount}</p>
        <Link
          href={announcement.salaryGuideHref}
          className="text-brand no-underline hover:underline"
        >
          {announcement.salaryGuideLabel}
        </Link>
      </div>
    </div>
  );
}
