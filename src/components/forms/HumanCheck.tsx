"use client";

import Script from "next/script";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

declare global {
  interface Window {
    turnstile?: { reset: (target?: string | Element) => void };
  }
}

/**
 * Start a fresh check on every Turnstile widget on the page. A token works
 * once, so each form calls this after it posts, and a visitor who retries gets
 * a new one.
 */
export function resetHumanChecks() {
  if (typeof document === "undefined" || !window.turnstile) return;
  for (const widget of document.querySelectorAll(".cf-turnstile")) window.turnstile.reset(widget);
}

/**
 * The Cloudflare Turnstile widget. It adds the hidden field cf-turnstile-response
 * to the form around it. It shows nothing unless Cloudflare needs the visitor to
 * do something (interaction-only), and then it can be used with a keyboard.
 * With no NEXT_PUBLIC_TURNSTILE_SITE_KEY it renders nothing.
 */
export function HumanCheck() {
  if (!siteKey) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div className="cf-turnstile" data-sitekey={siteKey} data-appearance="interaction-only" />
    </>
  );
}
