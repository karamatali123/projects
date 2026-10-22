import Image from "next/image";
import Link from "next/link";
import logo from "@/images/logo.jpg";

export function Header() {
  return (
    <header className="border-b border-stroke">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4">
        <Link href="/" aria-label="Wordle Solver" className="inline-flex items-center">
          <Image
            src={logo}
            alt=""
            priority
            className="h-8 w-auto sm:h-9"
            style={{ width: "auto" }}
          />
        </Link>
        <nav aria-label="Primary" className="flex gap-4 text-sm text-mist">
          <Link href="/#how-to-use" className="hover:text-paper">
            How to use
          </Link>
          <Link href="/about" className="hover:text-paper">
            About
          </Link>
          <Link href="/contact" className="hover:text-paper">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
