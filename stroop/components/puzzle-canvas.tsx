"use client";

import { INK_NAME, SIGNAL_NAME } from "@/lib/engine";
import { cn } from "@/lib/cn";
import { useGameStore } from "@/store/game-store";

export function PuzzleCanvas() {
  const puzzle = useGameStore((state) => state.puzzle);
  if (!puzzle) return null;

  return (
    <section
      data-testid="puzzle-canvas"
      data-relation={puzzle.relation}
      data-ink={puzzle.color}
      aria-label={`${INK_NAME[puzzle.color]} ink. The word is ${puzzle.word}. ${SIGNAL_NAME[puzzle.relation]}.`}
      className={cn(
        "relative flex min-h-28 flex-1 flex-col items-center justify-center rounded-3xl px-4 py-6 sm:min-h-36",
        puzzle.relation === "conflict" ? "cue-conflict" : "cue-complement",
      )}
    >
      <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.18em] uppercase">
        <span
          data-testid="puzzle-ink"
          className={puzzle.color === "emerald" ? "text-signal" : "text-flare"}
        >
          {INK_NAME[puzzle.color]}
        </span>
        <span className="text-mist">{SIGNAL_NAME[puzzle.relation]}</span>
      </div>
      <p
        data-testid="puzzle-word"
        translate="no"
        className={cn(
          "font-mono leading-none font-medium tracking-[0.12em] text-[clamp(3.25rem,12vw,6.25rem)]",
          puzzle.color === "emerald" ? "ink-emerald" : "ink-rose",
        )}
      >
        {puzzle.word}
      </p>
    </section>
  );
}
