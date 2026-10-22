import { cn } from "@/lib/cn";
import type { SolverMode } from "@/types/solver";

const MODES: { id: SolverMode; label: string; detail: string }[] = [
  {
    id: "classic",
    label: "Classic Solver",
    detail: "Enter each guess and mark the colors yourself.",
  },
  {
    id: "smart",
    label: "Smart Guess Assistant",
    detail: "Get one next guess and a short explanation.",
  },
  {
    id: "clues",
    label: "Clue-Based Finder",
    detail: "Search from letters you know, without a full guess history.",
  },
];

export function MethodSelector({
  mode,
  onChange,
}: {
  mode: SolverMode;
  onChange: (mode: SolverMode) => void;
}) {
  return (
    <div className="mb-6" role="radiogroup" aria-label="Solving method">
      <div className="grid gap-2 sm:grid-cols-3">
        {MODES.map((item) => {
          const selected = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              data-testid={`mode-${item.id}`}
              onClick={() => onChange(item.id)}
              className={cn(
                "cursor-pointer rounded-2xl border px-3 py-3 text-left",
                selected ? "border-paper bg-paper/10" : "border-stroke",
              )}
            >
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="mt-1 block text-xs leading-5 text-mist">{item.detail}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
