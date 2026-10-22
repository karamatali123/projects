import { PUBLIC_PATHS } from "../src/lib/site";

const base = (process.env.CHECK_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const failures: string[] = [];

function fail(message: string) {
  failures.push(message);
}

async function statusOf(path: string): Promise<{ status: number; location: string | null; body: string }> {
  const response = await fetch(new URL(path, `${base}/`), { redirect: "manual" });
  const body = response.status === 200 ? await response.text() : "";
  return { status: response.status, location: response.headers.get("location"), body };
}

async function main() {
  for (const path of PUBLIC_PATHS) {
    const result = await statusOf(path);
    if (result.status !== 200) fail(`${path} returned ${result.status}, expected 200`);
  }

  const missing = await statusOf("/this-page-does-not-exist");
  if (missing.status !== 404) fail(`missing route returned ${missing.status}, expected 404`);

  const alias = await statusOf("/wordle-helper");
  if (alias.status !== 308 && alias.status !== 301) {
    fail(`/wordle-helper returned ${alias.status}, expected a permanent redirect`);
  } else if (alias.location && new URL(alias.location, base).pathname !== "/") {
    fail(`/wordle-helper redirected to ${alias.location}`);
  }

  const slashed = await statusOf("/about/");
  if (slashed.status !== 308 && slashed.status !== 301) {
    fail(`/about/ returned ${slashed.status}, expected a redirect to /about`);
  }

  const home = await statusOf("/");
  const title = home.body.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (!title.toLowerCase().includes("wordle solver")) fail(`homepage title is "${title}"`);
  const canonical = home.body.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? "";
  if (!canonical) fail("homepage is missing a canonical URL");
  else {
    const canonicalUrl = new URL(canonical);
    if (canonicalUrl.protocol !== "http:" && canonicalUrl.protocol !== "https:") {
      fail(`canonical is not an absolute http(s) URL: ${canonical}`);
    }
    if (canonicalUrl.pathname !== "/" && canonicalUrl.pathname !== "") {
      fail(`homepage canonical includes a path: ${canonical}`);
    }
  }
  const h1Count = home.body.match(/<h1\b/g)?.length ?? 0;
  if (h1Count !== 1) fail(`homepage has ${h1Count} h1 elements`);
  if (/100% accurate|guaranteed win|official wordle product/i.test(home.body)) {
    fail("homepage contains an unsupported accuracy or affiliation claim");
  }
  if (!home.body.includes("application/ld+json")) fail("homepage is missing JSON-LD");

  const robots = await statusOf("/robots.txt");
  if (robots.status !== 200) fail(`robots.txt returned ${robots.status}`);
  if (!/User-Agent:\s*\*/i.test(robots.body)) fail("robots.txt is missing a user-agent rule");

  const sitemap = await statusOf("/sitemap.xml");
  if (sitemap.status !== 200) fail(`sitemap.xml returned ${sitemap.status}`);
  if (!sitemap.body.includes("<urlset")) fail("sitemap.xml is not a urlset");
  if (robots.body.includes("Disallow: /") && sitemap.body.includes("<loc>")) {
    fail("non-indexable robots.txt still lists sitemap URLs");
  }

  const words = await fetch(new URL("/data/answer-words.txt", `${base}/`));
  const cache = words.headers.get("cache-control") ?? "";
  if (words.status !== 200) fail(`answer list returned ${words.status}`);
  if (!/max-age=86400/i.test(cache)) fail(`answer list cache-control is "${cache}"`);

  if (failures.length > 0) {
    for (const message of failures) console.error(`FAIL ${message}`);
    process.exit(1);
  }
  console.log(`SEO route checks passed for ${base}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
