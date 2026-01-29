export function parseNumber(s: string, fallback = 0): number {
  const n = parseFloat(s);
  return Number.isNaN(n) ? fallback : n;
}
