import type { RoundSummary } from "@/lib/types";

const HIGH_SCORE_KEY = "semantic-paradox.high-score";
const LAST_ROUND_KEY = "semantic-paradox.last-round";

export interface SavedMatch {
  highScore: number;
  lastRound: RoundSummary | null;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isRoundSummary(value: unknown): value is RoundSummary {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    isWhole(record.score) &&
    isWhole(record.bestStreak) &&
    isWhole(record.correctCount) &&
    isWhole(record.answeredCount)
  );
}

function isWhole(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function loadSavedMatch(): SavedMatch {
  if (!canUseStorage()) return { highScore: 0, lastRound: null };

  try {
    const highScoreRaw = window.localStorage.getItem(HIGH_SCORE_KEY);
    const highScoreValue = Number(highScoreRaw);
    const highScore = isWhole(highScoreValue) ? Math.floor(highScoreValue) : 0;
    const roundRaw = window.localStorage.getItem(LAST_ROUND_KEY);
    const lastRound = roundRaw ? parseRound(roundRaw) : null;
    return { highScore, lastRound };
  } catch {
    return { highScore: 0, lastRound: null };
  }
}

function parseRound(raw: string): RoundSummary | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRoundSummary(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveMatchResult(highScore: number, round: RoundSummary): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(HIGH_SCORE_KEY, String(Math.floor(highScore)));
    window.localStorage.setItem(LAST_ROUND_KEY, JSON.stringify(round));
  } catch {
    // Storage can be unavailable in private browsing. The in-memory result still stands.
  }
}
