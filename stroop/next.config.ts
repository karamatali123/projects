import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  trailingSlash: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return ["wordle-helper", "wordle-finder", "wordle-help", "wordle-cheat"].map((slug) => ({
      source: `/${slug}`,
      destination: "/",
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/data/:file",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
