import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { isIndexableSite, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const indexable = isIndexableSite();

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "Wordle Solver – Find Possible Words & Best Guesses",
    template: "%s · Wordle Solver",
  },
  description:
    "Enter your Wordle guesses and mark green, yellow, and gray letters to find matching words and discover useful next guesses with our free solver.",
  applicationName: "Wordle Solver",
  openGraph: {
    title: "Wordle Solver – Find Possible Words & Best Guesses",
    description:
      "Mark green, yellow, and gray feedback to filter possible answers and rank useful next guesses.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wordle Solver – Find Possible Words & Best Guesses",
    description:
      "Mark green, yellow, and gray feedback to filter possible answers and rank useful next guesses.",
  },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "-3JY0T7WhKfL5SRSAc1jOhCRx9u5u420U6YMMSSXAFQ",
  },
};

export const viewport: Viewport = {
  themeColor: "#101114",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-ink font-sans text-paper">
        <a
          href="#solver"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:rounded-full focus:bg-paper focus:px-3 focus:py-2 focus:text-ink"
        >
          Skip to solver
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
