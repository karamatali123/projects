const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

const currencyWholeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

export function roundToCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

export function formatCurrency(value: number, options?: { whole?: boolean }): string {
  if (!Number.isFinite(value)) return "—";
  return options?.whole
    ? currencyWholeFormatter.format(Math.round(value))
    : currencyFormatter.format(roundToCents(value));
}

export function formatGbp(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return gbpFormatter.format(roundToCents(value));
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return percentFormatter.format(value);
}

export function formatMonths(months: number): string {
  if (!Number.isFinite(months) || months < 0) return "—";
  if (months === Infinity) return "Never (payment is too low)";
  const rounded = Math.ceil(months);
  const years = Math.floor(rounded / 12);
  const remaining = rounded % 12;
  if (years === 0) {
    return `${rounded} ${rounded === 1 ? "month" : "months"}`;
  }
  const yearLabel = `${years} ${years === 1 ? "year" : "years"}`;
  if (remaining === 0) return yearLabel;
  return `${yearLabel}, ${remaining} ${remaining === 1 ? "month" : "months"}`;
}

export function parseMoneyInput(raw: string): number | null {
  const cleaned = raw.replace(/[$£,\s]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export { numberFormatter };
