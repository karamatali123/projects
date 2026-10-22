import type { Feedback } from "@/types/solver";

export function validateGuess(
  word: string,
  feedback: readonly (Feedback | null)[],
  allowed: ReadonlySet<string>,
  length: number,
): string | null {
  if (word.length === 0) return `Enter a ${length}-letter word.`;
  if (!/^[a-z]+$/.test(word)) return "Use letters only.";
  if (word.length < length) return `Finish the ${length}-letter word before submitting.`;
  if (word.length > length) return `Guesses must be ${length} letters.`;
  if (!allowed.has(word)) return "That word is not in the guess dictionary.";
  if (feedback.length !== length || feedback.some((tile) => tile === null)) {
    return "Mark every tile before submitting.";
  }
  return null;
}
