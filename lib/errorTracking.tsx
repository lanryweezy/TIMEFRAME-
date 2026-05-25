/**
 * Error Tracking Service using Sentry (#95)
 * Captures and reports errors in production
 */

import * as Sentry from '@sentry/react';

// Initialize Sentry with configuration
export function initErrorTracking() {
  const env = (import.meta as any).env;
  const dsn = env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn('Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance monitoring
    tracesSampleRate: 1.0,
    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Environment
    environment: (import.meta as any).env.MODE,
    // Release tracking
    release: `timeframe-studio@${(import.meta as any).env.VITE_APP_VERSION || '1.0.0'}`,
    // Filter events
    beforeSend(event) {
      // Don't send events in development
      if ((import.meta as any).env.DEV) {
        return null;
      }
      return event;
    },
  });
}

// Error boundary wrapper component
export function ErrorTracker({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }: any) => (
        <div className="flex flex-col items-center justify-center h-screen bg-midnight text-white p-8">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
          <p className="text-zinc-400 mb-6 text-center max-w-lg">
            {error.message || 'An unexpected error occurred. Our team has been notified.'}
          </p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-studio-accent hover:bg-studio-accent-hover rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

// Helper to capture custom errors
export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Helper to capture messages
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

// Set user context
export function setUserContext(user: { id: string; email?: string; username?: string } | null) {
  Sentry.setUser(user);
}

// Add breadcrumb for tracking user actions
export function addBreadcrumb(category: string, message: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info',
  });
}

export { Sentry };