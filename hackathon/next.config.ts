import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
	domains: ['firebasestorage.googleapis.com'], // 追加
  },
};

export default nextConfig;
