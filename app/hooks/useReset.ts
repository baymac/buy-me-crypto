import { useEffect, useRef } from 'react';

export function useReset(
  dequeueSnackbar: (id: string) => void,
  id: string,
  duration: number
) {
  const timeoutRef = useRef<number>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => dequeueSnackbar(id), duration);
  }, [duration, id, dequeueSnackbar]);
}
