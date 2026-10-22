"use client";

import { searchCalculators } from "@/data/calculators";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useMemo, useState } from "react";

export function Search() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => searchCalculators(query).slice(0, 8), [query]);

  return (
    <div className="relative w-full max-w-sm">
      <label htmlFor="calculator-search" className="sr-only">
        Search calculators
      </label>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
      <Input
        id="calculator-search"
        type="search"
        autoComplete="off"
        placeholder="Search calculators"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        className="pl-9"
      />
      {open && query.trim() ? (
        <ul
          aria-label="Search results"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">
              No calculators match “{query.trim()}”.
            </li>
          ) : (
            results.map((calculator) => (
              <li key={calculator.slug}>
                <Link
                  href={calculator.href}
                  className="block px-4 py-3 transition-colors hover:bg-primary-soft"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <span className="block text-sm font-medium">{calculator.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {calculator.description}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
