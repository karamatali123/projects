export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type LinguisticLaw = "STANDARD" | "INVERSION" | "COLOR_SHIFT";

export type CueColor = "emerald" | "rose";

export type ColorRelation = "complement" | "conflict";

export type Phase = "ready" | "playing" | "resolving" | "over";

export type Feedback = "correct" | "incorrect";

export interface Puzzle {
  round: number;
  word: Direction;
  color: CueColor;
  law: LinguisticLaw;
  isEcho: boolean;
  correct: Direction;
  relation: ColorRelation;
}

export interface RoundSummary {
  score: number;
  bestStreak: number;
  correctCount: number;
  answeredCount: number;
}
