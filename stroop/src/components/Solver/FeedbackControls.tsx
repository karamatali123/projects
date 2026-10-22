export function FeedbackControls({
  onSubmit,
  onUndo,
  onReset,
  canUndo,
  submitLabel = "Submit feedback",
  submitTestId = "submit-guess",
}: {
  onSubmit: () => void;
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
  submitLabel?: string;
  submitTestId?: string;
}) {
  return (
    <div className="w-full max-w-[22rem] space-y-3">
      <ul className="grid grid-cols-3 gap-2 text-[11px] text-mist">
        <li className="flex items-center gap-1.5">
          <span className="tile-absent grid h-5 w-5 place-items-center rounded font-mono text-[10px]">×</span>
          Absent
        </li>
        <li className="flex items-center gap-1.5">
          <span className="tile-present grid h-5 w-5 place-items-center rounded font-mono text-[10px]">●</span>
          Wrong spot
        </li>
        <li className="flex items-center gap-1.5">
          <span className="tile-correct grid h-5 w-5 place-items-center rounded font-mono text-[10px]">✓</span>
          Correct spot
        </li>
      </ul>
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <button
          type="button"
          data-testid={submitTestId}
          onClick={onSubmit}
          className="h-11 cursor-pointer rounded-full bg-paper text-sm font-semibold text-ink"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          data-testid="undo"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-11 cursor-pointer rounded-full border border-stroke px-4 text-sm text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Undo
        </button>
        <button
          type="button"
          data-testid="reset"
          onClick={onReset}
          className="h-11 cursor-pointer rounded-full border border-stroke px-4 text-sm text-paper"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
