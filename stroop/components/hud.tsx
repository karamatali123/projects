"use client";

import { formatClock, formatScore, timeFraction } from "@/lib/format";
import { useGameStore } from "@/store/game-store";
import { Kicker } from "@/components/kicker";
import { Mark } from "@/components/mark";

export function Hud() {
  const score = useGameStore((state) => state.score);
  const streak = useGameStore((state) => state.streak);
  const timeLeft = useGameStore((state) => state.timeLeft);
  const highScore = useGameStore((state) => state.highScore);
  const feedback = useGameStore((state) => state.feedback);
  const lastGain = useGameStore((state) => state.lastGain);
  const round = useGameStore((state) => state.puzzle?.round ?? 0);
  const lowTime = timeLeft <= 10;
  const recordPace = score > highScore && score > 0;

  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Mark />
          <Kicker>Semantic Paradox</Kicker>
        </div>
        <div className="relative mt-3">
          {feedback === "correct" && lastGain > 0 ? (
            <span
              key={score}
              className="absolute -top-4 left-0 font-mono text-sm text-signal motion-safe:animate-rise"
            >
              +{formatScore(lastGain)}
            </span>
          ) : null}
          <p
            data-testid="score"
            className="font-mono text-4xl tabular-nums tracking-tight text-paper"
          >
            {formatScore(score)}
          </p>
        </div>
        <p className="mt-1 font-mono text-xs tracking-[0.14em] text-mist uppercase">
          Streak <span data-testid="streak">{streak}</span>
          <span className="mx-2 text-mist/40">/</span>
          Round {round}
        </p>
        {recordPace ? (
          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
            Record pace
          </p>
        ) : null}
      </div>
      <div className="text-right">
        <p
          data-testid="time-left"
          className={`font-mono text-4xl tabular-nums tracking-tight ${lowTime ? "text-flare" : "text-paper"}`}
        >
          {formatClock(timeLeft)}
        </p>
        <Kicker className="mt-1">Seconds</Kicker>
        <div
          className="mt-3 ml-auto h-1.5 w-28 overflow-hidden rounded-full bg-paper/10"
          aria-hidden
        >
          <div
            className={`h-full w-full origin-left transition-transform duration-100 ease-linear ${lowTime ? "bg-flare" : "bg-signal"}`}
            style={{ transform: `scaleX(${timeFraction(timeLeft)})` }}
          />
        </div>
      </div>
    </header>
  );
}
