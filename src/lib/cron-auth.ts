import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Bearer-token check for the cron routes and the desk record route.
 *
 * - The token is compared as SHA-256 digests with timingSafeEqual, so the
 *   comparison time does not depend on how much of a guess is right.
 * - With no CRON_SECRET the request is refused. The one exception is local
 *   development: DESK_ALLOW_UNAUTHENTICATED=1 and NODE_ENV not production.
 */
export function isAuthorized(
  request: Request,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const secret = env.CRON_SECRET?.trim();
  if (!secret) return env.DESK_ALLOW_UNAUTHENTICATED === "1" && env.NODE_ENV !== "production";
  const given = createHash("sha256")
    .update(request.headers.get("authorization") ?? "")
    .digest();
  const wanted = createHash("sha256").update(`Bearer ${secret}`).digest();
  return timingSafeEqual(given, wanted);
}
