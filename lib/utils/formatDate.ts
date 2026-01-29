export function formatDate(d: Date | string): string {
  return new Intl.DateTimeFormat("en-US").format(new Date(d));
}
