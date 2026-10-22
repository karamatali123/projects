import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: `Email ${siteConfig.name} about a formula, a content error, or how a page was made. We cannot give personalized tax or lending advice.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl text-navy">Contact</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Questions about a calculator, a formula, a source citation, or a content error?
        Email{" "}
        <a className="font-medium text-primary hover:text-secondary" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        . Include the page URL and what you expected to see.
      </p>
      <p className="mt-4 text-muted-foreground">
        We cannot give personalized tax, lending, or investment advice. For how numbers
        and copy are produced, see{" "}
        <Link href="/about/#how-we-make-this" className="font-medium text-primary hover:text-secondary">
          How we make this
        </Link>
        .
      </p>
    </div>
  );
}
