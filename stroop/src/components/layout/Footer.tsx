import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stroke">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
        <p>Unofficial solver. Not affiliated with or endorsed by The New York Times.</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          <Link href="/guides/repeated-letters" className="hover:text-paper">
            Repeated letters
          </Link>
          <Link href="/guides/best-next-guess" className="hover:text-paper">
            Next guesses
          </Link>
          <Link href="/about" className="hover:text-paper">
            About
          </Link>
          <Link href="/contact" className="hover:text-paper">
            Contact
          </Link>
          <Link href="/privacy-policy" className="hover:text-paper">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-paper">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
