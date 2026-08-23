import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@vastumandal/core-math", "@vastumandal/dwg-schemas", "@vastumandal/dxf-exporter", "@vastumandal/core-spatial", "@vastumandal/core-structural", "@vastumandal/core-estimator", "@vastumandal/ifc-exporter"],
  serverExternalPackages: ["canvas", "konva"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/examples/jsm/utils/BufferGeometryUtils': require('path').resolve(__dirname, 'src/utils/BufferGeometryUtils.js'),
    };
    return config;
  }
};

export default withSerwist(nextConfig);
