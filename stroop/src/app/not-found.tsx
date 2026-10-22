import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That address is not a page on this Wordle solver.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-mist">
        This address is not part of the site. The solver, the instructions, and the policy pages are linked from the
        homepage.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm text-paper underline underline-offset-4">
        Back to the Wordle solver
      </Link>
    </main>
  );
}
