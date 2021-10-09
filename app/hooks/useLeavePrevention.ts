import { useRouter } from 'next/router';
import { useEffect } from 'react';

const handleWindowClose = (e) => {
  e.preventDefault();
  return (e.returnValue = 'Are you sure you want to leave?');
};

let leaveConfirmed = false;

export const useLeavePrevention = () => {
  const router = useRouter();

  // Use beforeunload to prevent closing the tab, refreshing the page or moving outside the Next app
  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, []);

  // Use routeChangeStart to prevent navigation inside of the Next app
  // Uses a module variable to bypass the confirm, otherwise we would be in a loop
  router.events?.on('routeChangeStart', () => {
    if (leaveConfirmed) return;

    if (window.confirm('Are you sure you want to leave?'))
      leaveConfirmed = true;
    else {
      router.events.emit('routeChangeError');
      throw 'routeChange aborted.';
    }
  });

  // Set the module variable to false on component mount
  useEffect(() => {
    leaveConfirmed = false;
  }, []);
};
