# SEO monitoring plan

This plan is preparation. The public site has not launched, Search Console is not connected, and analytics is not installed.

## Launch record

| Item | Status on 2026-10-22 |
| --- | --- |
| Launch date | Not launched |
| Production domain | Not chosen. Set `NEXT_PUBLIC_SITE_URL` before the production build. |
| Sitemap URL | `https://<production-origin>/sitemap.xml` after that origin is indexable |
| Search Console | Not verified. No sitemap submitted. No URL Inspection. |
| Analytics | Not installed. The privacy policy says there is no analytics tag. |

## Initial indexability checks

Checked against a local production server at `http://127.0.0.1:3001` with `NEXT_PUBLIC_SITE_URL` set to that same origin. This origin is a verification host, not the public site.

- Public routes returned 200: `/`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/guides/repeated-letters`, `/guides/best-next-guess`.
- `/this-page-does-not-exist` returned 404.
- `/wordle-helper` and `/about/` returned 308.
- Homepage canonical was `http://127.0.0.1:3001`.
- Homepage robots meta was `noindex, nofollow`.
- `/robots.txt` was `Disallow: /`.
- `/sitemap.xml` was an empty urlset.
- A production build with no site URL failed instead of emitting localhost canonicals.

After the real domain is deployed, repeat those checks on https. The homepage should then be `index, follow`, robots.txt should allow `/`, and the sitemap should list the seven public URLs.

## Baseline laboratory measurements

Lighthouse 13.5.0, mobile, lab data only. URL: `http://127.0.0.1:3001/`. Fetched: 2026-10-22T16:43:09Z.

| Metric | Result |
| --- | --- |
| Performance | 89 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 66 |
| LCP | 2.9 s |
| CLS | 0.009 |
| Total blocking time | 280 ms |
| Speed index | 3.1 s |
| INP | Not reported by this lab run |

The SEO score failed one audit, `is-crawlable`, because the local server is intentionally noindex. That score is not a public-site SEO result. PageSpeed Insights and field Core Web Vitals were not collected.

Homepage JavaScript on that build: 609,558 bytes raw, 187,814 bytes gzipped, across 9 files. The word lists are fetched from `/data/`, not bundled.

## Search Console setup

1. Choose the https origin and deploy with `NEXT_PUBLIC_SITE_URL`.
2. Add a domain or URL-prefix property.
3. If you use the HTML tag method, put the token in `GOOGLE_SITE_VERIFICATION` and rebuild.
4. Confirm the live homepage is indexable, then submit the sitemap.
5. Inspect `/`, both guides, and the four trust pages.
6. Record the launch date in the table above.

## Review schedule

- Week 1: indexing coverage, robots.txt status, and sitemap status.
- Week 4: queries, impressions, clicks, CTR, and average position. Filter for solver, helper, finder, and help.
- Every month after that: the same query set, plus Core Web Vitals and mobile usability.
- After any dictionary, ranking, or layout change: run `npm run check:seo` against the deployed origin and a mobile Lighthouse lab run.

Do not create a new URL because a query variant appears. The homepage already covers solver, helper, finder, and help.

## Solver interaction metrics

No events are collected. Adding them needs an analytics provider, a privacy-policy update, and your authorization.

If that happens, keep the events aggregate:

- `solver_started`
- `guess_submitted`
- `recommendation_shown`
- `puzzle_completed`
- `solver_reset`

Do not send the guess, the color pattern, the candidate list, or the recommendation word. A zero-candidate count can be a number. It should not include the typed row.

## What this document does not claim

There is no ranking, impression, click, or field Core Web Vitals result to report. The local Lighthouse numbers are a laboratory baseline for one machine and one local origin.
