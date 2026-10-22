import type { Recommendation } from "@/types/solver";

export function RecommendationList({
  recommendations,
  solved,
  ready,
  onUse,
}: {
  recommendations: Recommendation[];
  solved: boolean;
  ready: boolean;
  onUse: (word: string) => void;
}) {
  return (
    <section aria-labelledby="next-guesses" className="rounded-2xl border border-stroke bg-panel/80 p-4">
      <h2 id="next-guesses" className="text-lg font-semibold">
        Best next guesses
      </h2>
      <p className="mt-1 text-sm text-mist">
        Suggestions are calculated from the remaining answers. They are not guaranteed to solve the puzzle.
      </p>
      {!ready ? (
        <p className="mt-4 text-sm text-mist">Loading the word lists…</p>
      ) : solved ? (
        <p className="mt-4 text-sm text-paper">No further guess is needed.</p>
      ) : recommendations.length === 0 ? (
        <p className="mt-4 text-sm text-mist">Recommendations appear when at least one answer still matches.</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {recommendations.map((item, index) => (
            <li key={item.word} className="rounded-xl border border-stroke px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-base tracking-wide uppercase" data-testid={`recommendation-${index}`}>
                  {item.word}
                </span>
                <button
                  type="button"
                  onClick={() => onUse(item.word)}
                  className="cursor-pointer rounded-full border border-stroke px-3 py-1 text-xs text-paper"
                >
                  Use
                </button>
              </div>
              <p className="mt-1 text-sm text-mist">
                {item.possibleAnswer ? "Possible answer. " : "Information guess. "}
                {item.reason}
                {item.expectedRemaining !== null
                  ? ` About ${formatRemaining(item.expectedRemaining)} words would remain on average.`
                  : ""}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function formatRemaining(value: number): string {
  if (value < 10) return value.toFixed(1);
  return Math.round(value).toString();
}
