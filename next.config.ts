import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // TypeScriptのエラーを無視してビルドする
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLintのエラーを無視してビルドする
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;