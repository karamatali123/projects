import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function words(file: string): Set<string> {
  return new Set(readFileSync(file, "utf8").split(/\s+/).filter(Boolean));
}

test("regular endings of Webster headwords are included", () => {
  const nine = words("public/data/words-9.txt");
  const seven = words("public/data/words-7.txt");
  const six = words("public/data/words-6.txt");

  assert.equal(seven.has("cherish"), true);
  assert.equal(nine.has("cherished"), true);
  assert.equal(nine.has("cherishes"), true);
  assert.equal(six.has("played"), true);
  assert.equal(six.has("houses"), true);
  assert.equal(six.has("wanted"), true);
});
