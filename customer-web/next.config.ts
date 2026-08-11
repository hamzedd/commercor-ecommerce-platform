import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: ["64.227.115.11"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "64.227.115.11", // Replace with your actual domain
        port: "", // Leave empty if no specific port, or specify like '9000'
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "64.227.115.11",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
