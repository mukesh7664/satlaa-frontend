const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const { withSentryConfig } = require("@sentry/nextjs");
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV === "development",
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
});
const sentryWebpackPluginOptions = {
  // Sentry options are copied here from your previous configuration
  silent: true,
  org: "satlaa-tech",
  project: "satlaa",
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
};

const nextConfig = {
  swcMinify: true,
  compiler: {
    // SWC compiler configuration for import on demand
    styledComponents: true, // If you are using styled-components
    removeConsole: process.env.NODE_ENV === "production", // To remove console statements in production
  },
  images: {
    domains: [
      "localhost",
      "api.satlaa.com",
      "uat.satlaa.com",
      "satlaa.com",
      "www.facebook.com",
      "cms.satlaa.com",
      "satlaa.vercel.app",
    ],
  },

  webpack(config, options) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    });

    return config;
  },
};

// module.exports = nextConfig;
module.exports = withPWA(
  withBundleAnalyzer(withSentryConfig(nextConfig, sentryWebpackPluginOptions))
);
