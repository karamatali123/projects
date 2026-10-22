import { DIRECTIONS } from "@/lib/directions";
import type {
  ColorRelation,
  CueColor,
  Direction,
  LinguisticLaw,
  Puzzle,
} from "@/lib/types";

export const MATCH_SECONDS = 60;
export const ECHO_CHANCE = 0.15;
export const ECHO_LOOKBACK = 2;
export const BASE_SCORE = 100;
export const MULTIPLIER_STEP = 0.5;
export const STREAK_BONUS = BASE_SCORE * MULTIPLIER_STEP;

export const LAW_SEQUENCE = [
  "STANDARD",
  "INVERSION",
  "COLOR_SHIFT",
] as const satisfies readonly LinguisticLaw[];

export const CUE_COLORS = ["emerald", "rose"] as const satisfies readonly CueColor[];

export const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export const LAW_MANUAL: Record<
  LinguisticLaw,
  { title: string; directive: string; detail: string }
> = {
  STANDARD: {
    title: "Standard",
    directive: "Follow the word",
    detail: "The printed direction is literal. Ink color is a decoy.",
  },
  INVERSION: {
    title: "Inversion",
    directive: "Take the opposite",
    detail: "Up swaps with down. Left swaps with right. Ink color is a decoy.",
  },
  COLOR_SHIFT: {
    title: "Color shift",
    directive: "Obey the ink",
    detail: "Emerald green follows the word. Rose red forces the opposite.",
  },
};

export const LAW_CODE: Record<LinguisticLaw, string> = {
  STANDARD: "STD",
  INVERSION: "INV",
  COLOR_SHIFT: "CLR",
};

export const INK_NAME: Record<CueColor, string> = {
  emerald: "Emerald green",
  rose: "Rose red",
};

export const SIGNAL_NAME: Record<ColorRelation, string> = {
  complement: "Aligned signal",
  conflict: "Interference",
};

export interface RandomSource {
  next(): number;
}

export const mathRandom: RandomSource = {
  next: () => Math.random(),
};

export interface CreatePuzzleInput {
  history: readonly LinguisticLaw[];
  previousWord: Direction | null;
  round: number;
  random?: RandomSource;
}

export function multiplierForStreak(streak: number): number {
  if (streak <= 0) return 1;
  return 1 + (streak - 1) * MULTIPLIER_STEP;
}

export function nextMultiplier(currentStreak: number): number {
  return multiplierForStreak(currentStreak + 1);
}

/** Points awarded when a correct answer raises the streak to `streakAfter`. */
export function pointsForStreak(streakAfter: number): number {
  return Math.round(BASE_SCORE * multiplierForStreak(streakAfter));
}

export function resolveDirection(
  word: Direction,
  law: LinguisticLaw,
  color: CueColor,
): Direction {
  switch (law) {
    case "STANDARD":
      return word;
    case "INVERSION":
      return OPPOSITE[word];
    case "COLOR_SHIFT":
      return color === "rose" ? OPPOSITE[word] : word;
    default: {
      const unreachable: never = law;
      return unreachable;
    }
  }
}

export function signalRelation(law: LinguisticLaw, color: CueColor): ColorRelation {
  switch (law) {
    case "STANDARD":
      return color === "emerald" ? "complement" : "conflict";
    case "INVERSION":
      return color === "rose" ? "complement" : "conflict";
    case "COLOR_SHIFT":
      return "complement";
    default: {
      const unreachable: never = law;
      return unreachable;
    }
  }
}

export function createPuzzle(input: CreatePuzzleInput): {
  puzzle: Puzzle;
  history: LinguisticLaw[];
} {
  const random = input.random ?? mathRandom;
  const rolledLaw = draw(LAW_SEQUENCE, random);
  const word = draw(wordPool(input.previousWord), random);
  const color = draw(CUE_COLORS, random);
  // The first two rounds have no law from two rounds ago, so they cannot echo.
  const echoReady = input.history.length >= ECHO_LOOKBACK;
  const isEcho = echoReady && random.next() < ECHO_CHANCE;
  const recalled = input.history[input.history.length - ECHO_LOOKBACK];
  const law = isEcho && recalled ? recalled : rolledLaw;

  const puzzle: Puzzle = {
    round: input.round,
    word,
    color,
    law,
    isEcho,
    correct: resolveDirection(word, law, color),
    relation: signalRelation(law, color),
  };

  return {
    puzzle,
    history: [...input.history, law],
  };
}

function wordPool(previousWord: Direction | null): readonly Direction[] {
  if (previousWord === null) return DIRECTIONS;
  return DIRECTIONS.filter((direction) => direction !== previousWord);
}

function draw<T>(items: readonly T[], random: RandomSource): T {
  if (items.length === 0) {
    throw new Error("Cannot draw from an empty set.");
  }
  const index = Math.min(
    items.length - 1,
    Math.floor(random.next() * items.length),
  );
  const item = items[index];
  if (item === undefined) {
    throw new Error("Draw missed its pool.");
  }
  return item;
}
