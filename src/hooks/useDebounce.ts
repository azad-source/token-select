import { useState, useEffect, useRef, useCallback } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useDebouncedCallback = <T>(callback: (param: T) => void, delay: number) => {
  const timeout = useRef<ReturnType<typeof setInterval> | null>(null);

  return useCallback(
    (param: T) => {
      const later = () => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        callback(param);
      };

      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(later, delay);
    },
    [callback, delay],
  );
};
