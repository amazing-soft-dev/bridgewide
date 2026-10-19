/**
 * Page-view payload shared by Vercel Web Analytics and Speed Insights.
 * Query strings are removed before a hit is stored. A hit that carries an
 * `email` query parameter is dropped so a pasted address cannot reach the
 * dashboard.
 */
export function privacyUrl<T extends { url: string }>(event: T): T | null {
  const absolute = /^https?:\/\//i.test(event.url);
  let url: URL;
  try {
    url = absolute ? new URL(event.url) : new URL(event.url, "https://www.bridgewide.org");
  } catch {
    return null;
  }

  if (url.searchParams.has("email")) return null;

  url.search = "";
  const stored = absolute ? url.toString() : `${url.pathname}${url.hash}`;
  return { ...event, url: stored };
}
