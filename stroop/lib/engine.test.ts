import assert from "node:assert/strict";
import test from "node:test";
import {
  createPuzzle,
  multiplierForStreak,
  nextMultiplier,
  pointsForStreak,
  resolveDirection,
  signalRelation,
  type RandomSource,
} from "./engine";
import type { LinguisticLaw } from "./types";

function sequence(values: readonly number[]): RandomSource {
  let index = 0;
  return {
    next() {
      const value = values[index];
      index += 1;
      if (value === undefined) {
        throw new Error(`Random source exhausted after ${values.length} draws.`);
      }
      return value;
    },
  };
}

test("standard follows the word and ignores ink", () => {
  assert.equal(resolveDirection("UP", "STANDARD", "emerald"), "UP");
  assert.equal(resolveDirection("DOWN", "STANDARD", "rose"), "DOWN");
  assert.equal(resolveDirection("LEFT", "STANDARD", "rose"), "LEFT");
  assert.equal(resolveDirection("RIGHT", "STANDARD", "emerald"), "RIGHT");
});

test("inversion swaps each direction with its opposite", () => {
  assert.equal(resolveDirection("UP", "INVERSION", "emerald"), "DOWN");
  assert.equal(resolveDirection("DOWN", "INVERSION", "rose"), "UP");
  assert.equal(resolveDirection("LEFT", "INVERSION", "emerald"), "RIGHT");
  assert.equal(resolveDirection("RIGHT", "INVERSION", "rose"), "LEFT");
});

test("color shift follows emerald and reverses rose", () => {
  assert.equal(resolveDirection("UP", "COLOR_SHIFT", "emerald"), "UP");
  assert.equal(resolveDirection("DOWN", "COLOR_SHIFT", "emerald"), "DOWN");
  assert.equal(resolveDirection("LEFT", "COLOR_SHIFT", "rose"), "RIGHT");
  assert.equal(resolveDirection("RIGHT", "COLOR_SHIFT", "rose"), "LEFT");
});

test("ink complements or conflicts with the active law", () => {
  assert.equal(signalRelation("STANDARD", "emerald"), "complement");
  assert.equal(signalRelation("STANDARD", "rose"), "conflict");
  assert.equal(signalRelation("INVERSION", "rose"), "complement");
  assert.equal(signalRelation("INVERSION", "emerald"), "conflict");
  assert.equal(signalRelation("COLOR_SHIFT", "emerald"), "complement");
  assert.equal(signalRelation("COLOR_SHIFT", "rose"), "complement");
});

test("streak scoring adds a rising multiplier bonus on top of the base", () => {
  assert.equal(pointsForStreak(1), 100);
  assert.equal(pointsForStreak(2), 150);
  assert.equal(pointsForStreak(3), 200);
  assert.equal(pointsForStreak(4), 250);
  assert.equal(multiplierForStreak(1), 1);
  assert.equal(nextMultiplier(0), 1);
  assert.equal(nextMultiplier(3), 2.5);
});

test("the first two rounds cannot echo", () => {
  const random = sequence([0, 0, 0]);
  const first = createPuzzle({
    history: [],
    previousWord: null,
    round: 1,
    random,
  });
  assert.equal(first.puzzle.isEcho, false);
  assert.equal(first.puzzle.law, "STANDARD");
  assert.deepEqual(first.history, ["STANDARD"]);

  const second = createPuzzle({
    history: first.history,
    previousWord: first.puzzle.word,
    round: 2,
    random: sequence([0, 0, 0]),
  });
  assert.equal(second.puzzle.isEcho, false);
});

test("echo replaces the rolled law with the law from two rounds ago", () => {
  const history: LinguisticLaw[] = ["INVERSION", "COLOR_SHIFT"];
  const echoed = createPuzzle({
    history,
    previousWord: null,
    round: 3,
    random: sequence([0, 0, 0, 0]),
  });

  assert.equal(echoed.puzzle.isEcho, true);
  assert.equal(echoed.puzzle.law, "INVERSION");
  assert.equal(echoed.puzzle.word, "UP");
  assert.equal(echoed.puzzle.color, "emerald");
  assert.equal(echoed.puzzle.correct, "DOWN");
  assert.equal(echoed.puzzle.relation, "conflict");
  assert.deepEqual(echoed.history, ["INVERSION", "COLOR_SHIFT", "INVERSION"]);
  assert.deepEqual(history, ["INVERSION", "COLOR_SHIFT"]);
});

test("an echo roll of exactly 15% stays a normal round", () => {
  const normal = createPuzzle({
    history: ["STANDARD", "INVERSION"],
    previousWord: null,
    round: 3,
    random: sequence([0, 0, 0, 0.15]),
  });

  assert.equal(normal.puzzle.isEcho, false);
  assert.equal(normal.puzzle.law, "STANDARD");
  assert.equal(normal.puzzle.correct, "UP");
  assert.deepEqual(normal.history, ["STANDARD", "INVERSION", "STANDARD"]);
});

test("color shift uses the current ink when an older color-shift law is echoed", () => {
  const echoed = createPuzzle({
    history: ["COLOR_SHIFT", "STANDARD"],
    previousWord: "LEFT",
    round: 4,
    random: sequence([0, 0, 0.99, 0.01]),
  });

  assert.equal(echoed.puzzle.isEcho, true);
  assert.equal(echoed.puzzle.law, "COLOR_SHIFT");
  assert.equal(echoed.puzzle.word, "UP");
  assert.equal(echoed.puzzle.color, "rose");
  assert.equal(echoed.puzzle.correct, "DOWN");
});

test("the next word avoids an immediate repeat", () => {
  const puzzle = createPuzzle({
    history: [],
    previousWord: "UP",
    round: 2,
    random: sequence([0, 0, 0]),
  });

  assert.equal(puzzle.puzzle.word, "DOWN");
});
