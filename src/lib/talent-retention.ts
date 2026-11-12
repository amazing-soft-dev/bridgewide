const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function expiredTalent(at: string, now = Date.now()): boolean {
  const time = Date.parse(at);
  if (Number.isNaN(time)) return false;
  return now - time > YEAR_MS;
}
