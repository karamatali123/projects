"use client";

import { CandidateList } from "@/components/Solver/CandidateList";
import { FeedbackControls } from "@/components/Solver/FeedbackControls";
import { RecommendationList } from "@/components/Solver/RecommendationList";
import { SolverBoard } from "@/components/Solver/SolverBoard";
import { SolverHelp } from "@/components/Solver/SolverHelp";
import { VirtualKeyboard } from "@/components/Solver/VirtualKeyboard";
import type { SolverController } from "@/hooks/useSolver";
import { feedbackLabel } from "@/lib/feedback";

export function ClassicSolver({ solver }: { solver: SolverController }) {
  const hasGuesses = solver.rows.some((row) => row.submitted);

  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4">
        {solver.ready ? null : <p className="text-sm text-mist">Loading the word lists…</p>}
        <SolverBoard
          rows={solver.rows}
          activeRow={solver.activeRow}
          tileLabel={(_letter, feedback) => feedbackLabel(feedback)}
          onSelect={solver.selectRow}
          onCycle={solver.cycleTile}
        />
        <p data-testid="notice" role="status" className="min-h-5 text-sm text-paper">
          {solver.notice}
        </p>
        <FeedbackControls
          onSubmit={solver.submit}
          onUndo={solver.undo}
          onReset={solver.reset}
          canUndo={solver.canUndo}
        />
        <VirtualKeyboard
          marks={solver.marks}
          onLetter={solver.typeLetter}
          onBackspace={solver.backspace}
          onSubmit={solver.submit}
        />
        <SolverHelp />
      </div>
      <div className="space-y-4">
        <CandidateList
          candidates={solver.candidates}
          totalAnswers={solver.answerCount}
          hasGuesses={hasGuesses}
          ready={solver.ready}
          onUse={solver.applyRecommendation}
        />
        <RecommendationList
          recommendations={solver.recommendations}
          solved={solver.status === "solved"}
          ready={solver.ready}
          onUse={solver.applyRecommendation}
        />
        <DictionaryNote solver={solver} />
      </div>
    </div>
  );
}

export function DictionaryNote({ solver }: { solver: SolverController }) {
  return (
    <p className="text-xs leading-5 text-mist">
      {solver.ready
        ? solver.frequencyOrdered
          ? `${solver.answerCount.toLocaleString("en-US")} common answers and ${solver.allowedCount.toLocaleString("en-US")} allowed guesses. `
          : `${solver.answerCount.toLocaleString("en-US")} words of ${solver.wordLength} letters from the Webster list, including regular endings such as -ed and -ing. `
        : "The word lists are loading. "}
      This is not the official puzzle list, and it is not affiliated with The New York Times.
    </p>
  );
}
