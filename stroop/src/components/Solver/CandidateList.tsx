"use client";

import { useState } from "react";

const PREVIEW = 48;

export function CandidateList({
  candidates,
  totalAnswers,
  hasGuesses,
  ready,
  onUse,
}: {
  candidates: string[];
  totalAnswers: number;
  hasGuesses: boolean;
  ready: boolean;
  onUse: (word: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? candidates : candidates.slice(0, PREVIEW);

  return (
    <section aria-labelledby="possible-answers" className="rounded-2xl border border-stroke bg-panel/80 p-4">
      <div className="flex items-end justify-between gap-3">
        <h2 id="possible-answers" className="text-lg font-semibold">
          Possible answers
        </h2>
        <p data-testid="candidate-count" className="font-mono text-sm text-mist tabular-nums">
          {ready ? (hasGuesses ? candidates.length : totalAnswers) : "…"}
        </p>
      </div>
      <p className="mt-1 text-sm text-mist">
        {hasGuesses
          ? "Words that would have produced every color pattern you entered."
          : "The full answer list, before any feedback. Common words are listed first."}
      </p>
      {!ready ? (
        <p className="mt-4 text-sm text-mist">Loading the word lists…</p>
      ) : candidates.length === 0 ? (
        <p className="mt-4 text-sm text-paper" data-testid="no-candidates">
          No matching answers found.
        </p>
      ) : (
        <>
          <ul className="mt-4 flex max-h-80 min-h-24 flex-wrap gap-2 overflow-y-auto">
            {visible.map((word) => (
              <li key={word}>
                <button
                  type="button"
                  onClick={() => onUse(word)}
                  className="cursor-pointer rounded-md border border-stroke px-2 py-1 font-mono text-sm tracking-wide text-paper uppercase hover:border-paper/40"
                >
                  {word}
                </button>
              </li>
            ))}
          </ul>
          {candidates.length > PREVIEW ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-3 cursor-pointer text-sm text-mist underline-offset-4 hover:underline"
            >
              {expanded ? "Show fewer" : `Show all ${candidates.length}`}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}
