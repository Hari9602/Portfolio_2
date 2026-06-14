import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export — required for GitHub Pages (no Node server).
  output: "export",
  // Served from the root of a custom domain (harikrishnanvj.is-a.dev), so no basePath.
  images: {
    unoptimized: true,
  },
  // Emit /about/ style folders with index.html — friendlier on static hosts.
  trailingSlash: true,
};

export default nextConfig;
