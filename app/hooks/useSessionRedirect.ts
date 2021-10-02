import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import fetchJson from '../lib/fetchJson'

export default function useSessionRedirect(
  path: string,
  redirectUnauthenticated: boolean
) {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (
        (redirectUnauthenticated && !session) ||
        (!redirectUnauthenticated && session)
      ) {
        router.push(path);
      }
    }
  }, [session, loading]);
}
