import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for Docker / Dokploy deploys.
  // Produces .next/standalone/server.js with only the deps Next traced.
  output: "standalone",
};

export default nextConfig;
