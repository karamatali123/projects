import assert from "node:assert/strict";
import test from "node:test";
import { conflictingClueLetters, filterByClues } from "../src/lib/filterClues";

const answers = ["alarm", "aroma", "crane", "apple", "slate"];

test("keeps words that match fixed positions and required letters", () => {
  const matches = filterByClues(answers, {
    positions: [null, null, "a", null, null],
    included: "r",
    excluded: "cne",
  });
  assert.deepEqual(matches, ["alarm"]);
});

test("removes words that use an excluded letter", () => {
  const matches = filterByClues(answers, {
    positions: [null, null, null, null, null],
    included: "",
    excluded: "a",
  });
  assert.deepEqual(matches, []);
});

test("does not ban a letter that is also required", () => {
  const query = {
    positions: ["a", null, null, null, null],
    included: "",
    excluded: "a",
  };
  assert.deepEqual(conflictingClueLetters(query), ["a"]);
  assert.deepEqual(filterByClues(["apple", "crane"], query), ["apple"]);
});

test("uses the position list length instead of assuming five letters", () => {
  const matches = filterByClues(["word", "worm", "words"], {
    positions: ["w", null, null, "d"],
    included: "",
    excluded: "m",
  });
  assert.deepEqual(matches, ["word"]);
});

test("returns an empty list instead of inventing a word", () => {
  assert.deepEqual(
    filterByClues(answers, {
      positions: ["z", "z", "z", "z", "z"],
      included: "",
      excluded: "",
    }),
    [],
  );
});
