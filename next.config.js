/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([])

module.exports = withTM({
  // any other general next.js settings
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'images.unsplash.com',
      'maps.googleapis.com',
    ],
  },
})
