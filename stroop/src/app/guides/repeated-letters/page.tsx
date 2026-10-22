import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Repeated Letters in Wordle Feedback",
  description:
    "See why one repeated letter can be yellow and another gray, and how this solver compares the full color pattern.",
  alternates: { canonical: "/guides/repeated-letters" },
};

export default function RepeatedLettersPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Wordle Solver", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Repeated letters",
        item: absoluteUrl("/guides/repeated-letters"),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-sm leading-6 text-mist">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h1 className="text-4xl font-semibold tracking-tight text-paper">How repeated letters change the colors</h1>
      <p>
        A gray tile does not always mean “this letter is absent.” When the guess uses a letter more times than the
        answer does, the extra copies are gray and the copies that do exist can still be yellow or green.
      </p>
      <h2 className="pt-2 text-2xl font-semibold text-paper">The two passes</h2>
      <p>
        The solver scores a candidate in the same order as the puzzle. The first pass marks exact matches green and
        counts the unmatched letters left in the candidate. The second pass walks the remaining guess letters from
        left to right. A leftover copy becomes yellow. If none is left, the tile is gray.
      </p>
      <h2 className="pt-2 text-2xl font-semibold text-paper">APPLE against the guess ALLEY</h2>
      <p>
        APPLE contains one L. ALLEY contains two. The A is green. The first L is yellow, because that single L is
        still available and is not in the guessed position. The second L is gray, because the yellow tile already
        used the only L. The E is yellow, not green: it sits where APPLE has an L. The Y is gray.
      </p>
      <p>The pattern is green, yellow, gray, yellow, gray. APPLE stays. A word with two Ls does not.</p>
      <h2 className="pt-2 text-2xl font-semibold text-paper">Why the whole pattern is the check</h2>
      <p>
        The filter does not keep a private rule that “gray L means no L anywhere.” For every submitted row it scores
        the candidate, then keeps the candidate only when all five tiles match the colors you entered. Later guesses
        are added to that test. They do not erase earlier rows.
      </p>
      <p>
        If the list drops to zero, the colors and the dictionary disagree. Change a tile. The list recalculates. The
        solver will not drop a mark to invent a match.
      </p>
      <p>
        <Link href="/" className="text-paper underline underline-offset-4">
          Open the solver
        </Link>{" "}
        and mark the row the way the puzzle showed it. For how suggestions are ranked, read{" "}
        <Link href="/guides/best-next-guess" className="text-paper underline underline-offset-4">
          how a next guess is chosen
        </Link>
        .
      </p>
    </main>
  );
}
