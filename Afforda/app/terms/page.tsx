import { editorial } from "@/data/editorial";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for ${siteConfig.name} calculators.`,
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl text-navy">Terms of use</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last reviewed {editorial.reviewedOn}.
      </p>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          {siteConfig.name} provides educational calculators. Results are estimates.
          They are not tax, legal, lending, or investment advice, and they are not a
          promise of approval, a paycheck, or a loan term.
        </p>
        <p>
          You may use the site for personal, non-commercial planning. Do not scrape the
          service in a way that degrades it for other visitors.
        </p>
        <p>
          Calculator outputs are produced by the published formulas, not by a generative
          model. Copy and illustrations may use automation as described on{" "}
          <Link href="/about/#how-we-make-this" className="font-medium text-primary hover:text-secondary">
            About
          </Link>
          . Do not treat decorative images as photos of real financial documents.
        </p>
        <p>
          The site is provided as is. We are not liable for decisions you make using
          these estimates.
        </p>
      </div>
    </div>
  );
}
