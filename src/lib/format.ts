/** Compact number formatting for social counts: 1200 -> "1.2k", 3_400_000 -> "3.4m". */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const v = n / 1000;
    return `${v >= 100 ? Math.round(v) : trim(v)}k`;
  }
  return `${trim(n / 1_000_000)}m`;
}

function trim(v: number): string {
  return v.toFixed(1).replace(/\.0$/, '');
}
