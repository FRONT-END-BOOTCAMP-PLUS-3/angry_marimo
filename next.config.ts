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
    domains: ["static.toss.im", "localhost", "angry-marimo.com"],
  },
}

export default nextConfig
