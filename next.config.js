/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig, // Add the nextConfig object to the exported configuration
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_SECRET,
  },
}
