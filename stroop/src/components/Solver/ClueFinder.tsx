"use client";

import { useMemo, useState } from "react";
import { conflictingClueLetters, filterByClues } from "@/lib/filterClues";
import type { WordLength } from "@/types/solver";

const PREVIEW = 48;

export function ClueFinder({
  answers,
  ready,
  wordLength,
}: {
  answers: readonly string[];
  ready: boolean;
  wordLength: WordLength;
}) {
  const [positions, setPositions] = useState<string[]>(() => Array.from({ length: wordLength }, () => ""));
  const [included, setIncluded] = useState("");
  const [excluded, setExcluded] = useState("");
  const [expanded, setExpanded] = useState(false);

  const query = useMemo(
    () => ({
      positions: positions.map((letter) => (letter ? letter : null)),
      included,
      excluded,
    }),
    [excluded, included, positions],
  );
  const conflicts = useMemo(() => conflictingClueLetters(query), [query]);
  const matches = useMemo(
    () => (ready ? filterByClues(answers, query) : []),
    [answers, query, ready],
  );
  const visible = expanded ? matches : matches.slice(0, PREVIEW);
  const hasClues = positions.some(Boolean) || included.length > 0 || excluded.length > 0;

  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]">
      <form className="min-w-0 space-y-4" onSubmit={(event) => event.preventDefault()}>
        <p className="text-sm leading-6 text-mist">
          Use this when you know some letters but do not want to re-enter every guess. It matches fixed positions,
          letters that must appear, and letters that must not. The {wordLength} boxes follow the selected word length.
          Repeated-letter counts are more accurate in Classic Solver or Smart Guess Assistant.
        </p>
        <fieldset>
          <legend className="text-sm font-medium">Known positions</legend>
          <div className="mt-2 w-full max-w-full overflow-x-auto" style={{ maxWidth: `${wordLength * 3.25}rem` }}>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${wordLength}, minmax(2.75rem, 1fr))`,
                minWidth: `${wordLength * 2.75}rem`,
              }}
            >
            {positions.map((letter, index) => (
              <input
                key={index}
                aria-label={`Position ${index + 1}`}
                value={letter}
                maxLength={1}
                onChange={(event) => {
                  const next = event.target.value.toLowerCase().replace(/[^a-z]/g, "");
                  setPositions((current) => current.map((value, slot) => (slot === index ? next : value)));
                }}
                className="h-14 rounded-md border border-stroke bg-ink text-center font-mono text-xl uppercase"
              />
            ))}
            </div>
          </div>
        </fieldset>
        <label className="block text-sm">
          Letters in the word
          <input
            value={included}
            onChange={(event) => setIncluded(event.target.value.toLowerCase().replace(/[^a-z]/g, ""))}
            className="mt-1 h-11 w-full rounded-lg border border-stroke bg-ink px-3 font-mono uppercase"
          />
        </label>
        <label className="block text-sm">
          Letters not in the word
          <input
            value={excluded}
            onChange={(event) => setExcluded(event.target.value.toLowerCase().replace(/[^a-z]/g, ""))}
            className="mt-1 h-11 w-full rounded-lg border border-stroke bg-ink px-3 font-mono uppercase"
          />
        </label>
        {conflicts.length > 0 ? (
          <p className="text-sm text-paper" role="status">
            {conflicts.join(", ").toUpperCase()} is both required and excluded. The required letter is kept.
          </p>
        ) : null}
      </form>
      <section aria-labelledby="clue-matches" className="rounded-2xl border border-stroke bg-panel/80 p-4">
        <div className="flex items-end justify-between gap-3">
          <h2 id="clue-matches" className="text-lg font-semibold">
            Matching words
          </h2>
          <p className="font-mono text-sm text-mist tabular-nums">{ready ? matches.length : "…"}</p>
        </div>
        {!ready ? (
          <p className="mt-3 text-sm text-mist">Loading the word lists…</p>
        ) : matches.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-paper">
            {hasClues
              ? "No words match these clues. Check a position or a letter you marked as absent."
              : "Add a known letter to start the list."}
          </p>
        ) : (
          <>
            <ul className="mt-4 flex max-h-80 min-h-24 flex-wrap gap-2 overflow-y-auto">
              {visible.map((word) => (
                <li key={word} className="rounded-md border border-stroke px-2 py-1 font-mono text-sm uppercase">
                  {word}
                </li>
              ))}
            </ul>
            {matches.length > PREVIEW ? (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="mt-3 cursor-pointer text-sm text-mist underline-offset-4 hover:underline"
              >
                {expanded ? "Show fewer" : `Show all ${matches.length}`}
              </button>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
