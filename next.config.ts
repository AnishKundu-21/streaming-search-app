/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**", // Allows all paths under /t/p/ for TMDB images
      },
    ],
  },
};

module.exports = nextConfig;
