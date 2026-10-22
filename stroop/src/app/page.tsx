import { Guide } from "@/components/home/Guide";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { SolverApp } from "@/components/Solver/SolverApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Wordle Solver – Find Possible Words & Best Guesses",
  },
  description:
    "Enter your Wordle guesses and mark green, yellow, and gray letters to find matching words and discover useful next guesses with our free solver.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <main id="solver">
      <SiteJsonLd />
      <section aria-label="Interactive solver">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-12">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Wordle Solver</h1>
          <SolverApp />
        </div>
      </section>
      <Guide />
    </main>
  );
}
