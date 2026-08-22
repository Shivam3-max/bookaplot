import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mysql2"],
  turbopack: { root: process.cwd() },
};

export default nextConfig;
