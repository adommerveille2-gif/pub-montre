import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // Import de cours jusqu'à 15 Mo, plus une marge pour l'encodage du formulaire.
      bodySizeLimit: "16mb",
    },
  },
  // Paquet monorepo écrit en TypeScript source.
  transpilePackages: ["@pub-montre/db", "@pub-montre/core"],
  serverExternalPackages: ["pg", "nodemailer"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
