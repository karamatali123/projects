"use client";

import { useState } from "react";
import { ClassicSolver } from "@/components/Solver/ClassicSolver";
import { ClueFinder } from "@/components/Solver/ClueFinder";
import { MethodSelector } from "@/components/Solver/MethodSelector";
import { SmartGuessAssistant } from "@/components/Solver/SmartGuessAssistant";
import { WordLengthControl } from "@/components/Solver/WordLengthControl";
import { useSolver } from "@/hooks/useSolver";
import type { SolverMode } from "@/types/solver";

export function SolverApp() {
  const solver = useSolver();
  const [mode, setMode] = useState<SolverMode>("classic");

  if (solver.loadError) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-10" role="alert">
        <p className="text-paper">{solver.loadError}</p>
        <button
          type="button"
          onClick={solver.retry}
          className="mt-3 h-11 cursor-pointer rounded-full bg-paper px-5 text-sm font-semibold text-ink"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <WordLengthControl value={solver.wordLength} onChange={solver.setWordLength} />
      <p className="mt-4 max-w-2xl text-base leading-7 text-mist">
        Find the words that still fit your green, yellow, and gray feedback. This Wordle helper is a Wordle finder for
        the puzzle you are already playing: enter the guess, mark the colors, and the list narrows in your browser.
        That is the Wordle help on this page. It uses only the feedback you supply.
      </p>
      <div className="pt-6">
      <MethodSelector mode={mode} onChange={setMode} />
      {mode === "classic" ? <ClassicSolver solver={solver} /> : null}
      {mode === "smart" ? <SmartGuessAssistant solver={solver} /> : null}
      {mode === "clues" ? (
        <ClueFinder key={solver.wordLength} answers={solver.answers} ready={solver.ready} wordLength={solver.wordLength} />
      ) : null}
      </div>
    </div>
  );
}
