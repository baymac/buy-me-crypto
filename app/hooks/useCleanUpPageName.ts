import { useEffect } from 'react';

export default function useCleanUpPageName() {
  useEffect(() => {
    return () => {
      localStorage.removeItem('pageName');
    };
  }, []);
}
