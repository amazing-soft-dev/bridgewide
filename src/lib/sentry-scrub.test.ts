import type { Event } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";
import { redactEmails, scrubEvent } from "@/lib/sentry-scrub";
import { sentryOptions } from "@/lib/sentry-options";

describe("redactEmails", () => {
  it("replaces addresses anywhere in the text", () => {
    expect(redactEmails("Could not send to ada@example.com and BO.Smith+cv@Mail.Example.org today")).toBe(
      "Could not send to [email] and [email] today",
    );
  });

  it("leaves text without an address alone", () => {
    expect(redactEmails("Resend could not send the email.")).toBe("Resend could not send the email.");
  });
});

describe("scrubEvent", () => {
  const event = (): Event => ({
    message: "Failed for ada@example.com",
    user: { email: "ada@example.com", ip_address: "203.0.113.5" },
    request: {
      url: "https://www.bridgewide.org/contact?email=ada@example.com#top",
      method: "POST",
      data: { name: "Ada", email: "ada@example.com", message: "Hello" },
      cookies: { session: "abc" },
      headers: { cookie: "x=1", authorization: "Bearer secret" },
      query_string: "email=ada@example.com",
    },
    exception: { values: [{ type: "Error", value: "Invalid address ada@example.com" }] },
    breadcrumbs: [
      { message: "POST /api/contact for ada@example.com", data: { body: "name=Ada" } },
      { category: "ui.click", data: { target: "button" } },
    ],
  });

  it("removes the request body, cookies, headers, query string, and the user", () => {
    const scrubbed = scrubEvent(event());
    expect(scrubbed.request).not.toHaveProperty("data");
    expect(scrubbed.request).not.toHaveProperty("cookies");
    expect(scrubbed.request).not.toHaveProperty("headers");
    expect(scrubbed.request).not.toHaveProperty("query_string");
    expect(scrubbed).not.toHaveProperty("user");
  });

  it("keeps the method and the page path, without the query or fragment", () => {
    const scrubbed = scrubEvent(event());
    expect(scrubbed.request?.method).toBe("POST");
    expect(scrubbed.request?.url).toBe("https://www.bridgewide.org/contact");
  });

  it("redacts emails in the message, the exception, and breadcrumbs, and drops breadcrumb data", () => {
    const scrubbed = scrubEvent(event());
    expect(scrubbed.message).toBe("Failed for [email]");
    expect(scrubbed.exception?.values?.[0].value).toBe("Invalid address [email]");
    expect(scrubbed.breadcrumbs?.[0].message).toBe("POST /api/contact for [email]");
    for (const breadcrumb of scrubbed.breadcrumbs ?? []) expect(breadcrumb).not.toHaveProperty("data");
  });

  it("leaves nothing that looks like the visitor anywhere in the event", () => {
    const text = JSON.stringify(scrubEvent(event()));
    expect(text).not.toContain("ada@example.com");
    expect(text).not.toContain("Ada");
    expect(text).not.toContain("203.0.113.5");
    expect(text).not.toContain("secret");
  });

  it("handles an event with no request at all", () => {
    expect(scrubEvent({ message: "boom" })).toEqual({ message: "boom" });
  });

  it("falls back to cutting the query when a URL cannot be parsed", () => {
    expect(scrubEvent({ request: { url: "/contact?email=ada@example.com" } }).request?.url).toBe("/contact");
  });
});

describe("sentryOptions", () => {
  it("turns off tracing and default personal data and runs the scrubber", () => {
    const options = sentryOptions("https://key@o1.ingest.sentry.io/1");
    expect(options.tracesSampleRate).toBe(0);
    expect(options.sendDefaultPii).toBe(false);
    expect(options.beforeSend).toBe(scrubEvent);
    expect(options.dsn).toBe("https://key@o1.ingest.sentry.io/1");
  });
});
