let counter = 0;
export function uniqueId(prefix = "id"): string {
  return prefix + "-" + ++counter + "-" + Date.now();
}
