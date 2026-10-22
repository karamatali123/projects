import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What the Wordle solver stores, and what stays on your device.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-sm leading-6 text-mist">
      <h1 className="text-4xl font-semibold tracking-tight text-paper">Privacy policy</h1>
      <p>This policy describes the Wordle Solver website as it works today.</p>
      <h2 className="pt-2 text-xl font-semibold text-paper">What the solver processes</h2>
      <p>
        Guesses and tile colors stay in memory in your browser. Refreshing the page clears the session. The site does
        not ask you to create an account, and it does not write your puzzle into a database.
      </p>
      <h2 className="pt-2 text-xl font-semibold text-paper">Word lists</h2>
      <p>
        The browser downloads two static word lists so it can check guesses and filter answers. Those files contain
        ordinary English words, not information about you.
      </p>
      <h2 className="pt-2 text-xl font-semibold text-paper">Contact form</h2>
      <p>
        The contact form does not send its contents to a server. Closing or reloading the page discards what you typed.
      </p>
      <h2 className="pt-2 text-xl font-semibold text-paper">Cookies and advertising</h2>
      <p>
        The current site does not set its own tracking cookies, does not run advertising, and does not sell personal
        information. There is no analytics tag. If advertising is added later, this policy will be updated before
        those tags load, including any disclosure required by the ad provider. Ads, if they are ever added, will sit
        outside the grid, keyboard, and results so they are not mistaken for solver controls.
      </p>
      <h2 className="pt-2 text-xl font-semibold text-paper">Hosting</h2>
      <p>
        The host that serves the pages can keep ordinary server logs, such as IP address and the URL requested. Those
        logs are not used by the solver itself.
      </p>
    </main>
  );
}
