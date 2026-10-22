import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach the independent Wordle solver, and what the contact form does not store.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const email = contactEmail();

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
      <p className="text-sm leading-6 text-mist">
        {email
          ? "You can write to the address below. The form on this page still does not transmit or store what you type."
          : "This project does not publish a monitored email address yet. The form below does not transmit or store what you type."}{" "}
        The solver runs in your browser and does not keep an account inbox.
      </p>
      {email ? (
        <p>
          <a className="text-paper underline underline-offset-4" href={`mailto:${email}`}>
            {email}
          </a>
        </p>
      ) : null}
      <ContactForm />
    </main>
  );
}

function contactEmail(): string | null {
  const value = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}
