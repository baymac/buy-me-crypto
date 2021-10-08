import { useEffect, useRef } from 'react';

/* Orginally written in https://github.com/wsmd/use-clipboard-copy/blob/master/src/useTimedToggle.ts */

export function useReset(show: boolean, reset: any, duration: number) {
  const timeoutRef = useRef<number>();
  const initialValueRef = useRef(false);

  useEffect(() => {
    if (show) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(
        () => reset(initialValueRef.current),
        duration
      );
    }
  }, [duration, reset, show]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);
}
