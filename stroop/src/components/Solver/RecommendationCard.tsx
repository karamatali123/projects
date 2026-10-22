import type { Recommendation } from "@/types/solver";

export function RecommendationCard({
  recommendation,
  alternatives,
  count,
  solved,
  empty,
  ready,
  hasGuesses,
  onUse,
}: {
  recommendation: Recommendation | null;
  alternatives: Recommendation[];
  count: number;
  solved: boolean;
  empty: boolean;
  ready: boolean;
  hasGuesses: boolean;
  onUse: (word: string) => void;
}) {
  return (
    <section aria-labelledby="best-next-guess" className="rounded-2xl border border-stroke bg-panel/80 p-4">
      <div className="flex items-end justify-between gap-3">
        <h2 id="best-next-guess" className="text-lg font-semibold">
          {solved ? "Matching answer" : "Your best next guess"}
        </h2>
        <p data-testid="smart-candidate-count" className="font-mono text-sm text-mist tabular-nums">
          {ready && hasGuesses ? count : "…"}
        </p>
      </div>
      {!ready ? (
        <p className="mt-3 text-sm text-mist">Loading the word lists…</p>
      ) : !hasGuesses ? (
        <p className="mt-3 text-sm leading-6 text-mist">
          Analyze a guess to see how many answers remain and which word to try next.
        </p>
      ) : empty ? (
        <p className="mt-3 text-sm leading-6 text-paper" data-testid="smart-no-candidates">
          No words match the feedback entered so far. Check your previous guesses and tile colors, especially
          feedback involving repeated letters.
        </p>
      ) : recommendation ? (
        <div className="mt-4">
          <p className="font-mono text-3xl tracking-[0.2em] uppercase" data-testid="best-next-guess-word">
            {recommendation.word}
          </p>
          <p className="mt-2 text-sm leading-6 text-mist">
            {recommendation.possibleAnswer ? "Possible answer. " : "Recommended guess. "}
            {recommendation.reason}
            {recommendation.expectedRemaining !== null
              ? ` About ${formatRemaining(recommendation.expectedRemaining)} answers would remain on average.`
              : ""}
          </p>
          <p className="mt-2 text-xs leading-5 text-mist">
            {count.toLocaleString("en-US")} possible {count === 1 ? "answer" : "answers"}. This is a calculated
            suggestion, not a guaranteed win.
          </p>
          {solved ? null : (
            <button
              type="button"
              onClick={() => onUse(recommendation.word)}
              className="mt-4 h-11 cursor-pointer rounded-full bg-paper px-4 text-sm font-semibold text-ink"
            >
              Enter this guess
            </button>
          )}
          {alternatives.length > 0 && !solved ? (
            <div className="mt-5">
              <h3 className="text-sm font-medium">Other useful guesses</h3>
              <ul className="mt-2 space-y-2">
                {alternatives.map((item) => (
                  <li key={item.word} className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm uppercase">{item.word}</span>
                    <button
                      type="button"
                      onClick={() => onUse(item.word)}
                      className="cursor-pointer rounded-full border border-stroke px-3 py-1 text-xs text-paper"
                    >
                      Use
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm text-mist">No further guess is needed.</p>
      )}
    </section>
  );
}

function formatRemaining(value: number): string {
  if (value < 10) return value.toFixed(1);
  return Math.round(value).toString();
}
