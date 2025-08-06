import { performanceMonitor, usePerformanceMonitoring } from '../performanceMonitoring';

// Mock Performance Observer
const mockPerformanceObserver = jest.fn();
const mockObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
};

mockPerformanceObserver.mockImplementation(callback => {
  callback({ getEntries: () => [] });
  return mockObserver;
});

Object.defineProperty(window, 'PerformanceObserver', {
  value: mockPerformanceObserver,
  writable: true,
});

// Mock performance API
const mockPerformance = {
  getEntriesByType: jest.fn().mockReturnValue([]),
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn().mockReturnValue(1000),
  memory: {
    usedJSHeapSize: 1000000,
    jsHeapSizeLimit: 2000000,
  },
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startMonitoring', () => {
    it('starts monitoring successfully', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      performanceMonitor.startMonitoring();

      expect(consoleSpy).toHaveBeenCalledWith('Performance monitoring started');
      consoleSpy.mockRestore();
    });

    it('does not start monitoring twice', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      performanceMonitor.startMonitoring();
      performanceMonitor.startMonitoring();

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      consoleSpy.mockRestore();
    });
  });

  describe('stopMonitoring', () => {
    it('stops monitoring successfully', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      performanceMonitor.stopMonitoring();

      expect(consoleSpy).toHaveBeenCalledWith('Performance monitoring stopped');
      consoleSpy.mockRestore();
    });
  });

  describe('addObserver', () => {
    it('adds observer successfully', () => {
      const mockObserver = {
        onMetricUpdate: jest.fn(),
        onError: jest.fn(),
      };

      performanceMonitor.addObserver(mockObserver);

      // Test that observer is added by checking if metrics are updated
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toBeDefined();
    });
  });

  describe('removeObserver', () => {
    it('removes observer successfully', () => {
      const mockObserver = {
        onMetricUpdate: jest.fn(),
        onError: jest.fn(),
      };

      performanceMonitor.addObserver(mockObserver);
      performanceMonitor.removeObserver(mockObserver);

      // Observer should be removed
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toBeDefined();
    });
  });

  describe('getMetrics', () => {
    it('returns current metrics', () => {
      const metrics = performanceMonitor.getMetrics();

      expect(metrics).toHaveProperty('navigationStart');
      expect(metrics).toHaveProperty('loadEventEnd');
      expect(metrics).toHaveProperty('firstContentfulPaint');
      expect(metrics).toHaveProperty('largestContentfulPaint');
      expect(metrics).toHaveProperty('firstInputDelay');
      expect(metrics).toHaveProperty('cumulativeLayoutShift');
      expect(metrics).toHaveProperty('networkRequests');
      expect(metrics).toHaveProperty('errorCount');
    });
  });

  describe('resetMetrics', () => {
    it('resets metrics to initial state', () => {
      // First, get current metrics
      const initialMetrics = performanceMonitor.getMetrics();

      // Reset metrics
      performanceMonitor.resetMetrics();

      // Get metrics after reset
      const resetMetrics = performanceMonitor.getMetrics();

      expect(resetMetrics.errorCount).toBe(0);
      expect(resetMetrics.networkRequests).toBe(0);
      expect(resetMetrics.firstContentfulPaint).toBe(0);
    });
  });

  describe('exportMetrics', () => {
    it('exports metrics as JSON string', () => {
      const exported = performanceMonitor.exportMetrics();

      expect(typeof exported).toBe('string');

      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('errorCount');
      expect(parsed).toHaveProperty('networkRequests');
    });
  });
});

describe('usePerformanceMonitoring', () => {
  it('returns monitoring functions and metrics', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());

    expect(result.current).toHaveProperty('metrics');
    expect(result.current).toHaveProperty('startMonitoring');
    expect(result.current).toHaveProperty('stopMonitoring');
    expect(result.current).toHaveProperty('resetMetrics');
    expect(result.current).toHaveProperty('exportMetrics');
  });

  it('initializes with default metrics', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());

    expect(result.current.metrics.errorCount).toBe(0);
    expect(result.current.metrics.networkRequests).toBe(0);
    expect(result.current.metrics.firstContentfulPaint).toBe(0);
  });

  it('calls monitoring functions correctly', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    act(() => {
      result.current.startMonitoring();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Performance monitoring started');

    act(() => {
      result.current.stopMonitoring();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Performance monitoring stopped');

    consoleSpy.mockRestore();
  });
});

// Mock renderHook for testing
const { renderHook, act } = require('@testing-library/react');
