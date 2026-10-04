import type { NextConfig } from "next";

// static HTML in out/, so it can be hosted anywhere (GitHub Pages, Vercel, Netlify)
const nextConfig: NextConfig = { output: "export", trailingSlash: true };

export default nextConfig;
