export function SolverExplanation() {
  return (
    <details className="w-full max-w-[22rem] rounded-xl border border-stroke px-3 py-2 text-sm text-mist">
      <summary className="cursor-pointer font-medium text-paper">How Smart Guess Assistant works</summary>
      <div className="mt-3 space-y-3 leading-6">
        <p>
          Smart Guess Assistant narrows down the possible answers using the clues you provide. First, it removes
          words that do not match your green, yellow, and gray letters. Next, it evaluates possible guesses to see
          how effectively they could separate the remaining answers. It recommends a word that is likely to give you
          useful new information. After you enter the feedback from that guess, it repeats the process until you find
          the answer or have enough information to identify it.
        </p>
        <h3 className="font-medium text-paper">Why the best guess may not be the answer</h3>
        <p>
          Sometimes the most useful guess is not one of the remaining possible answers. It may be a word that helps
          distinguish between several candidates by revealing which letters are present.
        </p>
        <h3 className="font-medium text-paper">Why feedback matters</h3>
        <p>
          Every accurate feedback pattern eliminates inconsistent words. Incorrect feedback can remove the real
          answer from the candidate list, so always enter the colors exactly as they appear in your game.
        </p>
        <h3 className="font-medium text-paper">Why the solver may show multiple possible answers</h3>
        <p>
          If several words match all the clues, the available information may not be enough to identify one answer
          yet. Try the recommended guess and enter its feedback to narrow down the list.
        </p>
        <h3 className="font-medium text-paper">How repeated letters work</h3>
        <p>
          Words can contain the same letter more than once. The feedback depends on how many copies of each letter
          are in the answer and where they occur. The solver accounts for these rules by comparing the full color
          pattern, not each tile on its own.
        </p>
      </div>
    </details>
  );
}
