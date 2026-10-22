"use client";

import { cn } from "@/lib/cn";
import { useGameStore } from "@/store/game-store";
import { DirectionPad } from "@/components/direction-pad";
import { EchoBanner } from "@/components/echo-banner";
import { Hud } from "@/components/hud";
import { LawReadout } from "@/components/law-readout";
import { PuzzleCanvas } from "@/components/puzzle-canvas";

export function MatchStage() {
  const feedback = useGameStore((state) => state.feedback);
  const puzzle = useGameStore((state) => state.puzzle);
  const score = useGameStore((state) => state.score);
  const streak = useGameStore((state) => state.streak);
  if (!puzzle) return null;

  const announcement =
    feedback === "correct"
      ? `Correct. Score ${score}. Streak ${streak}.`
      : feedback === "incorrect"
        ? "Incorrect. Streak reset."
        : "";

  return (
    <section
      data-testid="playfield"
      data-feedback={feedback ?? "idle"}
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border bg-panel/90 select-none",
        feedback === "correct" && "border-signal outline-correct motion-safe:animate-flash",
        feedback === "incorrect" && "border-flare outline-wrong motion-safe:animate-shake",
        feedback === null && "border-stroke",
      )}
    >
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 py-3 sm:gap-3 sm:px-5 sm:py-4">
        <Hud />
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 overflow-y-auto">
          <LawReadout />
          <EchoBanner />
          <PuzzleCanvas />
        </div>
        <DirectionPad />
      </div>
    </section>
  );
}
