import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Choose the Next Wordle Guess",
  description:
    "Possible answers and recommended guesses are different. See how this solver ranks a guess by the words it would leave.",
  alternates: { canonical: "/guides/best-next-guess" },
};

export default function BestNextGuessPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Wordle Solver", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Next guesses",
        item: absoluteUrl("/guides/best-next-guess"),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-sm leading-6 text-mist">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h1 className="text-4xl font-semibold tracking-tight text-paper">How a next guess is chosen</h1>
      <p>
        The page shows two different lists. A possible answer is a word that would have produced every color pattern
        you entered. A recommended guess is a word that should split those answers into smaller groups. The second
        word might not itself be a possible answer.
      </p>
      <h2 className="pt-2 text-2xl font-semibold text-paper">While many words remain</h2>
      <p>
        Simulating every allowed guess against thousands of answers is unnecessary on the first turn. The ranker
        scores each guess by the distinct letters it tests and how often those letters appear among the remaining
        answers. A guess that is also a possible answer gets a small boost, because playing it can end the puzzle.
      </p>
      <h2 className="pt-2 text-2xl font-semibold text-paper">When the list is short enough to simulate</h2>
      <p>
        Once few answers remain, the ranker plays a candidate guess against each of them. Answers that would return
        the same five colors are grouped. An all-green result leaves no further words. Every other pattern leaves a
        group of that size. The score is the average size of the group you would be left with.
      </p>
      <p>
        A guess that splits twelve words into six and six is usually more useful than one that splits them into ten
        and two. A possible answer is preferred by a fraction of a word, so two equally informative guesses favor the
        one that might win immediately.
      </p>
      <h2 className="pt-2 text-2xl font-semibold text-paper">What the suggestion is not</h2>
      <p>
        The average is a calculation, not a promise. The puzzle may still take another guess. The dictionary is a
        common-English list, so a real answer can be missing. If you want the rule that keeps repeated letters
        honest, read{" "}
        <Link href="/guides/repeated-letters" className="text-paper underline underline-offset-4">
          how repeated letters change the colors
        </Link>
        . Then{" "}
        <Link href="/" className="text-paper underline underline-offset-4">
          return to the solver
        </Link>{" "}
        and mark the next row.
      </p>
    </main>
  );
}
