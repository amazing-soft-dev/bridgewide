"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { contact } from "@/content/site";

/**
 * The last resort: it replaces the root layout, so it cannot use the site's
 * fonts, styles, header or components. It carries its own html and body and a
 * way to reach the desk.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#f7f4ee",
          color: "#111",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <main style={{ maxWidth: 520 }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#555" }}>
            BridgeWide
          </p>
          <h1 style={{ margin: "12px 0", fontSize: 36, lineHeight: 1.1 }}>The site could not load.</h1>
          <p style={{ margin: "0 0 20px", lineHeight: 1.6 }}>
            Something failed before the page could start. Try again, or write to the desk at{" "}
            <a href={`mailto:${contact.email}`} style={{ color: "#111" }}>
              {contact.email}
            </a>
            .{error.digest ? ` Quote ${error.digest} so we can find what went wrong.` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ padding: "12px 20px", fontSize: 16, border: "1.5px solid #111", background: "#111", color: "#fff", cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
