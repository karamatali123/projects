"use client";

import { ECHO_LOOKBACK, LAW_CODE } from "@/lib/engine";
import { cn } from "@/lib/cn";
import type { LinguisticLaw } from "@/lib/types";
import { useGameStore } from "@/store/game-store";

const WINDOW = 6;

export function RuleTape() {
  const history = useGameStore((state) => state.ruleHistory);
  const puzzle = useGameStore((state) => state.puzzle);
  if (!puzzle || history.length === 0) return null;

  const start = Math.max(0, history.length - WINDOW);
  const visible = history.slice(start);
  const sourceRound = puzzle.isEcho ? puzzle.round - ECHO_LOOKBACK : null;

  return (
    <ol aria-label="Recent laws" className="flex flex-wrap gap-1.5">
      {visible.map((law, index) => {
        const round = start + index + 1;
        const isCurrent = round === puzzle.round;
        const isSource = round === sourceRound;
        return (
          <li key={round}>
            <LawChip law={law} round={round} isCurrent={isCurrent} isSource={isSource} />
          </li>
        );
      })}
    </ol>
  );
}

function LawChip({
  law,
  round,
  isCurrent,
  isSource,
}: {
  law: LinguisticLaw;
  round: number;
  isCurrent: boolean;
  isSource: boolean;
}) {
  return (
    <span
      title={`Round ${round}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] tracking-[0.14em]",
        isCurrent && "border-paper/70 text-paper",
        isSource && "border-flare text-flare",
        !isCurrent && !isSource && "border-stroke text-mist",
      )}
    >
      <span className="text-[9px] opacity-70">{round.toString().padStart(2, "0")}</span>
      {LAW_CODE[law]}
    </span>
  );
}
