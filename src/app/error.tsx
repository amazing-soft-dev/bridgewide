"use client";

import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { Button } from "@/components/ui/Button";
import { contact } from "@/content/site";

/** Shown when a page throws while it renders. The layout, header and footer stay. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // The digest lets someone match this to the server log line for the same crash.
    console.error("page-error", error.digest ?? error.message);
    Sentry.captureException(error);
  }, [error]);

  return (
    <>
      <PageHero
        eyebrow="Something broke"
        title="That was our mistake."
        lede="The page hit a problem and could not load. Try again, and if it keeps happening, write to the desk."
      />
      <PageSection id="retry" label="Next" title="Try again, or write to us">
        <div className="flex flex-wrap items-center gap-6">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Link href="/" className={textLink}>
            Back to the home page
          </Link>
        </div>
        <p className="mt-8 max-w-xl text-stone">
          The desk answers at{" "}
          <a href={`mailto:${contact.email}`} className={textLink}>
            {contact.email}
          </a>
          .{error.digest ? ` Quote ${error.digest} so we can find what went wrong.` : ""}
        </p>
      </PageSection>
    </>
  );
}
