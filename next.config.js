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
  compiler: {
    styledComponents: true, 
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.satlaa.com" },
      { protocol: "https", hostname: "uat.satlaa.com" },
      { protocol: "https", hostname: "satlaa.com" },
      { protocol: "https", hostname: "www.facebook.com" },
      { protocol: "https", hostname: "cms.satlaa.com" },
      { protocol: "https", hostname: "satlaa.vercel.app" }
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

module.exports = withPWA(
  withBundleAnalyzer(withSentryConfig(nextConfig, sentryWebpackPluginOptions))
);