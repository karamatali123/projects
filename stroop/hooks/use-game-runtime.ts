"use client";

import { useEffect } from "react";
import { KEY_TO_DIRECTION } from "@/lib/directions";
import { useGameStore } from "@/store/game-store";

const CORRECT_FEEDBACK_MS = 220;
const INCORRECT_FEEDBACK_MS = 460;
const CLOCK_INTERVAL_MS = 100;

export function useHydrateSave(): void {
  useEffect(() => {
    useGameStore.getState().hydrate();
  }, []);
}

export function useMatchClock(): void {
  const phase = useGameStore((state) => state.phase);

  useEffect(() => {
    if (phase !== "playing" && phase !== "resolving") return;

    const sync = () => useGameStore.getState().syncClock();
    sync();
    const id = window.setInterval(sync, CLOCK_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [phase]);
}

export function useFeedbackAdvance(): void {
  const feedback = useGameStore((state) => state.feedback);
  const round = useGameStore((state) => state.puzzle?.round ?? 0);

  useEffect(() => {
    if (!feedback) return;
    const delay = feedback === "correct" ? CORRECT_FEEDBACK_MS : INCORRECT_FEEDBACK_MS;
    const id = window.setTimeout(() => {
      useGameStore.getState().finishFeedback();
    }, delay);
    return () => window.clearTimeout(id);
  }, [feedback, round]);
}

export function useGameHotkeys(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        if (useGameStore.getState().phase === "playing") {
          useGameStore.getState().submit(direction);
        }
        return;
      }

      if (event.key === "Enter" && !isFromButton(event)) {
        const phase = useGameStore.getState().phase;
        if (phase === "ready" || phase === "over") {
          event.preventDefault();
          useGameStore.getState().startMatch();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

function isFromButton(event: KeyboardEvent): boolean {
  return event.target instanceof HTMLElement && event.target.closest("button") !== null;
}
