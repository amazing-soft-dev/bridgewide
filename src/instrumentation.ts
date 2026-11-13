import * as Sentry from "@sentry/nextjs";
import { envProblems } from "@/lib/env-check";
import { sentryOptions } from "@/lib/sentry-options";

/**
 * Runs once when the server starts. Say plainly, in the log, what is missing,
 * and start error reporting if SENTRY_DSN is set.
 */
export function register() {
  for (const problem of envProblems(process.env)) {
    const line = JSON.stringify({ event: "env-check", level: problem.level, message: problem.message });
    if (problem.level === "error") console.error(line);
    else console.warn(line);
  }

  const dsn = process.env.SENTRY_DSN?.trim();
  if (dsn) Sentry.init(sentryOptions(dsn));
}

/** Server errors in routes, pages, and route handlers. A no-op until Sentry is started. */
export const onRequestError = Sentry.captureRequestError;
