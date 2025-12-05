import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/.prisma/client/**/*"],

    "/*": ["./node_modules/.prisma/client/**/*"],
  },
  /* config options here */
};

export default nextConfig;
