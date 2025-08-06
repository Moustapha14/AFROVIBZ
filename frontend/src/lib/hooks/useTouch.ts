import { useState, useCallback, useRef, useEffect } from 'react';

interface TouchState {
  isTouching: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
}

interface UseTouchOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefault?: boolean;
}

export function useTouch(options: UseTouchOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefault = true,
  } = options;

  const [touchState, setTouchState] = useState<TouchState>({
    isTouching: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
  });

  const elementRef = useRef<HTMLElement>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      setTouchState(prev => ({
        ...prev,
        isTouching: true,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
      }));
    },
    [preventDefault]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      setTouchState(prev => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: touch.clientX - prev.startX,
        deltaY: touch.clientY - prev.startY,
      }));
    },
    [preventDefault]
  );

  const handleTouchEnd = useCallback(() => {
    const { deltaX, deltaY } = touchState;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    setTouchState(prev => ({
      ...prev,
      isTouching: false,
      deltaX: 0,
      deltaY: 0,
    }));
  }, [touchState, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault]);

  return {
    touchState,
    elementRef,
  };
}

// Hook pour détecter si l'appareil supporte le tactile
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);

    return () => {
      window.removeEventListener('resize', checkTouchDevice);
    };
  }, []);

  return isTouchDevice;
}

// Hook pour gérer le double tap
export function useDoubleTap(callback: () => void, delay: number = 300) {
  const [lastTap, setLastTap] = useState(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastTap;

    if (timeDiff < delay && timeDiff > 0) {
      callback();
    }

    setLastTap(now);
  }, [callback, delay, lastTap]);

  return handleTap;
}
