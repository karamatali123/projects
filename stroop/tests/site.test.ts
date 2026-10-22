import assert from "node:assert/strict";
import test from "node:test";
import { PUBLIC_PATHS, resolveSiteUrl } from "../src/lib/site";

test("lists only canonical pages, not keyword aliases", () => {
  assert.equal(PUBLIC_PATHS[0], "/");
  assert.equal(new Set(PUBLIC_PATHS).size, PUBLIC_PATHS.length);
  for (const alias of ["/wordle-helper", "/wordle-finder", "/wordle-help", "/wordle-cheat"]) {
    assert.equal(PUBLIC_PATHS.includes(alias as (typeof PUBLIC_PATHS)[number]), false);
  }
  assert.ok(PUBLIC_PATHS.includes("/guides/repeated-letters"));
  assert.ok(PUBLIC_PATHS.includes("/guides/best-next-guess"));
});

test("uses https://wordlesolve.net as the production origin", () => {
  assert.equal(resolveSiteUrl(undefined, "development").origin, "http://localhost:3000");
  assert.equal(resolveSiteUrl(undefined, "production").origin, "https://wordlesolve.net");
  assert.throws(() => resolveSiteUrl("http://solver.example", "production"));
  assert.equal(resolveSiteUrl("http://127.0.0.1:3000", "production").origin, "http://127.0.0.1:3000");
  assert.equal(resolveSiteUrl("https://wordlesolve.net", "production").origin, "https://wordlesolve.net");
});
