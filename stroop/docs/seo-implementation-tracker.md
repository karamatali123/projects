# SEO implementation tracker

Updated: 2026-10-22

Primary keyword: `wordle solver`. Supporting keywords used on the homepage: `wordle helper`, `wordle finder`, `wordle help`.

Production origin: not chosen. `NEXT_PUBLIC_SITE_URL` is empty. A production build without that variable fails on purpose. Local checks used `http://127.0.0.1:3000` (dev) and `http://127.0.0.1:3001` (local production). Those origins are not the public site, and both stay `noindex`.

## Counts

| Status | Meaning | Tasks |
| --- | --- | --- |
| `[x]` | Implemented and verified | 60 |
| `[~]` | Partial, or still needs verification | 11 |
| `[ ]` | Not completed | 0 |
| `[E]` | External action required | 22 |

93 tasks total.

## 1. Technical SEO foundation

### 1. Choose one HTTPS hostname

- Status: `[E]`
- Files: `src/lib/site.ts`, `src/proxy.ts`, `next.config.ts`, `.env.example`
- Verification: `npm run build` with no `NEXT_PUBLIC_SITE_URL` stops with “Refusing to publish localhost canonicals.” `resolveSiteUrl("http://solver.example", "production")` throws. A local http origin is allowed only so a local production build can be checked, and `isIndexableSite()` stays false for it.
- Remaining: Set `NEXT_PUBLIC_SITE_URL` to the one public https origin, with no path and no trailing slash. On the host, redirect http to https and redirect the unused hostname (www or apex) to that origin. `src/proxy.ts` already 308-redirects a non-canonical public host to that origin when the configured URL is https. `trailingSlash: false` redirects trailing-slash URLs. Unknown paths stay 404s.

### 2. App Router metadata and one site URL

- Status: `[~]`
- Files: `src/lib/site.ts`, `src/app/layout.tsx`, route `metadata` exports
- Verification: Dev metadata uses `http://localhost:3000` only when the env var is unset and `NODE_ENV` is not production. The local production build used an explicit `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3001`.
- Remaining: Replace that local origin with the real https origin before deploying.

### 3. Self-referencing canonical on the solver page

- Status: `[x]`
- Files: `src/app/page.tsx`, `src/lib/site.ts`
- Verification: Production HTML at `http://127.0.0.1:3001/` has one canonical, `http://127.0.0.1:3001`, with no path. `scripts/check-seo.ts` requires an absolute homepage canonical.
- Remaining: The canonical host will follow `NEXT_PUBLIC_SITE_URL` on the next production build.

### 4. Crawlable robots.txt

- Status: `[~]`
- Files: `src/app/robots.ts`
- Verification: `GET /robots.txt` on the local production server returned 200 and `User-Agent: *` / `Disallow: /`. CSS and JS are not blocked once the site is indexable: the indexable branch is `Allow: /` plus the sitemap URL, and the proxy matcher excludes `/_next/static` and `/data/`.
- Remaining: Fetch `/robots.txt` on the public https origin and confirm it allows `/` and lists `https://<your-domain>/sitemap.xml`.

### 5. XML sitemap of canonical indexable URLs

- Status: `[~]`
- Files: `src/app/sitemap.ts`, `src/lib/site.ts`
- Verification: Local `/sitemap.xml` is a valid empty urlset. `tests/site.test.ts` checks that `PUBLIC_PATHS` is unique, starts with `/`, includes both guides and the policy pages, and excludes `/wordle-helper`, `/wordle-finder`, `/wordle-help`, and `/wordle-cheat`. No `lastModified` is emitted.
- Remaining: On the public origin, confirm the sitemap lists only those seven https URLs.

### 6. HTTP status codes

- Status: `[x]`
- Files: `src/app/not-found.tsx`, `next.config.ts`, `scripts/check-seo.ts`
- Verification: `CHECK_BASE_URL=http://127.0.0.1:3001 npm run check:seo` passed. Public routes returned 200. `/this-page-does-not-exist` returned 404. `/wordle-helper` returned 308 to `/`. `/about/` returned 308.
- Remaining: none in the codebase.

### 7. Favicon, title, and social metadata

- Status: `[x]`
- Files: `src/app/layout.tsx`, `src/app/icon.tsx`, `src/app/opengraph-image.tsx`, `src/app/page.tsx`
- Verification: Local production homepage title is `Wordle Solver – Find Possible Words & Best Guesses`. The meta description matches the solver instructions. Open Graph title is present. The build emits `/icon` and `/opengraph-image`.
- Remaining: none. Preview cards should be checked again after the public domain is set, because the image URL uses `metadataBase`.

