import { encodePattern, scoreGuess } from "@/lib/feedback";
import type { Recommendation } from "@/types/solver";

export function rankGuesses(
  candidates: readonly string[],
  allowedGuesses: readonly string[],
  options?: { limit?: number; informationLimit?: number },
): Recommendation[] {
  const limit = options?.limit ?? 5;
  const informationLimit = options?.informationLimit ?? 280;
  if (candidates.length === 0 || limit <= 0) return [];

  if (candidates.length === 1) {
    const word = candidates[0];
    if (!word) return [];
    return [
      {
        word,
        possibleAnswer: true,
        expectedRemaining: 0,
        reason: "This is the only word that matches your feedback.",
      },
    ];
  }

  const frequency = letterFrequency(candidates);
  const candidateSet = new Set(candidates);

  if (candidates.length > informationLimit) {
    return rankByFrequency(allowedGuesses, candidateSet, frequency, limit);
  }

  return rankByExpectedRemaining(
    candidates,
    allowedGuesses,
    candidateSet,
    frequency,
    limit,
  );
}

function rankByFrequency(
  allowedGuesses: readonly string[],
  candidateSet: ReadonlySet<string>,
  frequency: Readonly<Record<string, number>>,
  limit: number,
): Recommendation[] {
  return allowedGuesses
    .map((word) => ({
      word,
      possibleAnswer: candidateSet.has(word),
      score: frequencyScore(word, frequency) + (candidateSet.has(word) ? 0.15 : 0),
    }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        Number(right.possibleAnswer) - Number(left.possibleAnswer) ||
        left.word.localeCompare(right.word),
    )
    .slice(0, limit)
    .map((entry) => ({
      word: entry.word,
      possibleAnswer: entry.possibleAnswer,
      expectedRemaining: null,
      reason: entry.possibleAnswer
        ? "A possible answer that tests letters common among the remaining words."
        : "Tests several letters common among the remaining answers.",
    }));
}

function rankByExpectedRemaining(
  candidates: readonly string[],
  allowedGuesses: readonly string[],
  candidateSet: ReadonlySet<string>,
  frequency: Readonly<Record<string, number>>,
  limit: number,
): Recommendation[] {
  const extras = [...allowedGuesses]
    .filter((word) => !candidateSet.has(word))
    .map((word) => ({ word, score: frequencyScore(word, frequency) }))
    .sort((left, right) => right.score - left.score || left.word.localeCompare(right.word))
    .slice(0, 60)
    .map((entry) => entry.word);

  const pool = [...new Set([...candidates, ...extras])];

  return pool
    .map((word) => {
      const expectedRemaining = expectedRemainingCount(word, candidates);
      const possibleAnswer = candidateSet.has(word);
      return {
        word,
        possibleAnswer,
        expectedRemaining,
        adjusted: expectedRemaining - (possibleAnswer ? 0.35 : 0),
      };
    })
    .sort(
      (left, right) =>
        left.adjusted - right.adjusted ||
        Number(right.possibleAnswer) - Number(left.possibleAnswer) ||
        left.word.localeCompare(right.word),
    )
    .slice(0, limit)
    .map((entry) => ({
      word: entry.word,
      possibleAnswer: entry.possibleAnswer,
      expectedRemaining: entry.expectedRemaining,
      reason: entry.possibleAnswer
        ? "A possible answer that also splits the remaining words."
        : "Tests letters that split the remaining answers.",
    }));
}

function expectedRemainingCount(guess: string, candidates: readonly string[]): number {
  const groups = new Map<string, number>();
  for (const answer of candidates) {
    const pattern = encodePattern(scoreGuess(answer, guess));
    groups.set(pattern, (groups.get(pattern) ?? 0) + 1);
  }

  const total = candidates.length;
  let expected = 0;
  for (const [pattern, count] of groups) {
    const remaining = pattern === "G".repeat(guess.length) ? 0 : count;
    expected += (count / total) * remaining;
  }
  return expected;
}

function letterFrequency(candidates: readonly string[]): Record<string, number> {
  const frequency: Record<string, number> = {};
  for (const word of candidates) {
    for (const letter of new Set(word)) {
      frequency[letter] = (frequency[letter] ?? 0) + 1;
    }
  }
  return frequency;
}

function frequencyScore(
  word: string,
  frequency: Readonly<Record<string, number>>,
): number {
  let score = 0;
  for (const letter of new Set(word)) {
    score += frequency[letter] ?? 0;
  }
  return score;
}
