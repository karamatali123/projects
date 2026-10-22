import type { NextConfig } from "next";
import { keywordRedirects } from "./redirects";

const nextConfig: NextConfig = {
  trailingSlash: true,
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return keywordRedirects;
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