### 8. Semantic landmarks

- Status: `[x]`
- Files: `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/app/page.tsx`
- Verification: Layout renders `header`, `nav`, a skip link to `#solver`, and `footer`. The homepage renders `main` and sections for the solver and the guide.
- Remaining: none.

## 2. Keyword and search-intent planning

### 9. Primary keyword on the solver page

- Status: `[x]`
- Files: `src/app/page.tsx`, `src/app/layout.tsx`
- Verification: The H1 is `Wordle Solver`. The title and description include the same phrase once, in normal sentences.
- Remaining: none.

### 10. Supporting keywords used naturally

- Status: `[x]`
- Files: `src/app/page.tsx`
- Verification: The homepage lede uses `wordle helper`, `wordle finder`, and `wordle help` as descriptions of the same tool. There are no separate pages for those phrases.
- Remaining: none.

### 11. Current US search-result review

- Status: `[x]`
- Files: none
- Verification: Web search on 2026-10-22 for `wordle solver` and for helper/finder wording. Pages reviewed from the results: wordledictionary.com, wordle.global, wordfinder.yourdictionary.com, wordle-finder.com, word.tips, wordlehelper.org, collinsdictionary.com, wordsearch.com, wordlesolver.dev. Search volume, rank, and traffic were not measured.
- What the results show: people want to enter green, yellow, and gray feedback and see remaining words plus a next guess. Several results split letters into include/exclude boxes, and some gray-letter explanations treat a gray tile as “absent everywhere,” which is wrong for a repeated letter. Some pages also surface today’s answer. This site keeps the solver on the homepage, scores the full tile pattern, and does not publish a daily answer.
- Remaining: none until the results change.

### 12. One intent per URL

- Status: `[x]`
- Files: `src/app/page.tsx`, `next.config.ts`, guide and policy routes
- Verification: `/` is the solver. Guides explain repeated letters and next-guess ranking. Policy pages are separate. Keyword aliases redirect to `/`.
- Remaining: none.

### 13. Unique title and description on every indexable page

- Status: `[x]`
- Files: each route’s `metadata` export
- Verification: Fetched all seven public pages from the local production server. Titles are unique. Each page has a description and a self-referencing canonical.
- Remaining: Public pages are `noindex` until the https origin is configured. That is intentional for this local build.

### 14. One H1 and logical H2 headings

- Status: `[x]`
- Files: `src/app/page.tsx`, `src/components/home/Guide.tsx`, guide pages
- Verification: Homepage HTML contains one `h1`. Guide headings are `How to use the solver`, `How the solver works`, and `Frequently asked questions`.
- Remaining: none.

### 15. Natural keyword placement

- Status: `[x]`
- Files: `src/app/page.tsx`, `src/components/home/Guide.tsx`, header and footer links
- Verification: Keywords appear in the title, lede, and a few descriptive links. Tile text uses state names (`correct spot`, `wrong spot`, `absent`) rather than the keyword.
- Remaining: none.

### 16. No keyword stuffing

- Status: `[x]`
- Files: homepage and guides
- Verification: Reading the homepage and both guides. Headings describe the action or the rule, not a keyword list.
- Remaining: none.

## 3. User-first solver page

### 17. Solver near the top

- Status: `[x]`
- Files: `src/app/page.tsx`, `src/components/Solver/SolverApp.tsx`
- Verification: The homepage renders the H1, a short lede, then `SolverApp`, then `Guide`.
- Remaining: none.

### 18. How to mark green, yellow, and gray

- Status: `[x]`
- Files: `src/components/home/Guide.tsx`, `src/components/Solver/FeedbackControls.tsx`
- Verification: The guide and the control legend explain gray, yellow, and green, with ×, ●, and ✓.
- Remaining: none.

### 19. Worked example matches the scoring algorithm

- Status: `[x]`
- Files: `src/components/home/Guide.tsx`, `tests/filterCandidates.test.ts`
- Verification: The CRANE example is gray, yellow, green, gray, gray. The filter test keeps `alarm` for that pattern and rejects the other sample words. The figure caption says ALARM fits and CRANE does not.
- Remaining: none.

### 20. Repeated-letter rules

