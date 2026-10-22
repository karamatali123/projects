import { editorial, type ContentSource } from "@/data/editorial";
import Link from "next/link";

export function ContentProvenance({ sources }: { sources?: ContentSource[] }) {
  return (
    <section className="mt-10 max-w-3xl rounded-2xl border border-border bg-card px-5 py-5">
      <h2 className="font-serif text-2xl text-navy">How this page was made</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Last reviewed {editorial.reviewedOn}. The numbers you see come from the formula
        on this page, which is written in code and checked with unit tests. Copy was
        drafted to match that formula and the public sources below, then edited for
        accuracy. Afforda does not generate tax or loan results with a language model.
        Photos and brand illustrations on the site are AI-generated and labeled as
        such.{" "}
        <Link href="/about/#how-we-make-this" className="font-medium text-primary hover:text-secondary">
          Read the full note on About
        </Link>
        .
      </p>
      {sources && sources.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          {sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                className="text-primary underline-offset-2 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
