import type { NextConfig } from "next";

const localPreview = process.env.NODE_ENV === "development" && process.env.CONSULTORIA_LOCAL_API_PROXY === "true";

const nextConfig: NextConfig = {
  distDir: localPreview ? ".next-consultoria-preview" : ".next",
  skipTrailingSlashRedirect: localPreview,
  async rewrites() {
    // Encaminhamento opt-in para homologação local; produção continua no Nginx.
    if (!localPreview) return [];
    return [{ source: "/api/v1/:path*", destination: "http://127.0.0.1:8000/api/v1/:path*/" }];
  },
  async headers() {
    return [{
      source: "/sw.js",
      headers: [
        { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
      ],
    }];
  },
};

export default nextConfig;
