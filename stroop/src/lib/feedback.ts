import type { Feedback, GuessResult } from "@/types/solver";

const STRENGTH: Record<Feedback, number> = {
  gray: 1,
  yellow: 2,
  green: 3,
};

export function scoreGuess(answer: string, guess: string): Feedback[] {
  const solution = answer.toLowerCase();
  const attempt = guess.toLowerCase();
  if (solution.length !== attempt.length) {
    throw new Error("Guess and answer must be the same length.");
  }

  const result: Feedback[] = Array.from({ length: attempt.length }, () => "gray");
  const remaining: Record<string, number> = {};

  for (let index = 0; index < attempt.length; index += 1) {
    if (attempt[index] === solution[index]) {
      result[index] = "green";
    } else {
      const letter = solution[index] ?? "";
      remaining[letter] = (remaining[letter] ?? 0) + 1;
    }
  }

  for (let index = 0; index < attempt.length; index += 1) {
    if (result[index] === "green") continue;
    const letter = attempt[index] ?? "";
    if ((remaining[letter] ?? 0) > 0) {
      result[index] = "yellow";
      remaining[letter] -= 1;
    }
  }

  return result;
}

export function encodePattern(tiles: readonly Feedback[]): string {
  return tiles
    .map((tile) => (tile === "green" ? "G" : tile === "yellow" ? "Y" : "X"))
    .join("");
}

export function matchesHistory(
  candidate: string,
  history: readonly GuessResult[],
): boolean {
  return history.every((guess) => {
    if (guess.feedback.length !== guess.word.length) return false;
    const predicted = scoreGuess(candidate, guess.word);
    return predicted.every((tile, index) => tile === guess.feedback[index]);
  });
}

export function keyboardMarks(
  history: readonly GuessResult[],
): Partial<Record<string, Feedback>> {
  const marks: Partial<Record<string, Feedback>> = {};
  for (const guess of history) {
    for (let index = 0; index < guess.word.length; index += 1) {
      const letter = guess.word[index];
      const tile = guess.feedback[index];
      if (!letter || !tile) continue;
      const current = marks[letter];
      if (!current || STRENGTH[tile] > STRENGTH[current]) {
        marks[letter] = tile;
      }
    }
  }
  return marks;
}

export function nextTile(current: Feedback | null): Feedback {
  if (current === "gray") return "yellow";
  if (current === "yellow") return "green";
  return "gray";
}

export function feedbackLabel(tile: Feedback | null): string {
  if (tile === "green") return "correct spot";
  if (tile === "yellow") return "in the word, wrong spot";
  if (tile === "gray") return "not in the word, or already counted";
  return "no feedback yet";
}
