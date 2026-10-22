import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using this independent Wordle solver.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-sm leading-6 text-mist">
      <h1 className="text-4xl font-semibold tracking-tight text-paper">Terms</h1>
      <p>
        Wordle Solver is an unofficial word tool. It is not affiliated with, sponsored by, or endorsed by The New York
        Times. Wordle is a trademark of its owner. Nothing on this site grants you a right to use that trademark.
      </p>
      <p>
        The dictionary is a common-English list plus a public-domain spelling list. It is not guaranteed to match any
        commercial puzzle. Suggestions are calculations, not a promise that a guess will win.
      </p>
      <p>
        The tool is provided as-is, without warranty. You are responsible for following the rules of any game you play.
        Do not rely on the solver for anything other than entertainment and word study.
      </p>
      <p>
        The word lists may be reused only to the extent their own licenses allow. The Webster-derived web2 list is
        public domain. Regular endings such as -s, -ed, and -ing were formed from those headwords. The frequency
        ordering comes from a published compilation of common English words and is included here so the solver can
        prefer ordinary answers.
      </p>
    </main>
  );
}
