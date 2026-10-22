export function parseFormNumber(value: string): number {
  const cleaned = value.replace(/[$£,%\s]/g, "");
  if (cleaned === "") return Number.NaN;
  return Number(cleaned);
}

export function scrollToResults() {
  document.getElementById("results")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
