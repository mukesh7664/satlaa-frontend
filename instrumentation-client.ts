import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: "https://2fad8d890ea14775b6ed9d9d9b62bbcb@o1298688.ingest.sentry.io/4505408996048896",
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  enabled: process.env.NODE_ENV !== 'development',
});