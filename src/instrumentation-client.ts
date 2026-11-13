import * as Sentry from "@sentry/nextjs";
import { resolveDsn } from "@/lib/sentry-dsn";
import { sentryOptions } from "@/lib/sentry-options";

// Browser errors. The DSN comes from src/lib/sentry-dsn.ts; NEXT_PUBLIC_SENTRY_DSN overrides it.
// Nothing happens while both are empty.
const dsn = resolveDsn(process.env.NEXT_PUBLIC_SENTRY_DSN);
if (dsn) Sentry.init(sentryOptions(dsn));

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