- Status: `[x]`
- Files: `src/components/home/Guide.tsx`, `src/app/guides/repeated-letters/page.tsx`, `tests/feedback.test.ts`
- Verification: `scoreGuess("apple", "alley")` is green, yellow, gray, yellow, gray. The guide uses that pattern.
- Remaining: none.

### 21. Possible answers versus recommended guesses

- Status: `[x]`
- Files: `src/components/home/Guide.tsx`, `src/components/Solver/CandidateList.tsx`, `src/components/Solver/RecommendationList.tsx`, `src/components/Solver/RecommendationCard.tsx`
- Verification: Possible answers and recommendations are separate headings. The recommendation card says a suggestion is not a guaranteed win.
- Remaining: none.

### 22. Helpful zero-candidate message

- Status: `[x]`
- Files: `src/hooks/useSolver.ts`, `src/components/Solver/CandidateList.tsx`, `src/components/Solver/RecommendationCard.tsx`
- Verification: The empty state tells the reader to check earlier rows and repeated-letter colors. The filter does not relax constraints. Unit tests expect an empty list rather than an invented word.
- Remaining: none.

### 23. Instructions, FAQ, and the real ranking method

- Status: `[x]`
- Files: `src/components/home/Guide.tsx`, `src/lib/rankGuesses.ts`, `src/app/guides/best-next-guess/page.tsx`
- Verification: The guide describes frequency ranking while many candidates remain, then expected remaining candidates once the list is small enough to simulate. That matches `rankGuesses`. The FAQ states the tool does not know today’s answer and is not an official Wordle product.
- Remaining: none.

### 24. No registration or popups

- Status: `[x]`
- Files: `src/components/Solver/SolverApp.tsx`
- Verification: The solver renders without an account, modal gate, or newsletter form.
- Remaining: none.

### 25. No filler word-count paragraphs

- Status: `[x]`
- Files: `src/components/home/Guide.tsx`, both guide pages
- Verification: Sections explain the workflow, the two-pass score, the ranking split, and short FAQs.
- Remaining: none.

## 4. Next.js SEO implementation

### 26. Metadata API

- Status: `[x]`
- Files: `src/app/layout.tsx` and each page’s `metadata` export
- Verification: Titles and descriptions above were read from the rendered HTML, not from a hand-written `<head>` in a client component.
- Remaining: none.

### 27. metadataBase from the verified production origin

- Status: `[E]`
- Files: `src/app/layout.tsx`, `src/lib/site.ts`
- Verification: `metadataBase` calls `siteUrl()`. There is no verified production origin to point it at.
- Remaining: Set `NEXT_PUBLIC_SITE_URL` and rebuild.

### 28. Unique title, description, and canonical per route

- Status: `[x]`
- Files: page metadata exports
- Verification: Same fetch as task 13. Homepage uses `title.absolute` so the layout template does not double the site name.
- Remaining: none.

### 29. Open Graph title, description, and preview image

- Status: `[x]`
- Files: `src/app/layout.tsx`, `src/app/opengraph-image.tsx`
- Verification: Homepage HTML includes `og:title`. The production build includes the generated `/opengraph-image` route. Twitter card is `summary_large_image`.
- Remaining: Re-check the absolute image URL after the public domain is set.

### 30. Useful text in the server HTML

- Status: `[x]`
- Files: `src/app/page.tsx`, `src/components/home/Guide.tsx`
- Verification: The fetched homepage HTML includes the H1, the description, and `How to use the solver` before any client interaction.
- Remaining: none.

### 31. Solver stays a client island

- Status: `[x]`
- Files: `src/app/page.tsx`, `src/components/Solver/SolverApp.tsx`
- Verification: The page and guide are server components. `use client` is limited to the solver, the contact form, and their children.
- Remaining: none.

### 32. Descriptive internal links

- Status: `[x]`
- Files: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/home/Guide.tsx`
- Verification: Header links to the solver, the how-to anchor, About, and Contact. Footer links to both guides and the policy pages. `check-seo` confirmed those routes return 200. No `href="#"` placeholders.
- Remaining: none.

### 33. Dev, preview, and duplicate URLs stay out of the index

- Status: `[x]`
- Files: `src/lib/site.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `next.config.ts`
- Verification: Local production HTML has `noindex, nofollow`. robots.txt disallows `/`. The sitemap urlset is empty. Alias routes redirect to `/`. `isIndexableSite()` requires https, a non-local host, and production (`VERCEL_ENV=production` when that variable exists, otherwise `NODE_ENV=production`).
- Remaining: Confirm the public production deployment does not send `noindex`.

