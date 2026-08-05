import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_API_URL ?? "http://localhost:5241";

// Uploaded product/profile images are served by the backend, wherever it lives.
const backend = new URL(backendUrl);

const nextConfig: NextConfig = {
  // Self-contained server bundle — what gets deployed to Azure App Service.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: backend.protocol.replace(":", "") as "http" | "https",
        hostname: backend.hostname,
        ...(backend.port ? { port: backend.port } : {}),
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "fdn2.gsmarena.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fdn.gsmarena.com",
        pathname: "/**",
      },
      // Product photos referenced by URL from retailer sites. Every new host has to be
      // listed here or next/image answers 400 and the picture silently never appears —
      // adding a product image is therefore a code change plus a redeploy. Uploading
      // through the app instead (stored on the API) avoids that entirely.
      { protocol: "https", hostname: "iphone.biz.pk", pathname: "/**" },
      { protocol: "https", hostname: "bsimg.nl", pathname: "/**" },
      { protocol: "https", hostname: "pakistanstore.pk", pathname: "/**" },
      { protocol: "https", hostname: "pisces.bbystatic.com", pathname: "/**" },
      { protocol: "https", hostname: "powerhouseexpress.com.pk", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/bff/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;