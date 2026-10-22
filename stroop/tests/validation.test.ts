import assert from "node:assert/strict";
import test from "node:test";
import { validateGuess } from "../src/lib/validation";

const allowed = new Set(["crane", "slate"]);
const marked = ["gray", "yellow", "green", "gray", "gray"] as const;

test("rejects empty, short, long, and non-letter guesses", () => {
  assert.equal(validateGuess("", marked, allowed, 5), "Enter a 5-letter word.");
  assert.equal(validateGuess("crane1", marked, allowed, 5), "Use letters only.");
  assert.equal(validateGuess("cat", marked, allowed, 5), "Finish the 5-letter word before submitting.");
  assert.equal(validateGuess("cranes", marked, allowed, 5), "Guesses must be 5 letters.");
  assert.equal(validateGuess("cat", ["gray", "yellow", "green", null], allowed, 4), "Finish the 4-letter word before submitting.");
});

test("rejects unknown words and unmarked tiles", () => {
  assert.equal(
    validateGuess("fuzzy", marked, allowed, 5),
    "That word is not in the guess dictionary.",
  );
  assert.equal(
    validateGuess("crane", ["gray", "yellow", "green", "gray", null], allowed, 5),
    "Mark every tile before submitting.",
  );
  assert.equal(validateGuess("CRANE", marked, allowed, 5), "Use letters only.");
  assert.equal(validateGuess("crane", marked, allowed, 5), null);
});