### 34. Explanatory copy is not client-only

- Status: `[x]`
- Files: `src/components/home/Guide.tsx`
- Verification: `Guide` has no `"use client"` directive, and its headings are in the fetched HTML.
- Remaining: none.

## 5. Page speed and Core Web Vitals

### 35. Initial JavaScript size

- Status: `[~]`
- Files: solver components, `package.json`
- Verification: Local production homepage referenced 9 scripts, 609,558 bytes raw and 187,814 bytes gzipped. Lighthouse 13.5.0 mobile lab reported about 27 KiB unused JavaScript. No extra packages were added for SEO.
- Remaining: The three solver modes share one client bundle. Splitting them further is optional and was not required to keep the solver accurate.

### 36. Dictionary loaded once and kept out of the bundle

- Status: `[x]`
- Files: `src/lib/dictionary.ts`, `public/data/answer-words.txt`, `public/data/allowed-guesses.txt`
- Verification: `loadDictionary` reuses one module-level promise. The homepage JS contains the fetch path `answer-words` and does not contain the word `swart`.
- Remaining: none.

### 37. Cache the word lists

- Status: `[x]`
- Files: `next.config.ts`
- Verification: `GET /data/answer-words.txt` returned `Cache-Control` containing `max-age=86400`.
- Remaining: none.

### 38. Avoid repeated ranking work

- Status: `[x]`
- Files: `src/hooks/useSolver.ts`, `src/lib/rankGuesses.ts`
- Verification: Candidates and recommendations are memoized on the guess history. Ranking uses a frequency heuristic above 280 candidates and expected remaining only below that limit.
- Remaining: none.

### 39. Images only where they help, with reserved size

- Status: `[x]`
- Files: `src/app/icon.tsx`, `src/app/opengraph-image.tsx`
- Verification: Removed unreferenced `public/next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, and `file.svg`. The remaining images are the generated icon and social preview, which set their own dimensions.
- Remaining: none.

### 40. No empty ad space above the solver

- Status: `[x]`
- Files: `src/app/page.tsx`, `src/components/Solver/CandidateList.tsx`
- Verification: No ad unit or reserved ad hole was added. The candidate panel keeps a minimum height so an empty result does not collapse the column.
- Remaining: If ads are added later, place them outside the grid, keyboard, and results, and reserve their height only when a real unit is present.

### 41. Fonts

- Status: `[x]`
- Files: `src/app/layout.tsx`
- Verification: Geist and Geist Mono load through `next/font` with `display: "swap"`. They stay because they are the current visual identity.
- Remaining: none.

### 42. Lighthouse and PageSpeed

- Status: `[~]`
- Files: none
- Verification: Lighthouse 13.5.0, mobile lab, `http://127.0.0.1:3001/`, fetched 2026-10-22T16:43:09Z. Performance 89, accessibility 100, best practices 100, SEO 66. LCP 2.9 s, CLS 0.009, total blocking time 280 ms, speed index 3.1 s. Lab INP was not reported. The only failed SEO audit was `is-crawlable`, because this local origin is intentionally `noindex`. PageSpeed Insights was not run.
- Remaining: Run Lighthouse and PageSpeed against the public URL. Do not treat these lab numbers as field Core Web Vitals.

### 43. Monitor LCP, INP, and CLS after launch

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: No field data exists. Search Console is not connected.
- Remaining: After launch, read the Core Web Vitals report in Search Console.

## 6. Mobile UX and accessibility

### 44. No horizontal scroll

- Status: `[x]`
- Files: solver layout and `src/app/globals.css`
- Verification: Earlier in this project, a 390×844 layout measurement showed `scrollWidth === clientWidth`. The later CSS change only shortens motion for `prefers-reduced-motion`.
- Remaining: Repeat on a physical phone after launch.

### 45. Touch-friendly tiles and keyboard

- Status: `[~]`
- Files: `src/components/Solver/LetterTile.tsx`, `src/components/Solver/VirtualKeyboard.tsx`
- Verification: At 390×844, tiles were about 66px and keyboard keys were at least 44px tall. The narrowest key was about 32px wide.
- Remaining: Wide keys are still tight on a small phone. Check them on a physical device before changing the layout.

### 46. Visible focus and keyboard use

