import * as Sentry from '@sentry/nextjs';
import type { NodeOptions, VercelEdgeOptions } from '@sentry/nextjs';

const BASE_SENTRY_CONFIG = {
  dsn: "https://2fad8d890ea14775b6ed9d9d9b62bbcb@o1298688.ingest.sentry.io/4505408996048896",
  tracesSampleRate: 1,
  debug: false,
};

const NODE_SENTRY_CONFIG: NodeOptions = {
  ...BASE_SENTRY_CONFIG,
  maxBreadcrumbs: 50,
  beforeSend(event) {
    if (event.exception) {
      // Log to console instead of showing dialog
      console.error('Sentry captured exception:', event);
    }
    return event;
  },
};

const EDGE_SENTRY_CONFIG: VercelEdgeOptions = {
  ...BASE_SENTRY_CONFIG,
};

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init(NODE_SENTRY_CONFIG);
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init(EDGE_SENTRY_CONFIG);
  }
}

export function onRequestError({ request, response, error }) {
  try {
    // Safety check for required properties
    if (!request?.headers) {
      console.error('Invalid request object in onRequestError');
      return;
    }

    const errorEvent = {
      request: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
      },
      response: response ? {
        status: response.status,
        statusText: response.statusText,
      } : undefined,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause,
      } : String(error),
    };

    Sentry.captureException(error, {
      extra: errorEvent,
    });
  } catch (e) {
    console.error('Error in Sentry error handler:', e);
  }
}