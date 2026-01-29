const COMMON_TYPOS: Record<string, string> = {
  dreses: "dresses",
  dresse: "dresses",
  jenas: "jeans",
  jens: "jeans",
  jakets: "jackets",
  jaket: "jackets",
  shos: "shoes",
  arivals: "arrivals",
};

export function getDidYouMean(query: string): string | null {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return null;
  return COMMON_TYPOS[trimmed] ?? null;
}

export function suggestCorrection(query: string): { original: string; suggested: string } | null {
  const suggested = getDidYouMean(query);
  if (!suggested) return null;
  return { original: query, suggested };
}
