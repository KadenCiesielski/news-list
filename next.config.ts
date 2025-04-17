import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEWS_API_KEY: process.env.NEWS_API_KEY,
  },
};

export default nextConfig;