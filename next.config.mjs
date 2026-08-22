/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mysql2"],
  turbopack: { root: process.cwd() },
};

export default nextConfig;