- Status: `[x]`
- Files: `src/app/globals.css`, `src/hooks/useSolver.ts`
- Verification: `focus-visible` outlines cover tiles, buttons, links, summaries, inputs, and textareas. Letter keys, Backspace, and Enter are handled outside text fields. Reduced-motion preferences shorten transitions.
- Remaining: none in code. A screen reader pass on a real device is still worth doing.

### 47. Accessible tile names

- Status: `[x]`
- Files: `src/components/Solver/LetterTile.tsx`
- Verification: Each tile exposes its letter and feedback state in its accessible name. Lighthouse accessibility scored 100 on the mobile lab run.
- Remaining: none from the automated audit.

### 48. Feedback is not color alone

- Status: `[x]`
- Files: `src/components/Solver/LetterTile.tsx`, `src/components/Solver/FeedbackControls.tsx`
- Verification: Green, yellow, and gray tiles use ✓, ●, and × plus text labels.
- Remaining: none.

### 49. Readable size and contrast

- Status: `[x]`
- Files: `src/app/globals.css`
- Verification: Lighthouse accessibility, including its contrast audits, scored 100 in the mobile lab run. Body text uses the existing paper-on-ink tokens.
- Remaining: Lab only. It does not replace a check with a user’s own display settings.

### 50. Real mobile browsers

- Status: `[E]`
- Files: none
- Verification: Only emulated viewports were used.
- Remaining: Solve one puzzle in Safari on iOS and Chrome on Android.

### 51. Results do not jump excessively

- Status: `[~]`
- Files: `src/components/Solver/CandidateList.tsx`
- Verification: Load CLS was 0.009 in the lab run. The candidate list has a minimum height. CLS during a guess submission was not measured separately.
- Remaining: Watch layout shift while submitting a guess on a phone.

## 7. Structured data and trust

### 52. WebSite structured data

- Status: `[x]`
- Files: `src/components/seo/SiteJsonLd.tsx`
- Verification: Homepage JSON-LD includes `WebSite` with the configured origin, the site name, and a description that matches the tool. No `SearchAction` was added.
- Remaining: The URL will change when the production origin is set.

### 53. SoftwareApplication structured data

- Status: `[x]`
- Files: `src/components/seo/SiteJsonLd.tsx`
- Verification: The node is `SoftwareApplication` / `UtilitiesApplication`, operating system `Web`, `isAccessibleForFree: true`, and an Offer of price `0` USD. There is no rating, review, author, or endorsement.
- Remaining: Validate on the public URL. A price of zero matches the current free tool.

### 54. Rich Results Test

- Status: `[E]`
- Files: none
- Verification: JSON-LD parses as two script blocks on the homepage: the site graph and the FAQ page. Google’s Rich Results Test was not run.
- Remaining: Test the public homepage and both guide URLs after deployment.

### 55. About, Contact, Privacy, and Terms

