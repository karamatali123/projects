"use client";

import { LAW_MANUAL } from "@/lib/engine";
import { useGameStore } from "@/store/game-store";

export function EchoBanner() {
  const puzzle = useGameStore((state) => state.puzzle);
  const isEcho = puzzle?.isEcho ?? false;
  const lawTitle = puzzle ? LAW_MANUAL[puzzle.law].title : "";

  return (
    <div className="flex min-h-14 items-center justify-center">
      {isEcho ? (
        <div
          role="alert"
          data-testid="echo-banner"
          className="motion-safe:animate-blink rounded-full border border-flare bg-flare/10 px-5 py-1.5 text-center"
        >
          <p className="font-mono text-[11px] font-medium tracking-[0.28em] text-flare uppercase">
            Echo mode active
          </p>
          <p className="text-xs text-paper">{lawTitle} from two rounds ago</p>
        </div>
      ) : null}
    </div>
  );
}
