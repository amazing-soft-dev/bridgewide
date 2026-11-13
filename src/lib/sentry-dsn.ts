/**
 * The Sentry project key (DSN), kept in the repo so error reporting needs no
 * Vercel variable. A DSN is a public client key: it is sent to every browser
 * and only lets someone submit events to the project, not read them. Paste it
 * between the quotes. Empty keeps Sentry off.
 *
 * SENTRY_DSN (server) and NEXT_PUBLIC_SENTRY_DSN (browser) still override it,
 * for a preview deployment that should report elsewhere or not at all.
 */
export const SENTRY_DSN = "";

/** The DSN to use: the override if there is one, else the constant, else none. */
export function resolveDsn(override: string | undefined, fallback: string = SENTRY_DSN): string | undefined {
  return override?.trim() || fallback.trim() || undefined;
}
