import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles information on this website.`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl text-navy">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">Last updated: October 7, 2026</p>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          Calculator inputs are processed in your browser for these tools. We do not
          require an account to use the live calculators, and we do not use your entries
          to generate a credit decision or to train a generative model.
        </p>
        <p>
          If we add sign-in, saved calculations, or advertising later, this policy will
          be updated to describe what is stored, why, and how long it is kept.
        </p>
        <p>
          Standard server logs and privacy-respecting analytics may record pages visited,
          browser type, and approximate location. Do not enter Social Security numbers,
          full account numbers, or other sensitive identifiers into these forms.
        </p>
        <p>
          Contact {siteConfig.email} with privacy questions.
        </p>
      </div>
    </div>
  );
}
