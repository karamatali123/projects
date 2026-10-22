"use client";

import { LAW_MANUAL } from "@/lib/engine";
import { Kicker } from "@/components/kicker";
import { RuleTape } from "@/components/rule-tape";
import { useGameStore } from "@/store/game-store";

export function LawReadout() {
  const puzzle = useGameStore((state) => state.puzzle);
  if (!puzzle) return null;

  const manual = LAW_MANUAL[puzzle.law];

  return (
    <section aria-live="polite" className="rounded-2xl border border-stroke bg-ink/40 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <Kicker>Active law</Kicker>
        <Kicker className={puzzle.isEcho ? "text-flare" : undefined}>
          {puzzle.isEcho ? "Recalled" : `Round ${puzzle.round.toString().padStart(2, "0")}`}
        </Kicker>
      </div>
      <h2
        data-testid="active-law"
        data-law={puzzle.law}
        className="mt-2 font-sans text-2xl font-semibold tracking-tight text-paper"
      >
        {manual.title}
      </h2>
      <p className="mt-1 text-sm text-paper">{manual.directive}</p>
      <p className="mt-1 min-h-10 text-sm leading-5 text-mist">{manual.detail}</p>
      <div className="mt-3">
        <RuleTape />
      </div>
    </section>
  );
}
