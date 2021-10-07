import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useNavSelection() {
  const [selectedMenu, setSelectedMenu] = useState('home');
  const router = useRouter();

  const [session, loading] = useSession();

  useEffect(() => {
    if (session) {
      if (router.asPath === '/app') {
        setSelectedMenu('home');
      } else if (router.asPath === '/preview') {
        setSelectedMenu('preview');
      } else if (router.asPath === '/settings') {
        setSelectedMenu('settings');
      }
    }
  }, [router, session]);

  useEffect(() => {
    if (!session && !loading) {
      if (router.asPath === '/') {
        setSelectedMenu('home');
      } else {
        setSelectedMenu('login');
      }
    }
  }, [router, session, loading]);

  return [selectedMenu];
}
