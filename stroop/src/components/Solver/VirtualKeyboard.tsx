import { cn } from "@/lib/cn";
import type { Feedback } from "@/types/solver";

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

export function VirtualKeyboard({
  marks,
  onLetter,
  onBackspace,
  onSubmit,
}: {
  marks: Partial<Record<string, Feedback>>;
  onLetter: (letter: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="grid w-full max-w-[22rem] gap-1.5" aria-label="Keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={row} className="flex justify-center gap-1">
          {rowIndex === 2 ? <WideKey label="Enter" onClick={onSubmit} /> : null}
          {row.split("").map((letter) => (
            <button
              key={letter}
              type="button"
              data-testid={`keyboard-${letter}`}
              aria-label={keyLabel(letter, marks[letter])}
              onClick={() => onLetter(letter)}
              className={cn(
                "h-11 min-w-0 flex-1 rounded-md font-mono text-sm font-semibold uppercase",
                markClass(marks[letter]),
              )}
            >
              {letter}
            </button>
          ))}
          {rowIndex === 2 ? <WideKey label="Delete" onClick={onBackspace} /> : null}
        </div>
      ))}
    </div>
  );
}

function WideKey({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 shrink rounded-md bg-paper/10 px-1.5 font-mono text-[10px] font-semibold tracking-wide text-paper uppercase sm:px-2 sm:text-[11px]"
    >
      {label}
    </button>
  );
}

function keyLabel(letter: string, mark: Feedback | undefined): string {
  if (mark === "green") return `${letter}, correct spot`;
  if (mark === "yellow") return `${letter}, in the word`;
  if (mark === "gray") return `${letter}, counted or absent`;
  return letter;
}

function markClass(mark: Feedback | undefined): string {
  if (mark === "green") return "tile-correct";
  if (mark === "yellow") return "tile-present";
  if (mark === "gray") return "tile-absent";
  return "bg-paper/10 text-paper";
}
