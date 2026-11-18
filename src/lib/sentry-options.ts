import { scrubEvent } from "@/lib/sentry-scrub";

/**
 * How the site reports errors. No tracing, no default personal data, and the
 * scrubber runs on every event. Server and browser share this.
 */
export function sentryOptions(dsn: string) {
  return {
    dsn,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "production",
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  };
}
