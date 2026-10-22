import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "How this independent Wordle solver chooses its dictionary, filters feedback, and ranks next guesses.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">About this solver</h1>
      <p className="text-sm leading-6 text-mist">
        Wordle Solver is a free helper for puzzles that use green, yellow, and gray feedback. The board starts at
        five letters, and you can switch it to any length from 2 to 15. You record what the puzzle already told you.
        The page then lists words consistent with that record and suggests guesses that can split the remaining list.
      </p>
      <p className="text-sm leading-6 text-mist">
        The answer list is the five-letter entries in the 20,000 most common English words compiled from Peter
        Norvig’s frequency counts of the Google Web Trillion Word Corpus, in frequency order. Allowed guesses add
        every five-letter word from Webster’s Second International word list (web2). That 1934 word list is
        public domain. Lengths other than five use that same Webster list for both answers and allowed guesses, in
        alphabetical order rather than frequency order. Regular endings of those headwords are included as well,
        such as -s, -ed, and -ing, with the usual spelling changes: a final y becomes ies or ied, and a silent e is
        dropped. A form such as cherished comes from the headword cherish. An
        occasional generated ending is not a dictionary word of its own. These lists are not the official answer
        list of any newspaper puzzle, so a real answer can still be missing.
      </p>
      <p className="text-sm leading-6 text-mist">
        Filtering uses the two-pass feedback check: exact matches first, then leftover copies. A candidate stays only
        when every submitted row would have produced the colors you entered. Ranking uses letter frequency while many
        answers remain, and expected group size once the list is short enough to simulate.
      </p>
      <p className="text-sm leading-6 text-mist">
        This site is not affiliated with, endorsed by, or operated by The New York Times. Wordle is their trademark.
        The solver is an independent word tool. It does not publish a daily answer. Many other pages do, or they
        collect green, yellow, and gray letters in separate boxes. Those boxes lose track of repeated letters. This
        site compares the whole color pattern instead. Read{" "}
        <Link href="/guides/repeated-letters" className="text-paper underline underline-offset-4">
          how repeated letters change the colors
        </Link>{" "}
        and{" "}
        <Link href="/guides/best-next-guess" className="text-paper underline underline-offset-4">
          how a next guess is chosen
        </Link>
        . The <Link href="/privacy-policy" className="text-paper underline underline-offset-4">privacy policy</Link> and{" "}
        <Link href="/terms" className="text-paper underline underline-offset-4">terms</Link> describe what the site
        does and does not store.
      </p>
    </main>
  );
}
