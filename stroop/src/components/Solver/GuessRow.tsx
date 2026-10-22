import { LetterTile } from "@/components/Solver/LetterTile";
import { cn } from "@/lib/cn";
import type { RowState } from "@/types/solver";

export function GuessRow({
  row,
  rowIndex,
  active,
  tileLabel,
  onSelect,
  onCycle,
}: {
  row: RowState;
  rowIndex: number;
  active: boolean;
  tileLabel: (letter: string, feedback: RowState["feedback"][number]) => string;
  onSelect: () => void;
  onCycle: (tileIndex: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label={`Guess ${rowIndex + 1}${active ? ", selected" : ""}`}
      onClick={onSelect}
      className={cn("grid gap-1.5 sm:gap-2", active && "rounded-lg")}
      style={{
        gridTemplateColumns: `repeat(${row.letters.length}, minmax(2.75rem, 1fr))`,
        minWidth: `${row.letters.length * 2.75}rem`,
      }}
    >
      {row.letters.map((letter, index) => (
        <LetterTile
          key={`${rowIndex}-${index}`}
          letter={letter}
          feedback={row.feedback[index] ?? null}
          active={active}
          testId={`tile-${rowIndex}-${index}`}
          label={`Row ${rowIndex + 1}, letter ${index + 1}, ${letter || "empty"}, ${tileLabel(letter, row.feedback[index] ?? null)}`}
          onClick={() => onCycle(index)}
        />
      ))}
    </div>
  );
}
