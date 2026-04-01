/** @type {import('next').NextConfig} */
const corsAllowOrigin = process.env.CORS_ALLOW_ORIGIN || "*";
const corsAllowCredentials = corsAllowOrigin === "*" ? "false" : "true";

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: corsAllowCredentials },
          { key: "Access-Control-Allow-Origin", value: corsAllowOrigin },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Authorization, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
