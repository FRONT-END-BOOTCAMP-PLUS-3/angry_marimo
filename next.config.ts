import type { NextConfig } from "next"

import path from "path"

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias["@marimo"] = path.resolve(__dirname, "app")
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    })

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.toss.im",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "angry-marimo.com",
        pathname: "/storage/**",
      },
    ],
  },
}

export default nextConfig
