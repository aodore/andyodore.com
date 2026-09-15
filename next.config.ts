import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is the default for photos. Case-study UI shots use 90 so type stays sharp.
    qualities: [75, 90],
  },
};

export default nextConfig;
