import Image from "next/image";
import Link from "next/link";
import feedbackTiles from "@/images/feedback-tiles.jpg";

const FAQ = [
  {
    question: "Does this solver know today’s answer?",
    answer:
      "No. It only uses the guesses and colors you enter. If you have not played a word, the solver cannot reveal it.",
  },
  {
    question: "Is this an official Wordle tool?",
    answer:
      "No. It is an independent helper and is not affiliated with or endorsed by The New York Times. The dictionary is a common-English list, so it can differ from the list used by a particular puzzle.",
  },
  {
    question: "Why did every answer disappear?",
    answer:
      "That usually means a color was marked differently from the puzzle, or the answer is not in this dictionary. Change the tile colors and the list updates. The solver will not drop a constraint to invent a match.",
  },
  {
    question: "Are my guesses uploaded?",
    answer:
      "No. Filtering and ranking run in your browser. The word lists are static files. The page does not create an account or store your puzzle.",
  },
  {
    question: "What is the difference between a possible answer and a next guess?",
    answer:
      "A possible answer still fits every mark you entered. A recommended guess is a word that should divide those answers into smaller groups. It might not itself be a possible answer.",
  },
  {
    question: "People search for a Wordle cheat. What does this page do?",
    answer:
      "It is a solver, not a hidden-answer feed. You still play the puzzle, then record the green, yellow, and gray result. The page narrows the words that fit that result.",
  },
] as const;

export function Guide() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="border-t border-stroke">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-12">
        <section id="how-to-use" className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">How to use the solver</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-mist">
            <li>Play a guess in your puzzle.</li>
            <li>Type that same word into the grid.</li>
            <li>Click each tile until the mark matches the puzzle: absent, wrong spot, or correct spot.</li>
            <li>Submit the row. The possible answers and the next-guess list update together.</li>
            <li>Try a suggested word, bring back the new colors, and repeat. Use undo or reset if you mark a tile by mistake.</li>
          </ol>
          <figure className="overflow-hidden rounded-2xl border border-stroke">
            <Image
              src={feedbackTiles}
              alt="Green A means the letter is in the correct spot, yellow R means the letter is in the word but in the wrong spot, and gray E means that letter is absent."
              sizes="(min-width: 48rem) 720px, 100vw"
              className="h-auto w-full"
              style={{ width: "100%", height: "auto" }}
            />
          </figure>
          <Example />
        </section>
        <section id="how-it-works" className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">How the solver works</h2>
          <p className="text-sm leading-6 text-mist">
            Each submitted row is stored as a word plus five marks. The engine does not treat those marks as loose
            rules that can drift apart. For every candidate, it plays your guess against that candidate with the
            standard two-pass Wordle check, then keeps the candidate only when the calculated pattern matches your
            row exactly. Later guesses are added to that test. They do not erase earlier rows.
          </p>
          <p className="text-sm leading-6 text-mist">
            The first pass marks exact letters green and counts the unused letters left in the candidate. The second
            pass marks a remaining copy yellow, or gray when no unused copy is left. That is what makes repeated
            letters safe. In ALLEY against APPLE, one L is yellow and the other is gray, because APPLE has only one L.
            A solver that treats every gray tile as “this letter is absent” would throw APPLE away.
          </p>
          <p className="text-sm leading-6 text-mist">
            Next guesses are ranked separately from the answer list. With many words left, the ranker prefers guesses
            that test letters common among those words. With a shorter list, it simulates each candidate guess, groups
            the answers by the color pattern they would produce, and prefers the guess that leaves fewer words on
            average. A possible answer gets a small tie-break, because guessing it can end the puzzle. None of these
            ranks is a promise. Two short guides go further:{" "}
            <Link href="/guides/repeated-letters" className="text-paper underline underline-offset-4">
              how repeated letters change the colors
            </Link>{" "}
            and{" "}
            <Link href="/guides/best-next-guess" className="text-paper underline underline-offset-4">
              how a next guess is chosen
            </Link>
            .
          </p>
        </section>
        <section id="faq" className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="space-y-5">
            {FAQ.map((item) => (
              <article key={item.question}>
                <h3 className="font-medium">{item.question}</h3>
                <p className="mt-1 text-sm leading-6 text-mist">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Example() {
  const tiles = [
    { letter: "C", kind: "absent" },
    { letter: "R", kind: "present" },
    { letter: "A", kind: "correct" },
    { letter: "N", kind: "absent" },
    { letter: "E", kind: "absent" },
  ] as const;

  return (
    <figure className="rounded-2xl border border-stroke bg-panel/70 p-4">
      <figcaption className="text-sm text-mist">
        CRANE with C, N, and E absent, R in the wrong spot, and A in the correct spot. ALARM still fits. CRANE itself
        does not, because that pattern is not all green.
      </figcaption>
      <div className="mt-3 grid max-w-[16rem] grid-cols-5 gap-1.5" aria-hidden="true">
        {tiles.map((tile) => (
          <span
            key={tile.letter}
            className={`grid aspect-square place-items-center rounded-md font-mono text-xl font-semibold ${
              tile.kind === "correct"
                ? "tile-correct"
                : tile.kind === "present"
                  ? "tile-present"
                  : "tile-absent"
            }`}
          >
            {tile.letter}
          </span>
        ))}
      </div>
    </figure>
  );
}
