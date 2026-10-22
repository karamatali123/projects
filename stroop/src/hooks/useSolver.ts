"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadDictionary, type Dictionary } from "@/lib/dictionary";
import { feedbackLabel, keyboardMarks, nextTile } from "@/lib/feedback";
import { filterCandidates, firstBreakingGuess } from "@/lib/filterCandidates";
import { rankGuesses } from "@/lib/rankGuesses";
import { validateGuess } from "@/lib/validation";
import type { Feedback, GuessResult, RowState, SolverStatus, WordLength } from "@/types/solver";
import { DEFAULT_WORD_LENGTH, isWordLength, ROW_COUNT } from "@/types/solver";

type Snapshot = {
  rows: RowState[];
  activeRow: number;
};

function emptyRow(length: number): RowState {
  return {
    letters: Array.from({ length }, () => ""),
    feedback: Array.from({ length }, () => null),
    submitted: false,
  };
}

function initialRows(length: number): RowState[] {
  return Array.from({ length: ROW_COUNT }, () => emptyRow(length));
}

function cloneRows(rows: readonly RowState[]): RowState[] {
  return rows.map((row) => ({
    letters: [...row.letters],
    feedback: [...row.feedback],
    submitted: row.submitted,
  }));
}

function wordOf(row: RowState): string {
  return row.letters.join("");
}

function historyFrom(rows: readonly RowState[]): GuessResult[] {
  return rows.flatMap((row) => {
    if (!row.submitted) return [];
    const feedback = row.feedback.filter((tile): tile is Feedback => tile !== null);
    if (feedback.length !== row.letters.length) return [];
    return [{ word: wordOf(row), feedback }];
  });
}

