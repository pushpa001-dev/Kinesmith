import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export: the site has no server-side needs, so `next build` emits a
   * plain folder that drops onto Netlify, Cloudflare Pages, GitHub Pages or an
   * S3 bucket unchanged. Remove this if you later add API routes or ISR.
   */
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
