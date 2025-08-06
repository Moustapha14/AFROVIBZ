import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isInstalled: boolean;
  isUpdated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isUpdated: false,
    isLoading: false,
    error: null,
  });

  const registerServiceWorker = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Service Worker non supporté' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered:', registration);

      // Vérifier si c'est une mise à jour
      if (registration.waiting) {
        setState(prev => ({ ...prev, isUpdated: true }));
      }

      // Écouter les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, isUpdated: true }));
            }
          });
        }
      });

      // Écouter les changements d'état
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setState(prev => ({ ...prev, isInstalled: true, isUpdated: false }));
      });

      setState(prev => ({
        ...prev,
        isInstalled: !!navigator.serviceWorker.controller,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setState(prev => ({
        ...prev,
        error: "Échec de l'enregistrement du Service Worker",
        isLoading: false,
      }));
    }
  }, [state.isSupported]);

  const updateServiceWorker = useCallback(() => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  }, []);

  const unregisterServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      setState(prev => ({ ...prev, isInstalled: false, isUpdated: false }));
    }
  }, []);

  // Enregistrer automatiquement au montage
  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  // Écouter les messages du Service Worker
  useEffect(() => {
    if (!state.isSupported) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('Cache updated:', event.data.payload);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [state.isSupported]);

  return {
    ...state,
    registerServiceWorker,
    updateServiceWorker,
    unregisterServiceWorker,
  };
}

// Hook pour les notifications push
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Notifications non supportées');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  const subscribeToPush = useCallback(async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      setSubscription(pushSubscription);
      return pushSubscription;
    } catch (error) {
      console.error("Erreur lors de l'abonnement aux notifications:", error);
      return null;
    }
  }, [permission, requestPermission]);

  const unsubscribeFromPush = useCallback(async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
    }
  }, [subscription]);

  return {
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
  };
}

// Hook pour le cache
export function useCache() {
  const [cacheSize, setCacheSize] = useState<number>(0);

  const getCacheSize = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();

        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      setCacheSize(totalSize);
      return totalSize;
    }
    return 0;
  }, []);

  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCacheSize(0);
    }
  }, []);

  const preloadResource = useCallback(async (url: string) => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('afrovibz-dynamic-v1.0.0');
        await cache.add(url);
        console.log('Resource preloaded:', url);
      } catch (error) {
        console.error('Failed to preload resource:', url, error);
      }
    }
  }, []);

  return {
    cacheSize,
    getCacheSize,
    clearCache,
    preloadResource,
  };
}
