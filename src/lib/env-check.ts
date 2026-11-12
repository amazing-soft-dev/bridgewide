type Env = Record<string, string | undefined>;

export type EnvProblem = { level: "error" | "warning"; message: string };

const filled = (value: string | undefined) => Boolean(value?.trim());

/**
 * What is wrong with the settings. In production a form cannot send, and the
 * cron routes refuse every request, without the keys below; in development a
 * missing key is normal and nothing is reported. Turnstile is optional, but a
 * site key without a secret shows a widget nobody checks, and a secret
 * without a site key refuses every post because no token can be made.
 */
export function envProblems(env: Env): EnvProblem[] {
  const problems: EnvProblem[] = [];

  if (env.NODE_ENV === "production") {
    for (const name of ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"]) {
      if (!filled(env[name])) problems.push({ level: "error", message: `${name} is not set, so every form will fail.` });
    }
    if (!filled(env.CRON_SECRET)) {
      problems.push({ level: "error", message: "CRON_SECRET is not set, so the role digest cron will be refused." });
    }
    if (env.DESK_ALLOW_UNAUTHENTICATED === "1") {
      problems.push({ level: "warning", message: "DESK_ALLOW_UNAUTHENTICATED is set. It is ignored in production." });
    }
  }

  const site = filled(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const secret = filled(env.TURNSTILE_SECRET_KEY);
  if (site && !secret) {
    problems.push({ level: "warning", message: "NEXT_PUBLIC_TURNSTILE_SITE_KEY is set without TURNSTILE_SECRET_KEY, so the check is shown but never verified." });
  }
  if (secret && !site) {
    problems.push({ level: "error", message: "TURNSTILE_SECRET_KEY is set without NEXT_PUBLIC_TURNSTILE_SITE_KEY, so no form can produce a token and every post will be refused." });
  }

  return problems;
}
