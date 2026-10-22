import { DEFAULT_WORD_LENGTH, type WordLength } from "@/types/solver";

export type Dictionary = {
  length: WordLength;
  answers: string[];
  allowed: string[];
  allowedSet: Set<string>;
  frequencyOrdered: boolean;
};

const cache = new Map<WordLength, Promise<Dictionary>>();
const WORD_LIST_VERSION = "2";

function wordListUrl(path: string): string {
  return `${path}?v=${WORD_LIST_VERSION}`;
}

export function loadDictionary(length: WordLength = DEFAULT_WORD_LENGTH, force = false): Promise<Dictionary> {
  if (force) cache.delete(length);
  const cached = cache.get(length);
  if (cached) return cached;

  const pending = fetchDictionary(length).catch((error: unknown) => {
    cache.delete(length);
    throw error;
  });
  cache.set(length, pending);
  return pending;
}

async function fetchDictionary(length: WordLength): Promise<Dictionary> {
  if (length === DEFAULT_WORD_LENGTH) {
    const [answerResponse, allowedResponse] = await Promise.all([
      fetch(wordListUrl("/data/answer-words.txt")),
      fetch(wordListUrl("/data/allowed-guesses.txt")),
    ]);
    if (!answerResponse.ok || !allowedResponse.ok) {
      throw new Error("The word lists could not be loaded.");
    }
    const answers = normalizeList(await answerResponse.text(), length);
    const allowed = normalizeList(await allowedResponse.text(), length);
    if (answers.length === 0 || allowed.length === 0) {
      throw new Error("The word lists were empty.");
    }
    return { length, answers, allowed, allowedSet: new Set(allowed), frequencyOrdered: true };
  }

  const response = await fetch(wordListUrl(`/data/words-${length}.txt`));
  if (!response.ok) throw new Error("The word lists could not be loaded.");
  const words = normalizeList(await response.text(), length);
  if (words.length === 0) throw new Error("The word lists were empty.");
  return {
    length,
    answers: words,
    allowed: words,
    allowedSet: new Set(words),
    frequencyOrdered: false,
  };
}

function normalizeList(text: string, length: number): string[] {
  const seen = new Set<string>();
  const words: string[] = [];
  const pattern = new RegExp(`^[a-z]{${length}}$`);
  for (const part of text.split(/\s+/)) {
    const word = part.trim().toLowerCase();
    if (!pattern.test(word) || seen.has(word)) continue;
    seen.add(word);
    words.push(word);
  }
  return words;
}
