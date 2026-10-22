import { GuessRow } from "@/components/Solver/GuessRow";
import type { RowState, TileMark } from "@/types/solver";

export function GuessHistory({
  rows,
  activeRow,
  tileLabel,
  onSelect,
  onCycle,
}: {
  rows: RowState[];
  activeRow: number;
  tileLabel: (letter: string, feedback: TileMark) => string;
  onSelect: (index: number) => void;
  onCycle: (rowIndex: number, tileIndex: number) => void;
}) {
  const submitted = rows
    .map((row, index) => ({ row, index }))
    .filter((item) => item.row.submitted && item.index !== activeRow);

  if (submitted.length === 0) return null;

  const length = submitted[0]?.row.letters.length ?? 5;

  return (
    <section
      aria-label="Guess history"
      className="w-full max-w-full space-y-2 overflow-x-auto"
      style={{ maxWidth: `${length * 3.25}rem` }}
    >
      <h2 className="text-sm font-medium">Previous guesses</h2>
      {submitted.map(({ row, index }) => (
        <GuessRow
          key={index}
          row={row}
          rowIndex={index}
          active={false}
          tileLabel={tileLabel}
          onSelect={() => onSelect(index)}
          onCycle={(tileIndex) => onCycle(index, tileIndex)}
        />
      ))}
      <p className="text-xs leading-5 text-mist">Click a tile to correct its color. The list updates immediately.</p>
    </section>
  );
}
