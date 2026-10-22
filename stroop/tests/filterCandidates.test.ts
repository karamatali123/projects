import assert from "node:assert/strict";
import test from "node:test";
import { filterCandidates, firstBreakingGuess } from "../src/lib/filterCandidates";
import type { GuessResult } from "../src/types/solver";

const crane: GuessResult = {
  word: "crane",
  feedback: ["gray", "yellow", "green", "gray", "gray"],
};

test("keeps only answers that would produce the recorded pattern", () => {
  const answers = ["alarm", "aroma", "radar", "grace", "crane", "brake", "trace"];
  assert.deepEqual(filterCandidates(answers, [crane]), ["alarm"]);
});

test("keeps apple and rejects other repeated-letter near misses", () => {
  const history: GuessResult[] = [
    {
      word: "alley",
      feedback: ["green", "yellow", "gray", "yellow", "gray"],
    },
  ];
  assert.deepEqual(filterCandidates(["apple", "alley", "allow"], history), ["apple"]);
});

test("preserves answer order and combines every row", () => {
  const answers = ["trace", "alarm", "aroma"];
  const history: GuessResult[] = [
    crane,
    { word: "alarm", feedback: ["green", "green", "green", "green", "green"] },
  ];
  assert.deepEqual(filterCandidates(answers, []), answers);
  assert.deepEqual(filterCandidates(answers, history), ["alarm"]);
});

test("points at the first row that empties the list", () => {
  const history: GuessResult[] = [
    { word: "apple", feedback: ["green", "green", "green", "green", "green"] },
    { word: "apply", feedback: ["green", "green", "green", "green", "green"] },
  ];
  const answers = ["apple", "apply", "alley"];
  assert.deepEqual(filterCandidates(answers, history), []);
  assert.equal(firstBreakingGuess(answers, history), 1);
});
