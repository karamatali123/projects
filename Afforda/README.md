# Afforda

US-focused financial and everyday decision calculators. Numbers come from deterministic formulas in `lib/calculators/`. The UI does not invent results.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Zod validation
- Vitest for calculation tests

## Scripts

```bash
npm run dev
npm run test
npm run lint
npm run build
```

## Add a calculator

1. Add a pure function, Zod schema, and types in `lib/calculators/`.
2. Add unit tests in `tests/calculators/`.
3. Register the tool in `data/calculators.ts`.
4. Add page content in `data/content/calculators.ts`.
5. Create a client widget in `components/calculators/` and a route in `app/<slug>/page.tsx`.

Homepage cards, category pages, search, related tools, and the sitemap all read from the registry.

## Future (not in this MVP)

User accounts, saved calculations, a dashboard, premium reports, and an optional “explain my result” AI layer can sit on top of the same calculation functions without replacing them.
