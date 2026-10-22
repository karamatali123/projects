import { isWordLength, type WordLength } from "@/types/solver";

export function WordLengthControl({
  value,
  onChange,
}: {
  value: WordLength;
  onChange: (length: WordLength) => void;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-paper/40 bg-panel p-4">
      <label htmlFor="letters-per-word" className="block text-base font-semibold text-paper">
        Letters per word
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <input
          id="letters-per-word"
          type="number"
          inputMode="numeric"
          min={2}
          max={15}
          step={1}
          value={value}
          data-testid="word-length-input"
          aria-describedby="letters-per-word-help"
          onChange={(event) => {
            const next = Number(event.target.value);
            if (isWordLength(next)) onChange(next);
          }}
          className="h-14 w-28 rounded-xl border border-stroke bg-ink text-center font-mono text-3xl text-paper"
        />
        <p id="letters-per-word-help" className="max-w-md text-sm leading-6 text-mist">
          Type a number from 2 to 15. Classic Solver, Smart Guess Assistant, and Clue-Based Finder all use it.
          Changing it clears the current guesses.
        </p>
      </div>
    </div>
  );
}
