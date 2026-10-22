import assert from "node:assert/strict";
import test from "node:test";
import { encodePattern, matchesHistory, scoreGuess } from "../src/lib/feedback";

const green = "green" as const;
const yellow = "yellow" as const;
const gray = "gray" as const;

test("scores exact matches before misplaced letters", () => {
  assert.deepEqual(scoreGuess("crane", "crane"), [green, green, green, green, green]);
  assert.deepEqual(scoreGuess("bbbbb", "aaaaa"), [gray, gray, gray, gray, gray]);
  assert.deepEqual(scoreGuess("abbbb", "baaaa"), [yellow, yellow, gray, gray, gray]);
  assert.deepEqual(scoreGuess("abbbb", "abbba"), [green, green, green, green, gray]);
});

test("scores repeated letters with the two-pass rule", () => {
  assert.deepEqual(scoreGuess("apple", "alley"), [green, yellow, gray, yellow, gray]);
  assert.deepEqual(scoreGuess("APPLE", "Alley"), [green, yellow, gray, yellow, gray]);
  assert.equal(encodePattern(scoreGuess("apple", "alley")), "GYXYX");
});

test("matches a candidate only when every tile agrees", () => {
  const history = [
    {
      word: "alley",
      feedback: [green, yellow, gray, yellow, gray],
    },
  ];
  assert.equal(matchesHistory("apple", history), true);
  assert.equal(matchesHistory("allow", history), false);
});
