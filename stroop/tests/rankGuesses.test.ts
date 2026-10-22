import assert from "node:assert/strict";
import test from "node:test";
import { rankGuesses } from "../src/lib/rankGuesses";

test("returns the only remaining answer", () => {
  const ranked = rankGuesses(["apple"], ["apple", "alley", "crane"]);
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0]?.word, "apple");
  assert.equal(ranked[0]?.expectedRemaining, 0);
  assert.equal(ranked[0]?.possibleAnswer, true);
});

test("ranks opening guesses by distinct common letters", () => {
  const ranked = rankGuesses(["aaaaa", "aaaab"], ["bbbbb", "aaaaa", "aaaab"], {
    informationLimit: 0,
  });
  assert.equal(ranked[0]?.word, "aaaab");
  assert.equal(ranked[0]?.possibleAnswer, true);
  assert.equal(ranked[0]?.expectedRemaining, null);
  assert.equal(ranked.at(-1)?.word, "bbbbb");
});

test("orders information guesses by expected remaining candidates", () => {
  const candidates = ["abcde", "abxyz", "fghij"];
  const allowed = [...candidates, "abcxy", "zzzzz"];
  const ranked = rankGuesses(candidates, allowed, { limit: 8 });
  assert.ok(ranked.length > 1);
  const adjusted = ranked.map(
    (item) => (item.expectedRemaining ?? 0) - (item.possibleAnswer ? 0.35 : 0),
  );
  for (let index = 1; index < adjusted.length; index += 1) {
    assert.ok((adjusted[index] ?? 0) >= (adjusted[index - 1] ?? 0) - 1e-9);
  }
  assert.ok(ranked.every((item) => item.reason.length > 0));
  assert.ok((ranked[0]?.expectedRemaining ?? 99) < 3);
});

test("returns nothing when no answers remain", () => {
  assert.deepEqual(rankGuesses([], ["crane"]), []);
});

test("ranks the same inputs the same way every time", () => {
  const candidates = ["aaaaa", "aaaab"];
  const allowed = ["aaaaa", "aaaab", "bbbbb"];
  const first = rankGuesses(candidates, allowed);
  const second = rankGuesses(candidates, allowed);
  assert.deepEqual(first, second);
  assert.equal(first[0]?.word, "aaaaa");
  assert.equal(first[0]?.expectedRemaining, 0.5);
  assert.ok(allowed.includes(first[0]?.word ?? ""));
});
