/** True on the Node host. The static export has no API routes. */
export function formsLive(): boolean {
  return process.env.NEXT_PUBLIC_STATIC_EXPORT !== "1";
}