export function useSolver() {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [wordLength, setWordLengthState] = useState<WordLength>(DEFAULT_WORD_LENGTH);
  const [rows, setRows] = useState<RowState[]>(() => initialRows(DEFAULT_WORD_LENGTH));
  const [activeRow, setActiveRow] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [history, setHistory] = useState<Snapshot[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadDictionary(wordLength, reloadKey > 0)
      .then((next) => {
        if (!cancelled) setDictionary(next);
      })
      .catch(() => {
        if (!cancelled) {
          setDictionary(null);
          setLoadError("The word lists could not be loaded.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey, wordLength]);

  const guesses = useMemo(() => historyFrom(rows), [rows]);
  const candidates = useMemo(
    () => (dictionary ? filterCandidates(dictionary.answers, guesses) : []),
    [dictionary, guesses],
  );
  const recommendations = useMemo(
    () => (dictionary ? rankGuesses(candidates, dictionary.allowed) : []),
    [candidates, dictionary],
  );
  const winningGuess = guesses.find((guess) =>
    guess.feedback.every((tile) => tile === "green"),
  );
  const solvedInList = winningGuess ? candidates.includes(winningGuess.word) : false;
  const solvedOffList = Boolean(
    winningGuess && guesses.length === 1 && candidates.length === 0,
  );
  const solved = solvedInList || solvedOffList;
  const status: SolverStatus = solved
    ? "solved"
    : guesses.length > 0 && candidates.length === 0
      ? "inconsistent"
      : "editing";
  const breakingRow =
    status === "inconsistent" && dictionary
      ? firstBreakingGuess(dictionary.answers, guesses)
      : null;
  const marks = useMemo(() => keyboardMarks(guesses), [guesses]);

  const remember = useCallback((currentRows: RowState[], currentActive: number) => {
    setHistory((stack) => [
      ...stack.slice(-29),
      { rows: cloneRows(currentRows), activeRow: currentActive },
    ]);
  }, []);

  const typeLetter = useCallback(
    (letter: string) => {
      const normalized = letter.toLowerCase();
      if (!/^[a-z]$/.test(normalized)) return;
      const row = rows[activeRow];
      if (!row) return;
      const slot = row.letters.findIndex((value) => value === "");
      if (slot === -1) return;
      if (row.submitted) remember(rows, activeRow);
      setNotice(null);
      setRows((current) => {
        const next = cloneRows(current);
        const target = next[activeRow];
        if (!target) return current;
        const openSlot = target.letters.findIndex((value) => value === "");
        if (openSlot === -1) return current;
        target.submitted = false;
        target.letters[openSlot] = normalized;
        target.feedback[openSlot] = null;
        return next;
      });
    },
    [activeRow, remember, rows],
  );

  const backspace = useCallback(() => {
    const row = rows[activeRow];
    if (!row) return;
    const slot = row.letters.findLastIndex((value) => value !== "");
    if (slot === -1) return;
    if (row.submitted) remember(rows, activeRow);
    setNotice(null);
    setRows((current) => {
      const next = cloneRows(current);
      const target = next[activeRow];
      if (!target) return current;
      const openSlot = target.letters.findLastIndex((value) => value !== "");
      if (openSlot === -1) return current;
      target.letters[openSlot] = "";
      target.feedback[openSlot] = null;
      target.submitted = false;
      return next;
    });
  }, [activeRow, remember, rows]);

  const cycleTile = useCallback(
    (rowIndex: number, tileIndex: number) => {
      const row = rows[rowIndex];
      if (!row || row.letters[tileIndex] === "") return;
      if (row.submitted) remember(rows, activeRow);
      setNotice(null);
      setRows((current) => {
        const next = cloneRows(current);
        const target = next[rowIndex];
        if (!target || target.letters[tileIndex] === "") return current;
        target.feedback[tileIndex] = nextTile(target.feedback[tileIndex] ?? null);
        return next;
      });
      setActiveRow(rowIndex);
    },
    [activeRow, remember, rows],
  );

  const submit = useCallback(() => {
    if (!dictionary) {
      setNotice("The word lists are still loading.");
      return;
    }
    const row = rows[activeRow];
    if (!row) return;
    const word = wordOf(row);
    const problem = validateGuess(word, row.feedback, dictionary.allowedSet, wordLength);
    if (problem) {
      setNotice(problem);
      return;
    }
    const duplicate = rows.some(
      (other, index) => index !== activeRow && other.submitted && wordOf(other) === word,
    );
    if (duplicate) {
      setNotice("You already entered that word.");
      return;
    }

    remember(rows, activeRow);
    const next = cloneRows(rows);
    const target = next[activeRow];
    if (!target) return;
    target.submitted = true;
    const nextActive = next.findIndex((item) => !item.submitted);
    setRows(next);
    setActiveRow(nextActive === -1 ? activeRow : nextActive);
    setNotice(null);
  }, [activeRow, dictionary, remember, rows, wordLength]);

  const undo = useCallback(() => {
    setHistory((stack) => {
      const previous = stack[stack.length - 1];
      if (!previous) return stack;
      setRows(cloneRows(previous.rows));
      setActiveRow(previous.activeRow);
      setNotice(null);
      return stack.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    remember(rows, activeRow);
    setRows(initialRows(wordLength));
    setActiveRow(0);
    setNotice(null);
  }, [activeRow, remember, rows, wordLength]);

  const selectRow = useCallback(
    (index: number) => {
      const firstBlocked = rows.findIndex(
        (row, rowIndex) => rowIndex > 0 && !rows[rowIndex - 1]?.submitted && wordOf(row).length === 0,
      );
      const maxIndex = firstBlocked === -1 ? ROW_COUNT - 1 : Math.max(0, firstBlocked - 1);
      if (index < 0 || index > maxIndex) return;
      setActiveRow(index);
      setNotice(null);
    },
    [rows],
  );

  const applyRecommendation = useCallback(
    (word: string) => {
      const normalized = word.toLowerCase();
      if (normalized.length !== wordLength) return;
      let index = activeRow;
      if (rows[index]?.submitted) {
        const open = rows.findIndex((row) => !row.submitted);
        if (open === -1) {
          setNotice("Reset the board before trying another guess.");
          return;
        }
        index = open;
      }
      const row = rows[index];
      if (!row || row.submitted) return;
      remember(rows, activeRow);
      setRows((current) => {
        const next = cloneRows(current);
        const target = next[index];
        if (!target || target.submitted) return current;
        target.letters = normalized.split("");
        target.feedback = Array.from({ length: wordLength }, () => null);
        target.submitted = false;
        return next;
      });
      setActiveRow(index);
      setNotice("Mark this guess with the colors from your puzzle, then submit it.");
    },
    [activeRow, remember, rows, wordLength],
  );

  const setWordLength = useCallback(
    (next: number) => {
      if (!isWordLength(next) || next === wordLength) return;
      setWordLengthState(next);
      setDictionary(null);
      setRows(initialRows(next));
      setActiveRow(0);
      setHistory([]);
      setNotice(null);
    },
    [wordLength],
  );

  const retry = useCallback(() => {
    setLoadError(null);
    setReloadKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "Enter") {
        if (event.repeat) return;
        event.preventDefault();
        submit();
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
        return;
      }
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        typeLetter(event.key);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [backspace, submit, typeLetter]);

  const diagnostic =
    status === "inconsistent"
      ? breakingRow === null
        ? "No matching answers found. Check the colors on your guesses."
        : breakingRow === 0
          ? "No matching answers found. Row 1 does not match any answer in this list. Change a color and the list will update."
          : `No matching answers found. Row ${breakingRow + 1} conflicts with the rows above it. Change a color and the list will update.`
      : solvedOffList
        ? "Every tile is green. That word is not in this answer list."
        : solved
          ? "Every tile is green. This guess fits the answer."
          : null;
  const statusMessage = notice ?? diagnostic;

  return {
    wordLength,
    setWordLength,
    frequencyOrdered: dictionary?.frequencyOrdered ?? wordLength === DEFAULT_WORD_LENGTH,
    ready: dictionary !== null,
    loadError,
    retry,
    rows,
    activeRow,
    status,
    notice: statusMessage,
    candidates,
    recommendations,
    answers: dictionary?.answers ?? [],
    answerCount: dictionary?.answers.length ?? 0,
    allowedCount: dictionary?.allowed.length ?? 0,
    marks,
    canUndo: history.length > 0,
    typeLetter,
    backspace,
    cycleTile,
    submit,
    undo,
    reset,
    selectRow,
    applyRecommendation,
    tileLabel: feedbackLabel,
  };
}

export type SolverController = ReturnType<typeof useSolver>;
