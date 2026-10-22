"use client";

import { DictionaryNote } from "@/components/Solver/ClassicSolver";
import { FeedbackControls } from "@/components/Solver/FeedbackControls";
import { GuessHistory } from "@/components/Solver/GuessHistory";
import { GuessRow } from "@/components/Solver/GuessRow";
import { RecommendationCard } from "@/components/Solver/RecommendationCard";
import { SolverExplanation } from "@/components/Solver/SolverExplanation";
import { VirtualKeyboard } from "@/components/Solver/VirtualKeyboard";
import type { SolverController } from "@/hooks/useSolver";
import { feedbackLabel } from "@/lib/feedback";

export function SmartGuessAssistant({ solver }: { solver: SolverController }) {
  const hasGuesses = solver.rows.some((row) => row.submitted);
  const entry = solver.rows[solver.activeRow];
  const primary = hasGuesses ? (solver.recommendations[0] ?? null) : null;
  const alternatives = hasGuesses ? solver.recommendations.slice(1, 4) : [];
  const editingSubmitted = entry?.submitted ?? false;

  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4">
        <p className="max-w-xl text-sm leading-6 text-mist">
          Let’s solve this together. Enter a {solver.wordLength}-letter word you have already guessed, then mark which
          letters turned green, yellow, or gray. We’ll use that information to recommend your next guess.
        </p>
        {solver.ready ? null : <p className="text-sm text-mist">Loading the word lists…</p>}
        <GuessHistory
          rows={solver.rows}
          activeRow={solver.activeRow}
          tileLabel={(_letter, feedback) => feedbackLabel(feedback)}
          onSelect={solver.selectRow}
          onCycle={solver.cycleTile}
        />
        {entry ? (
          <div
            className="w-full max-w-full space-y-2 overflow-x-auto"
            style={{ maxWidth: `${solver.wordLength * 3.25}rem` }}
          >
            <h2 className="text-sm font-medium">
              {editingSubmitted ? `Editing guess ${solver.activeRow + 1}` : hasGuesses ? "Next guess" : "Your guess"}
            </h2>
            <GuessRow
              row={entry}
              rowIndex={solver.activeRow}
              active
              tileLabel={(_letter, feedback) => feedbackLabel(feedback)}
              onSelect={() => solver.selectRow(solver.activeRow)}
              onCycle={(tileIndex) => solver.cycleTile(solver.activeRow, tileIndex)}
            />
          </div>
        ) : null}
        <p data-testid="smart-notice" role="status" className="min-h-5 max-w-[22rem] text-sm text-paper">
          {solver.notice}
        </p>
        <FeedbackControls
          onSubmit={solver.submit}
          onUndo={solver.undo}
          onReset={solver.reset}
          canUndo={solver.canUndo}
          submitLabel="Analyze my guess"
          submitTestId="analyze-guess"
        />
        <VirtualKeyboard
          marks={solver.marks}
          onLetter={solver.typeLetter}
          onBackspace={solver.backspace}
          onSubmit={solver.submit}
        />
        <SolverExplanation />
      </div>
      <div className="space-y-4">
        <RecommendationCard
          recommendation={primary}
          alternatives={alternatives}
          count={solver.candidates.length}
          solved={solver.status === "solved"}
          empty={hasGuesses && solver.candidates.length === 0}
          ready={solver.ready}
          hasGuesses={hasGuesses}
          onUse={solver.applyRecommendation}
        />
        <DictionaryNote solver={solver} />
      </div>
    </div>
  );
}
