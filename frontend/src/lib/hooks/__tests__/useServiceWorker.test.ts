import { renderHook, act, waitFor } from '@testing-library/react';

import { useServiceWorker, usePushNotifications, useCache } from '../useServiceWorker';

// Mock Service Worker API
const mockServiceWorker = {
  register: jest.fn(),
  ready: Promise.resolve({
    pushManager: {
      subscribe: jest.fn(),
    },
  }),
  controller: null,
};

const mockRegistration = {
  waiting: null,
  installing: null,
  updatefound: jest.fn(),
  addEventListener: jest.fn(),
  unregister: jest.fn(),
};

Object.defineProperty(window.navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
});

describe('useServiceWorker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockServiceWorker.register.mockResolvedValue(mockRegistration);
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useServiceWorker());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('registers service worker successfully', async () => {
    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      await result.current.registerServiceWorker();
    });

    expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js', {
      scope: '/',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles registration errors', async () => {
    const errorMessage = 'Registration failed';
    mockServiceWorker.register.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      await result.current.registerServiceWorker();
    });

    expect(result.current.error).toBe("Échec de l'enregistrement du Service Worker");
    expect(result.current.isLoading).toBe(false);
  });

  it('updates service worker when update is available', async () => {
    const mockController = {
      postMessage: jest.fn(),
    };
    mockServiceWorker.controller = mockController;

    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      result.current.updateServiceWorker();
    });

    expect(mockController.postMessage).toHaveBeenCalledWith({
      type: 'SKIP_WAITING',
    });
  });

  it('unregisters service worker', async () => {
    const { result } = renderHook(() => useServiceWorker());

    await act(async () => {
      await result.current.unregisterServiceWorker();
    });

    expect(mockRegistration.unregister).toHaveBeenCalled();
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.isUpdated).toBe(false);
  });
});

describe('usePushNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default permission state', () => {
    const { result } = renderHook(() => usePushNotifications());

    expect(result.current.permission).toBe('default');
    expect(result.current.subscription).toBeNull();
  });

  it('requests notification permission', async () => {
    const mockRequestPermission = jest.fn().mockResolvedValue('granted');
    Object.defineProperty(window, 'Notification', {
      value: {
        requestPermission: mockRequestPermission,
      },
      writable: true,
    });

    const { result } = renderHook(() => usePushNotifications());

    await act(async () => {
      const granted = await result.current.requestPermission();
      expect(granted).toBe(true);
    });

    expect(mockRequestPermission).toHaveBeenCalled();
    expect(result.current.permission).toBe('granted');
  });

  it('subscribes to push notifications', async () => {
    const mockSubscription = { endpoint: 'test-endpoint' };
    const mockSubscribe = jest.fn().mockResolvedValue(mockSubscription);

    mockServiceWorker.ready = Promise.resolve({
      pushManager: {
        subscribe: mockSubscribe,
      },
    });

    const { result } = renderHook(() => usePushNotifications());

    await act(async () => {
      const subscription = await result.current.subscribeToPush();
      expect(subscription).toEqual(mockSubscription);
    });

    expect(mockSubscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    expect(result.current.subscription).toEqual(mockSubscription);
  });

  it('unsubscribes from push notifications', async () => {
    const mockUnsubscribe = jest.fn().mockResolvedValue(true);
    const mockSubscription = { unsubscribe: mockUnsubscribe };

    const { result } = renderHook(() => usePushNotifications());
    result.current.subscription = mockSubscription;

    await act(async () => {
      await result.current.unsubscribeFromPush();
    });

    expect(mockUnsubscribe).toHaveBeenCalled();
    expect(result.current.subscription).toBeNull();
  });
});

describe('useCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with zero cache size', () => {
    const { result } = renderHook(() => useCache());

    expect(result.current.cacheSize).toBe(0);
  });

  it('calculates cache size', async () => {
    const mockCache = {
      keys: jest
        .fn()
        .mockResolvedValue([
          new Request('https://example.com/1'),
          new Request('https://example.com/2'),
        ]),
      match: jest.fn().mockResolvedValue({
        blob: jest.fn().mockResolvedValue({ size: 1024 }),
      }),
    };

    const mockCaches = {
      keys: jest.fn().mockResolvedValue(['cache1']),
      open: jest.fn().mockResolvedValue(mockCache),
    };

    Object.defineProperty(window, 'caches', {
      value: mockCaches,
      writable: true,
    });

    const { result } = renderHook(() => useCache());

    await act(async () => {
      await result.current.getCacheSize();
    });

    expect(mockCaches.keys).toHaveBeenCalled();
    expect(result.current.cacheSize).toBe(2048); // 2 * 1024
  });

  it('clears cache', async () => {
    const mockDelete = jest.fn().mockResolvedValue(true);
    const mockCaches = {
      keys: jest.fn().mockResolvedValue(['cache1', 'cache2']),
      delete: mockDelete,
    };

    Object.defineProperty(window, 'caches', {
      value: mockCaches,
      writable: true,
    });

    const { result } = renderHook(() => useCache());

    await act(async () => {
      await result.current.clearCache();
    });

    expect(mockDelete).toHaveBeenCalledTimes(2);
    expect(result.current.cacheSize).toBe(0);
  });

  it('preloads resources', async () => {
    const mockAdd = jest.fn().mockResolvedValue(undefined);
    const mockCache = {
      add: mockAdd,
    };

    const mockCaches = {
      open: jest.fn().mockResolvedValue(mockCache),
    };

    Object.defineProperty(window, 'caches', {
      value: mockCaches,
      writable: true,
    });

    const { result } = renderHook(() => useCache());

    await act(async () => {
      await result.current.preloadResource('https://example.com/resource');
    });

    expect(mockCaches.open).toHaveBeenCalledWith('afrovibz-dynamic-v1.0.0');
    expect(mockAdd).toHaveBeenCalledWith('https://example.com/resource');
  });
});
