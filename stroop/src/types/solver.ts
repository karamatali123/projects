export const WORD_LENGTHS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const;
export const DEFAULT_WORD_LENGTH = 5;
export const ROW_COUNT = 6;

export type WordLength = (typeof WORD_LENGTHS)[number];

export function isWordLength(value: number): value is WordLength {
  return WORD_LENGTHS.some((length) => length === value);
}

export type Feedback = "green" | "yellow" | "gray";

export type TileMark = Feedback | null;

export type GuessResult = {
  word: string;
  feedback: Feedback[];
};

export type RowState = {
  letters: string[];
  feedback: TileMark[];
  submitted: boolean;
};

export type SolverStatus = "editing" | "solved" | "inconsistent";

export type SolverMode = "classic" | "smart" | "clues";

export type Recommendation = {
  word: string;
  possibleAnswer: boolean;
  reason: string;
  expectedRemaining: number | null;
};
