const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export const PRODUCTION_ORIGIN = "https://wordlesolve.net";

export const PUBLIC_PATHS = [
  "/",
  "/guides/repeated-letters",
  "/guides/best-next-guess",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
] as const;

export function siteUrl(): URL {
  return resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV);
}

export function resolveSiteUrl(configured: string | undefined, nodeEnv: string | undefined): URL {
  const value = configured?.trim();
  if (!value) {
    if (nodeEnv === "production") return new URL(PRODUCTION_ORIGIN);
    return new URL("http://localhost:3000");
  }

  const url = new URL(value);
  const local = LOCAL_HOSTS.has(url.hostname);
  if (nodeEnv === "production" && !local && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use https for a public production origin.");
  }
  return url;
}

export function absoluteUrl(path: string): string {
  const url = new URL(path, siteUrl());
  if (path === "/") return url.origin;
  return url.toString().replace(/\/$/, "");
}

export function isIndexableSite(): boolean {
  const url = siteUrl();
  if (url.protocol !== "https:") return false;
  if (LOCAL_HOSTS.has(url.hostname)) return false;
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production";
  return process.env.NODE_ENV === "production";
}
