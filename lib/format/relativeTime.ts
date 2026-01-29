export function relativeTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return "just now";
  return Math.floor(diff / 60000) + "m ago";
}
