import { MATCH_SECONDS } from "@/lib/engine";

export function formatScore(score: number): string {
  return new Intl.NumberFormat("en-US").format(score);
}

export function formatClock(timeLeft: number): string {
  const clamped = Math.max(0, timeLeft);
  if (clamped <= 10) return clamped.toFixed(1);
  return Math.ceil(clamped).toString();
}

export function formatMultiplier(value: number): string {
  return `×${value.toFixed(1)}`;
}

export function timeFraction(timeLeft: number): number {
  return Math.min(1, Math.max(0, timeLeft / MATCH_SECONDS));
}

export function accuracyPercent(correct: number, answered: number): number {
  if (answered <= 0) return 0;
  return Math.round((correct / answered) * 100);
}
