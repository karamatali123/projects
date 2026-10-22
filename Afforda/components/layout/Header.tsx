import { categories } from "@/data/categories";
import { liveCalculators } from "@/data/calculators";
import { Logo } from "@/components/layout/Logo";
import { Search } from "@/components/layout/Search";
import Link from "next/link";

export function Header() {
  const tools = liveCalculators();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 shadow-sm backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <details className="relative md:hidden">
            <summary className="cursor-pointer rounded-xl border border-border bg-primary-soft px-3 py-2 text-sm font-semibold text-primary">
              Menu
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-hover)]"
            >
              <Link className="block rounded-md px-2 py-2 hover:bg-primary-soft hover:text-primary" href="/calculators/">
                All calculators
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  className="block rounded-md px-2 py-2 hover:bg-primary-soft hover:text-primary"
                  href={category.href}
                >
                  {category.name}
                </Link>
              ))}
              <Link className="block rounded-md px-2 py-2 hover:bg-primary-soft hover:text-primary" href="/about/">
                About
              </Link>
            </nav>
          </details>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-5 text-sm font-semibold md:flex">
          <div className="group relative">
            <Link href="/calculators/" className="rounded-md px-1 py-1 transition-colors hover:text-primary">
              Calculators
            </Link>
            <div className="invisible absolute top-full left-0 z-20 mt-2 grid w-[28rem] grid-cols-2 gap-1 rounded-xl border border-border bg-card p-3 opacity-0 shadow-[var(--shadow-hover)] transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {tools.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={calculator.href}
                  className="rounded-md px-2 py-2 text-sm hover:bg-primary-soft hover:text-primary"
                >
                  {calculator.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="group relative">
            <Link href="/calculators/" className="rounded-md px-1 py-1 transition-colors hover:text-primary">
              Categories
            </Link>
            <div className="invisible absolute top-full left-0 z-20 mt-2 w-56 rounded-xl border border-border bg-card p-2 opacity-0 shadow-[var(--shadow-hover)] transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  className="block rounded-md px-2 py-2 hover:bg-primary-soft hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/about/" className="rounded-md px-1 py-1 transition-colors hover:text-secondary">
            About
          </Link>
        </nav>

        <div className="md:ml-auto md:w-72">
          <Search />
        </div>
      </div>
    </header>
  );
}
