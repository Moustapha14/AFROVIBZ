import { renderHook, act } from '@testing-library/react';

import { useDebounce, useMemoizedValue, useStableCallback } from '../usePerformance';

describe('usePerformance Hooks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('useDebounce', () => {
    it('debounces function calls', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 300));

      // Call the debounced function multiple times
      act(() => {
        result.current('test1');
        result.current('test2');
        result.current('test3');
      });

      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();

      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Function should be called only once with the last value
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');
    });

    it('cancels previous calls when new call is made', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 300));

      act(() => {
        result.current('first');
      });

      act(() => {
        jest.advanceTimersByTime(150); // Half way through
        result.current('second'); // This should cancel the first call
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('useMemoizedValue', () => {
    it('memoizes values correctly', () => {
      const expensiveCalculation = jest.fn(() => 'expensive result');

      const { result, rerender } = renderHook(
        ({ deps }) => useMemoizedValue(expensiveCalculation, deps),
        { initialProps: { deps: [1, 2] } }
      );

      expect(result.current).toBe('expensive result');
      expect(expensiveCalculation).toHaveBeenCalledTimes(1);

      // Rerender with same dependencies
      rerender({ deps: [1, 2] });
      expect(expensiveCalculation).toHaveBeenCalledTimes(1); // Should not recalculate

      // Rerender with different dependencies
      rerender({ deps: [1, 3] });
      expect(expensiveCalculation).toHaveBeenCalledTimes(2); // Should recalculate
    });

    it('updates when dependencies change', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useMemoizedValue(() => `result-${value}`, [value]),
        { initialProps: { value: 1 } }
      );

      expect(result.current).toBe('result-1');

      rerender({ value: 2 });
      expect(result.current).toBe('result-2');
    });
  });

  describe('useStableCallback', () => {
    it('returns a stable callback reference', () => {
      const mockCallback = jest.fn();
      const { result, rerender } = renderHook(() => useStableCallback(mockCallback));

      const firstCallback = result.current;

      rerender();
      const secondCallback = result.current;

      expect(firstCallback).toBe(secondCallback);
    });

    it('calls the original function when invoked', () => {
      const mockCallback = jest.fn();
      const { result } = renderHook(() => useStableCallback(mockCallback));

      act(() => {
        result.current('test arg');
      });

      expect(mockCallback).toHaveBeenCalledWith('test arg');
    });

    it('maintains function context', () => {
      const mockCallback = jest.fn();
      const { result } = renderHook(() => useStableCallback(mockCallback));

      act(() => {
        result.current.call(null, 'test');
      });

      expect(mockCallback).toHaveBeenCalledWith('test');
    });
  });
});
