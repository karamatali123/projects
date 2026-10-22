import { matchesHistory } from "@/lib/feedback";
import type { GuessResult } from "@/types/solver";

export function filterCandidates(
  answers: readonly string[],
  history: readonly GuessResult[],
): string[] {
  if (history.length === 0) return [...answers];
  return answers.filter((candidate) => matchesHistory(candidate, history));
}

export function firstBreakingGuess(
  answers: readonly string[],
  history: readonly GuessResult[],
): number | null {
  let pool = answers;
  for (let index = 0; index < history.length; index += 1) {
    const guess = history[index];
    if (!guess) continue;
    const next = filterCandidates(pool, [guess]);
    if (next.length === 0) return index;
    pool = next;
  }
  return null;
}
