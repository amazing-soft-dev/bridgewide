import type { Event } from "@sentry/nextjs";

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

/** Replace any email address in a piece of text. */
export function redactEmails(text: string): string {
  return text.replace(EMAIL, "[email]");
}

/** The address of a page without its query string or fragment, which can carry an email. */
function withoutQuery(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return redactEmails(url.split(/[?#]/)[0]);
  }
}

/**
 * Take the personal data out of an error report before it leaves the site. The
 * forms carry names, emails, messages, and CVs, so nothing from a request
 * body, a cookie, a header, a query string, or a user is sent, and an email
 * address inside an error message or a breadcrumb is replaced.
 */
export function scrubEvent<T extends Event>(event: T): T {
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.query_string;
    if (event.request.url) event.request.url = withoutQuery(event.request.url);
  }
  delete event.user;

  if (event.message) event.message = redactEmails(event.message);
  for (const exception of event.exception?.values ?? []) {
    if (exception.value) exception.value = redactEmails(exception.value);
  }
  for (const breadcrumb of event.breadcrumbs ?? []) {
    if (breadcrumb.message) breadcrumb.message = redactEmails(breadcrumb.message);
    // Request bodies and URLs from fetch breadcrumbs live in data.
    delete breadcrumb.data;
  }
  return event;
}
