import { cn } from "@/lib/cn";
import type { TileMark } from "@/types/solver";

const SYMBOL: Record<Exclude<TileMark, null>, string> = {
  green: "✓",
  yellow: "●",
  gray: "×",
};

export function LetterTile({
  letter,
  feedback,
  label,
  active,
  testId,
  onClick,
}: {
  letter: string;
  feedback: TileMark;
  label: string;
  active: boolean;
  testId: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "tile relative flex aspect-square items-center justify-center rounded-md font-mono text-2xl font-semibold uppercase transition-colors sm:text-3xl",
        feedback === "green" && "tile-correct",
        feedback === "yellow" && "tile-present",
        feedback === "gray" && "tile-absent",
        feedback === null && "tile-empty",
        active && feedback === null && "tile-active",
      )}
    >
      {letter}
      {feedback ? (
        <span aria-hidden className="absolute top-1 right-1.5 text-[10px] leading-none">
          {SYMBOL[feedback]}
        </span>
      ) : null}
    </button>
  );
}