- Status: `[~]`
- Files: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/privacy-policy/page.tsx`, `src/app/terms/page.tsx`, `src/components/contact/ContactForm.tsx`
- Verification: All four routes return 200 with unique titles. Contact says there is no monitored email yet. The form does not send or store the message. A valid `NEXT_PUBLIC_CONTACT_EMAIL` would show a mailto link.
- Remaining: Add a real monitored email when you have one. Do not invent an address, phone number, or business registration.

### 56. Explain the solver and the ranking

- Status: `[x]`
- Files: `src/app/about/page.tsx`, `src/components/home/Guide.tsx`, `src/app/guides/best-next-guess/page.tsx`
- Verification: About and the next-guess guide describe two-pass filtering, frequency ranking, and expected remaining candidates.
- Remaining: none.

### 57. Data and advertising disclosures match the site

- Status: `[x]`
- Files: `src/app/privacy-policy/page.tsx`
- Verification: The policy says guesses stay in memory, the dictionary is a static fetch, the contact form is not sent, there is no analytics tag, no site-owned tracking cookie, no advertising, and no sale of personal information. It also says hosting can keep ordinary server logs, and future ads would be disclosed first.
- Remaining: Update the policy before adding analytics or ads.

### 58. Word-list licensing and trademark

- Status: `[~]`
- Files: `src/app/about/page.tsx`, `src/app/terms/page.tsx`, `public/data/*.txt`
- Verification: Answer order comes from the first20hours Google 10,000 English 20k compilation. Allowed guesses add five-letter words from the macOS web2 list, described on the site as the 1934 Webster’s Second International list in the public domain. The frequency compilation has no license file in this project. The site states it is not affiliated with The New York Times and that Wordle is their trademark. The official answer list was not copied.
- Remaining: You need to decide whether the frequency compilation is acceptable for a commercial, ad-supported site. This tracker does not clear that license.

### 59. No invented ratings

- Status: `[x]`
- Files: `src/components/seo/SiteJsonLd.tsx`
- Verification: JSON-LD has no `aggregateRating` and no `review`. Visible pages do not show stars or testimonials.
- Remaining: none.

## 8. Internal linking and content structure

### 60. Homepage links to useful guides

- Status: `[x]`
- Files: `src/components/home/Guide.tsx`, `src/components/layout/Footer.tsx`
- Verification: The guide section and footer link to `/guides/repeated-letters` and `/guides/best-next-guess`.
- Remaining: none.

### 61. Descriptive anchors

- Status: `[x]`
- Files: header, footer, guides
- Verification: Link text names the destination, such as “Repeated letters” and “Next guesses.”
- Remaining: none.

### 62. Repeated-letter guide

- Status: `[x]`
- Files: `src/app/guides/repeated-letters/page.tsx`
- Verification: The page explains the two passes with APPLE against ALLEY and links back to the solver. It is original to this implementation.
- Remaining: none.

### 63. Next-guess guide

- Status: `[x]`
- Files: `src/app/guides/best-next-guess/page.tsx`
- Verification: The page describes the same frequency-then-expected-remaining method as `rankGuesses`.
- Remaining: none.

### 64. Guides link back to the solver

- Status: `[x]`
- Files: both guide pages
- Verification: Each guide includes a link to `/` and to the other guide, plus breadcrumb structured data.
- Remaining: none.

### 65. No duplicate keyword pages

- Status: `[x]`
- Files: `next.config.ts`, `tests/site.test.ts`
- Verification: `/wordle-helper` redirects to `/`. The same redirect exists for finder, help, and cheat. Those paths are excluded from `PUBLIC_PATHS`.
- Remaining: none.

### 66. No thin word or pattern pages

- Status: `[x]`
- Files: `src/app`
- Verification: The route list is the solver, two guides, four trust pages, icon, social image, robots, and sitemap. There is no page per word or per pattern.
- Remaining: none.

### 67. Important pages are a few clicks away

- Status: `[x]`
- Files: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`
- Verification: Solver, how-to, both guides, About, Contact, Privacy, and Terms are in the header or footer on every page.
- Remaining: none.

## 9. Google Search Console and launch

### 68. Verify the domain in Search Console

- Status: `[E]`
- Files: `src/app/layout.tsx` reads optional `GOOGLE_SITE_VERIFICATION`
- Verification: No verification token is configured. No Google account was accessed.
- Remaining: Add the DNS or HTML-tag token yourself, then confirm the property.

### 69. Submit the sitemap

- Status: `[E]`
- Files: `src/app/sitemap.ts`
- Verification: Sitemap code exists. It has not been submitted.
- Remaining: After the public origin is indexable, submit `https://<your-domain>/sitemap.xml`.

### 70. Inspect the homepage

- Status: `[E]`
- Files: none
- Verification: Local fetch only.
- Remaining: Use URL Inspection on the public homepage.

### 71. Check robots, canonicals, and status codes

- Status: `[x]`
- Files: `scripts/check-seo.ts`
- Verification: Local production check passed for routes, robots, sitemap shape, canonical, title, and H1. This was not a Search Console check.
- Remaining: Repeat the same URLs in Search Console after launch.

### 72. URL Inspection for supporting pages

- Status: `[E]`
- Files: none
- Verification: Not available without Search Console.
- Remaining: Inspect both guides, About, Contact, Privacy, and Terms.

### 73. No accidental noindex on the public site

- Status: `[~]`
- Files: `src/lib/site.ts`, `src/app/layout.tsx`
- Verification: Local and non-https origins are `noindex` by design. The indexable branch was read in code and was not executed, because no public https origin is configured.
- Remaining: View source on the deployed homepage and confirm `index, follow`.

### 74. Sitemap URLs match canonicals

- Status: `[~]`
- Files: `src/app/sitemap.ts`, `src/lib/site.ts`
- Verification: The local sitemap correctly lists nothing while the site is `noindex`. `absoluteUrl` is what both canonicals and the sitemap will use.
- Remaining: Compare each `<loc>` with the canonical on that URL after deployment.

### 75. One trailing-slash convention

- Status: `[x]`
- Files: `next.config.ts`
- Verification: `trailingSlash: false`. `/about/` returned 308 on the local production server. Canonicals have no trailing slash.
- Remaining: none.

### 76. Privacy-appropriate analytics

- Status: `[E]`
- Files: `src/app/privacy-policy/page.tsx`, `docs/seo-monitoring-plan.md`
- Verification: No analytics script is installed. The privacy policy says there is no analytics tag.
- Remaining: Ask before adding a provider. Update the privacy policy in the same change. Do not send guess text.

### 77. Launch date and baseline metrics

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: The site has not been launched on a public domain. The lab Lighthouse numbers are recorded as a local baseline only.
- Remaining: Record the launch date when the public origin goes live.

## 10. AdSense readiness

### 78. The tool works and has original value

- Status: `[x]`
- Files: solver engine and homepage guide
- Verification: Unit tests cover scoring, filtering, ranking, clue filtering, and validation. The homepage explains the method instead of copying another solver’s wording.
- Remaining: Approval is not implied.

### 79. Accurate ownership and contact

- Status: `[E]`
- Files: `src/app/contact/page.tsx`, `.env.example`
- Verification: No owner name, address, phone, or monitored email is configured.
- Remaining: Add the contact details you actually monitor. AdSense review of ownership cannot be completed from this repository alone.

### 80. Privacy matches current practice

- Status: `[x]`
- Files: `src/app/privacy-policy/page.tsx`
- Verification: Compared with the code: no analytics, no ad script, no solver storage, contact form stays in the browser.
- Remaining: Rewrite the advertising section before applying, if ads are present by then.

### 81. Navigation works

- Status: `[x]`
- Files: header and footer
- Verification: `check-seo` fetched every public path at 200, including the pages linked from the footer.
- Remaining: none.

### 82. No copied or mass-produced pages

- Status: `[x]`
- Files: `src/app`, `src/components/home/Guide.tsx`
- Verification: Seven content URLs, written for this solver. No generated city, word, or keyword pages.
- Remaining: none.

### 83. Ads would not look like tiles or controls

- Status: `[x]`
- Files: none added
- Verification: The repository has no AdSense script and no ad placeholder. The solver grid, keyboard, and result buttons are the only tile-like controls.
- Remaining: Keep future ads visually separate from those controls.

### 84. Publisher-policy review

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: Code review only. No policy-violating ad implementation is present because no ad implementation is present.
- Remaining: Read the current AdSense program policies against the live site, including the word-list license in task 58.

### 85. Apply only when the public site is ready

- Status: `[E]`
- Files: none
- Verification: No application was submitted.
- Remaining: Apply from your own AdSense account after the domain, contact details, and license review are done. Approval is not guaranteed.

## 11. Post-launch SEO monitoring

### 86. Impressions, clicks, CTR, and average position

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: No Search Console property.
- Remaining: Review the Performance report after data exists. Do not treat the absence of data as a ranking result.

### 87. Indexing status

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: Local pages are deliberately not indexable.
- Remaining: Check Page indexing after the sitemap is submitted.

### 88. Field Core Web Vitals

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: Lab LCP and CLS are recorded in task 42. Field INP, LCP, and CLS are unavailable.
- Remaining: Use the Search Console Core Web Vitals report, not the local Lighthouse score.

### 89. Mobile usability

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: Emulated layout and a lab accessibility score only.
- Remaining: Check the Search Console mobile usability report and a physical phone.

### 90. Solver usage

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: No analytics events are sent.
- Remaining: If you later authorize analytics, start with aggregate events and update the privacy policy first.

### 91. Completed solving sessions

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: The solver can reach a solved state in the client. That state is not reported anywhere.
- Remaining: Same as task 90. A future event could be `puzzle_completed` with no guess text.

### 92. Errors and zero-candidate cases

- Status: `[E]`
- Files: `src/hooks/useSolver.ts`
- Verification: Invalid words and empty candidate lists are shown in the page. They are not logged to a server.
- Remaining: If these are counted later, count the event only. Do not store the typed guesses.

### 93. Queries for solver, helper, finder, and help

- Status: `[E]`
- Files: `docs/seo-monitoring-plan.md`
- Verification: No query data.
- Remaining: After enough Search Console history, filter queries containing solver, helper, finder, and help. Compare them with the homepage rather than creating new near-duplicate URLs.
