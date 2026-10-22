"use client";

import {
  useFeedbackAdvance,
  useGameHotkeys,
  useHydrateSave,
  useMatchClock,
} from "@/hooks/use-game-runtime";
import { useGameStore } from "@/store/game-store";
import { MatchOverlay } from "@/components/match-overlay";
import { MatchStage } from "@/components/match-stage";

export function GameScreen() {
  const phase = useGameStore((state) => state.phase);
  useHydrateSave();
  useMatchClock();
  useFeedbackAdvance();
  useGameHotkeys();

  const inMatch = phase === "playing" || phase === "resolving";

  return (
    <main className="relative h-dvh overflow-hidden">
      <Atmosphere />
      <div className="relative mx-auto flex h-full w-full max-w-xl flex-col px-3 py-3 sm:px-4 sm:py-4">
        {inMatch ? <MatchStage /> : <MatchOverlay />}
      </div>
    </main>
  );
}

function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-signal/10 blur-3xl" />
      <div className="absolute -right-16 -bottom-32 h-96 w-96 rounded-full bg-flare/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(244,241,234,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,241,234,0.04)_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
    </div>
  );
}
