import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerUpdate {
  updateAvailable: boolean;
  updateReady: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker() {
  const [swState, setSwState] = useState<ServiceWorkerUpdate>({
    updateAvailable: false,
    updateReady: false,
    registration: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        setSwState((prev) => ({ ...prev, registration }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setSwState((prev) => ({ ...prev, updateAvailable: true }));
              }
            });
          }
        });

        // Check if there's already an update waiting
        if (registration.waiting) {
          setSwState((prev) => ({ ...prev, updateAvailable: true }));
        }
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  }, []);

  const activateUpdate = useCallback(() => {
    if (swState.registration?.waiting) {
      swState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setSwState((prev) => ({ ...prev, updateReady: true }));
    }
  }, [swState.registration]);

  const cacheUrls = useCallback(
    (urls: string[]) => {
      if (swState.registration?.active) {
        swState.registration.active.postMessage({
          type: 'CACHE_URLS',
          urls,
        });
      }
    },
    [swState.registration]
  );

  return {
    ...swState,
    activateUpdate,
    cacheUrls,
    isSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator,
  };
}