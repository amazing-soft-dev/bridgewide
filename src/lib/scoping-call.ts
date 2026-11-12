/**
 * The scoping-call link shown after a complete hire brief. It comes from
 * NEXT_PUBLIC_SCOPING_CALL_URL, and there is no link until that is set.
 */
export function scopingCallUrl(complete: boolean): string | null {
  if (!complete) return null;
  const url = process.env.NEXT_PUBLIC_SCOPING_CALL_URL?.trim();
  return url || null;
}
