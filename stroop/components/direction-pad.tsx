"use client";

import {
  DIRECTION_GLYPH,
  DIRECTION_KEY,
  DIRECTION_LABEL,
} from "@/lib/directions";
import { nextMultiplier } from "@/lib/engine";
import { cn } from "@/lib/cn";
import { formatMultiplier } from "@/lib/format";
import type { Direction } from "@/lib/types";
import { useGameStore } from "@/store/game-store";

const PLACEMENT: Record<Direction, string> = {
  UP: "col-start-2 row-start-1",
  LEFT: "col-start-1 row-start-2",
  RIGHT: "col-start-3 row-start-2",
  DOWN: "col-start-2 row-start-3",
};

const PAD_ORDER: readonly Direction[] = ["UP", "LEFT", "RIGHT", "DOWN"];

export function DirectionPad() {
  const phase = useGameStore((state) => state.phase);
  const streak = useGameStore((state) => state.streak);
  const submit = useGameStore((state) => state.submit);
  const multiplier = nextMultiplier(streak);

  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-sm grid-cols-3 grid-rows-3 gap-2.5",
        phase !== "playing" && "pointer-events-none",
      )}
    >
      {PAD_ORDER.map((direction) => (
        <PadButton
          key={direction}
          direction={direction}
          onPress={() => submit(direction)}
        />
      ))}
      <div className="col-start-2 row-start-2 grid place-items-center rounded-2xl border border-stroke bg-ink/50">
        <span className="font-mono text-[10px] tracking-[0.18em] text-mist uppercase">
          Next
        </span>
        <span
          data-testid="next-multiplier"
          className={cn(
            "font-mono text-xl tabular-nums",
            streak >= 3 ? "text-gold" : "text-paper",
          )}
        >
          {formatMultiplier(multiplier)}
        </span>
      </div>
    </div>
  );
}

function PadButton({
  direction,
  onPress,
}: {
  direction: Direction;
  onPress: () => void;
}) {
  const feedback = useGameStore((state) => state.feedback);
  const lastInput = useGameStore((state) => state.lastInput);
  const pressed = lastInput === direction;
  const state = pressed && feedback ? feedback : "idle";

  return (
    <button
      type="button"
      data-testid={`pad-${direction.toLowerCase()}`}
      data-state={state}
      aria-label={DIRECTION_LABEL[direction]}
      aria-keyshortcuts={DIRECTION_KEY[direction]}
      className={cn(
        "pad-button flex h-16 flex-col items-center justify-center rounded-2xl border border-stroke bg-paper/[0.04] text-paper select-none touch-manipulation sm:h-[4.35rem]",
        PLACEMENT[direction],
        "hover:bg-paper/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper/80",
        "data-[state=correct]:border-signal data-[state=correct]:bg-signal/15 data-[state=correct]:text-signal",
        "data-[state=incorrect]:border-flare data-[state=incorrect]:bg-flare/15 data-[state=incorrect]:text-flare",
      )}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        onPress();
      }}
      onClick={onPress}
    >
      <span className="font-mono text-lg leading-none">{DIRECTION_GLYPH[direction]}</span>
      <span className="mt-1 font-mono text-[10px] tracking-[0.16em] uppercase">
        {DIRECTION_LABEL[direction]}
      </span>
    </button>
  );
}
