export type ClueQuery = {
  positions: readonly (string | null)[];
  included: string;
  excluded: string;
};

export function filterByClues(answers: readonly string[], query: ClueQuery): string[] {
  const length = query.positions.length;
  const positions = Array.from({ length }, (_, index) => {
    const letter = query.positions[index]?.toLowerCase() ?? "";
    return /^[a-z]$/.test(letter) ? letter : null;
  });
  const required = new Set<string>([
    ...positions.filter((letter): letter is string => letter !== null),
    ...lettersOf(query.included),
  ]);
  const banned = lettersOf(query.excluded).filter((letter) => !required.has(letter));

  return answers.filter((word) => {
    if (word.length !== length) return false;
    for (let index = 0; index < length; index += 1) {
      const letter = positions[index];
      if (letter && word[index] !== letter) return false;
    }
    for (const letter of required) {
      if (!word.includes(letter)) return false;
    }
    for (const letter of banned) {
      if (word.includes(letter)) return false;
    }
    return true;
  });
}

export function conflictingClueLetters(query: ClueQuery): string[] {
  const required = new Set<string>([
    ...query.positions
      .map((letter) => letter?.toLowerCase() ?? "")
      .filter((letter) => /^[a-z]$/.test(letter)),
    ...lettersOf(query.included),
  ]);
  return lettersOf(query.excluded).filter((letter) => required.has(letter));
}

function lettersOf(value: string): string[] {
  return [...new Set(value.toLowerCase().replace(/[^a-z]/g, "").split(""))];
}
