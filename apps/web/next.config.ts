import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@vastumandal/core-math", "@vastumandal/dwg-schemas", "@vastumandal/dxf-exporter"],
  serverExternalPackages: ["canvas", "konva"]
};

export default withSerwist(nextConfig);
