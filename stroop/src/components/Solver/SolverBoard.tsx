import { GuessRow } from "@/components/Solver/GuessRow";
import type { RowState, TileMark } from "@/types/solver";

export function SolverBoard({
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
  const length = rows[0]?.letters.length ?? 5;

  return (
    <div
      className="grid w-full max-w-full gap-1.5 overflow-x-auto sm:gap-2"
      style={{ maxWidth: `${length * 3.25}rem` }}
      data-testid="solver-board"
    >
      {rows.map((row, index) => (
        <GuessRow
          key={index}
          row={row}
          rowIndex={index}
          active={index === activeRow}
          tileLabel={tileLabel}
          onSelect={() => onSelect(index)}
          onCycle={(tileIndex) => onCycle(index, tileIndex)}
        />
      ))}
    </div>
  );
}
