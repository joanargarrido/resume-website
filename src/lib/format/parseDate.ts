/** Parses a `YYYY-MM-DD` string into numeric parts (no timezone involved). Returns null if invalid. */
export function parseIsoDate(
  value: string,
): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

export function isValidIsoDate(value: string): boolean {
  return parseIsoDate(value) !== null;
}
