import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server instrumentation code
    Sentry.init({
      dsn: "https://2fad8d890ea14775b6ed9d9d9b62bbcb@o1298688.ingest.sentry.io/4505408996048896",
      tracesSampleRate: 1,
      debug: false,
    });
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation code
    Sentry.init({
      dsn: "https://2fad8d890ea14775b6ed9d9d9b62bbcb@o1298688.ingest.sentry.io/4505408996048896",
      tracesSampleRate: 1,
      debug: false,
    });
  }
}

// Define onRequestError at the module level, not inside register()
export function onRequestError({ request, response, error }) {
  Sentry.captureRequestError({
    request,
    response,
    error,
  });
}