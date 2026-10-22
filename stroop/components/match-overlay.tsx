"use client";

import {
  BASE_SCORE,
  ECHO_CHANCE,
  ECHO_LOOKBACK,
  LAW_MANUAL,
  LAW_SEQUENCE,
  MATCH_SECONDS,
  STREAK_BONUS,
} from "@/lib/engine";
import { accuracyPercent, formatScore } from "@/lib/format";
import { useGameStore } from "@/store/game-store";
import { Kicker } from "@/components/kicker";
import { Mark } from "@/components/mark";

export function MatchOverlay() {
  const phase = useGameStore((state) => state.phase);
  const highScore = useGameStore((state) => state.highScore);
  const highScoreReady = useGameStore((state) => state.highScoreReady);
  const isNewHighScore = useGameStore((state) => state.isNewHighScore);
  const lastRound = useGameStore((state) => state.lastRound);
  const startMatch = useGameStore((state) => state.startMatch);
  const finished = phase === "over" && lastRound !== null;

  return (
    <div className="flex h-full min-h-0 items-center justify-center">
      <section
        data-testid="overlay"
        className="motion-safe:animate-enter flex max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] border border-stroke bg-panel/92 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        <div className="min-h-0 overflow-y-auto px-6 pt-6 pb-5 sm:px-8 sm:pt-8">
        <div className="flex items-center gap-2">
          <Mark />
          <Kicker>{finished ? "Match complete" : `${MATCH_SECONDS}-second drill`}</Kicker>
        </div>
        <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
          Semantic Paradox
        </h1>

        {finished && lastRound ? (
          <RoundReport
            score={lastRound.score}
            bestStreak={lastRound.bestStreak}
            correctCount={lastRound.correctCount}
            answeredCount={lastRound.answeredCount}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
          />
        ) : (
          <p className="mt-3 max-w-md text-sm leading-6 text-mist">
            Read the law, then the word. Ink color sometimes lies and sometimes
            decides. Solve as many as you can before the minute ends.
          </p>
        )}

        <ol className="mt-6 space-y-3">
          {LAW_SEQUENCE.map((law, index) => {
            const manual = LAW_MANUAL[law];
            return (
              <li key={law} className="flex gap-3">
                <span className="mt-0.5 font-mono text-[11px] text-mist">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-paper">{manual.title}</p>
                  <p className="text-sm leading-5 text-mist">
                    {manual.directive}. {manual.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 space-y-2 text-sm leading-5 text-mist">
          <p>
            After two laws are on the board, each new prompt has a{" "}
            {Math.round(ECHO_CHANCE * 100)}% chance to echo. Echo mode discards
            the fresh law and restores the one from {ECHO_LOOKBACK} rounds ago.
          </p>
          <p>
            A correct answer scores {BASE_SCORE}. Every extra step in a streak
            adds {STREAK_BONUS}. A miss resets the streak to zero.
          </p>
        </div>

        </div>

        <div className="shrink-0 border-t border-stroke bg-panel px-6 pt-4 pb-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Kicker>Best</Kicker>
              {highScoreReady ? (
                <p data-testid="high-score" className="mt-1 font-mono text-2xl tabular-nums">
                  {highScore > 0 ? formatScore(highScore) : "—"}
                </p>
              ) : (
                <p className="mt-2 h-7 w-16 animate-pulse rounded-md bg-paper/10" />
              )}
            </div>
            {!finished && lastRound ? (
              <p className="text-right font-mono text-xs tracking-[0.08em] text-mist uppercase">
                Previous round
                <span className="mt-1 block text-base text-paper tabular-nums normal-case">
                  {formatScore(lastRound.score)}
                </span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            data-testid="start-match"
            autoFocus
            onClick={startMatch}
            className="mt-4 h-12 w-full cursor-pointer rounded-full bg-paper font-sans text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            {finished ? "Play again" : "Begin match"}
          </button>
          <p className="mt-2 pb-1 text-center font-mono text-[10px] tracking-[0.16em] text-mist uppercase">
            Enter starts · Arrow keys answer
          </p>
        </div>
      </section>
    </div>
  );
}

function RoundReport({
  score,
  bestStreak,
  correctCount,
  answeredCount,
  highScore,
  isNewHighScore,
}: {
  score: number;
  bestStreak: number;
  correctCount: number;
  answeredCount: number;
  highScore: number;
  isNewHighScore: boolean;
}) {
  const accuracy = accuracyPercent(correctCount, answeredCount);

  return (
    <div className="mt-5">
      <p
        data-testid="final-score"
        className="font-mono text-6xl tabular-nums tracking-tight text-paper"
      >
        {formatScore(score)}
      </p>
      <p
        className={`mt-1 font-mono text-[11px] tracking-[0.18em] uppercase ${isNewHighScore ? "text-gold" : "text-mist"}`}
      >
        {recordLine(score, highScore, isNewHighScore)}
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Solved" value={String(correctCount)} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Best streak" value={String(bestStreak)} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-stroke px-3 py-2">
      <dt className="font-mono text-[10px] tracking-[0.16em] text-mist uppercase">{label}</dt>
      <dd className="mt-1 font-mono text-lg tabular-nums text-paper">{value}</dd>
    </div>
  );
}

function recordLine(score: number, highScore: number, isNewHighScore: boolean): string {
  if (isNewHighScore) return "New record";
  if (score === 0 && highScore === 0) return "No score this round";
  if (score === highScore && score > 0) return "Matched your best";
  return `Best stays ${formatScore(highScore)}`;
}
