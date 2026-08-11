import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const filesBaseUrl = process.env.NEXT_PUBLIC_FILES_BASE_URL;
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (filesBaseUrl) {
  try {
    const filesUrl = new URL(filesBaseUrl);
    if (filesUrl.protocol === "http:" || filesUrl.protocol === "https:") {
      remotePatterns.push({
        protocol: filesUrl.protocol.slice(0, -1) as "http" | "https",
        hostname: filesUrl.hostname,
        port: filesUrl.port,
        pathname: "/**",
      });
    }
  } catch {
    // Invalid values fail naturally where URLs are consumed at runtime.
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns,
    unoptimized: true,
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
