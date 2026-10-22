export function SolverHelp() {
  return (
    <details className="w-full max-w-[22rem] rounded-xl border border-stroke px-3 py-2 text-sm text-mist">
      <summary className="cursor-pointer font-medium text-paper">How to mark a guess</summary>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        <li>Type a word of the selected length, or tap the keyboard.</li>
        <li>Click a tile to cycle absent, wrong spot, then correct spot.</li>
        <li>× means absent or already counted. ● means the letter is elsewhere. ✓ means the correct spot.</li>
        <li>Submit only after every tile has a mark. Edit an earlier row by selecting it.</li>
      </ul>
    </details>
  );
}
