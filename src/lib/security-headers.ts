/**
 * Response headers for every page in the server build. The static export has
 * no server, so it cannot send them.
 *
 * The Content-Security-Policy is report-only on purpose. A strict, nonce-based
 * policy would make every page render per request, which would undo the
 * five-minute revalidation that closes roles on time. So this policy allows
 * inline scripts and styles (Next.js writes inline bootstrap code) and lists
 * only the hosts the site really uses. Check the browser console on the main
 * pages for violations before switching the header name to
 * Content-Security-Policy.
 */
const policy = [
  "default-src 'self'",
  // Inline code from Next.js; Cloudflare Turnstile; Vercel Analytics and Speed Insights.
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src https://challenges.cloudflare.com",
  // The home page star-field may run in a worker built from a blob.
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export const securityHeaders: readonly { key: string; value: string }[] = [
  // Two years, subdomains included. Not preloaded: that is a separate, hard-to-undo step.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  // frame-ancestors is ignored in a report-only policy, so this header does that job for now.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy-Report-Only", value: policy },
];
