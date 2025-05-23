/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ["cdn.builder.io"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};
