"use client";

import { create } from "zustand";
import { createPuzzle, MATCH_SECONDS, pointsForStreak } from "@/lib/engine";
import { loadSavedMatch, saveMatchResult } from "@/lib/storage";
import type {
  Direction,
  Feedback,
  LinguisticLaw,
  Phase,
  Puzzle,
  RoundSummary,
} from "@/lib/types";

interface GameStore {
  phase: Phase;
  score: number;
  streak: number;
  bestStreak: number;
  timeLeft: number;
  matchEndsAt: number | null;
  highScore: number;
  highScoreReady: boolean;
  isNewHighScore: boolean;
  lastRound: RoundSummary | null;
  puzzle: Puzzle | null;
  ruleHistory: LinguisticLaw[];
  feedback: Feedback | null;
  lastInput: Direction | null;
  lastGain: number;
  correctCount: number;
  answeredCount: number;
  timeExpired: boolean;
  hydrate: () => void;
  startMatch: () => void;
  submit: (direction: Direction) => void;
  finishFeedback: () => void;
  syncClock: () => void;
}

const initialMatch = {
  score: 0,
  streak: 0,
  bestStreak: 0,
  timeLeft: MATCH_SECONDS,
  matchEndsAt: null,
  isNewHighScore: false,
  puzzle: null,
  ruleHistory: [] as LinguisticLaw[],
  feedback: null,
  lastInput: null,
  lastGain: 0,
  correctCount: 0,
  answeredCount: 0,
  timeExpired: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: "ready",
  highScore: 0,
  highScoreReady: false,
  lastRound: null,
  ...initialMatch,

  hydrate: () => {
    const saved = loadSavedMatch();
    set({
      highScore: saved.highScore,
      lastRound: saved.lastRound,
      highScoreReady: true,
    });
  },

  startMatch: () => {
    const opening = createPuzzle({
      history: [],
      previousWord: null,
      round: 1,
    });

    set({
      ...initialMatch,
      phase: "playing",
      matchEndsAt: Date.now() + MATCH_SECONDS * 1000,
      puzzle: opening.puzzle,
      ruleHistory: opening.history,
    });
  },

  submit: (direction) => {
    const state = get();
    if (state.phase !== "playing" || state.puzzle === null) return;

    const correct = direction === state.puzzle.correct;
    if (correct) {
      const streak = state.streak + 1;
      const lastGain = pointsForStreak(streak);
      set({
        phase: "resolving",
        feedback: "correct",
        lastInput: direction,
        lastGain,
        score: state.score + lastGain,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        correctCount: state.correctCount + 1,
        answeredCount: state.answeredCount + 1,
      });
      return;
    }

    set({
      phase: "resolving",
      feedback: "incorrect",
      lastInput: direction,
      lastGain: 0,
      streak: 0,
      answeredCount: state.answeredCount + 1,
    });
  },

  finishFeedback: () => {
    const state = get();
    if (state.phase !== "resolving" || state.puzzle === null) return;

    const expired =
      state.timeExpired ||
      (state.matchEndsAt !== null && Date.now() >= state.matchEndsAt);

    if (expired) {
      closeMatch(set, get);
      return;
    }

    const next = createPuzzle({
      history: state.ruleHistory,
      previousWord: state.puzzle.word,
      round: state.puzzle.round + 1,
    });

    set({
      phase: "playing",
      puzzle: next.puzzle,
      ruleHistory: next.history,
      feedback: null,
      lastInput: null,
      lastGain: 0,
    });
  },

  syncClock: () => {
    const state = get();
    if (
      (state.phase !== "playing" && state.phase !== "resolving") ||
      state.matchEndsAt === null
    ) {
      return;
    }

    const timeLeft = Math.max(0, (state.matchEndsAt - Date.now()) / 1000);
    if (timeLeft <= 0) {
      if (state.phase === "resolving") {
        if (!state.timeExpired) set({ timeLeft: 0, timeExpired: true });
        return;
      }
      closeMatch(set, get);
      return;
    }

    set({ timeLeft });
  },
}));

function closeMatch(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
): void {
  const state = get();
  if (state.phase !== "playing" && state.phase !== "resolving") return;

  const summary: RoundSummary = {
    score: state.score,
    bestStreak: state.bestStreak,
    correctCount: state.correctCount,
    answeredCount: state.answeredCount,
  };
  const highScore = Math.max(state.highScore, state.score);
  const isNewHighScore = state.score > state.highScore && state.score > 0;
  saveMatchResult(highScore, summary);

  set({
    phase: "over",
    timeLeft: 0,
    matchEndsAt: null,
    highScore,
    highScoreReady: true,
    isNewHighScore,
    lastRound: summary,
    feedback: null,
    lastInput: null,
    timeExpired: false,
  });
}
