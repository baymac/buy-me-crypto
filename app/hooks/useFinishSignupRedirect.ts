import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import fetchJson from '../lib/fetchJson';

export default function useFinishSignupRedirect() {
  const [hasMetaData, setHasMetaData] = useState<boolean>(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false);
  const router = useRouter();

  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && session) {
      const body = {
        userId: session.userId,
      };
      fetchJson('/api/getUserMetaData', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((metaData) => {
          if (!metaData.data) {
            router.push('/finishSignup');
          } else {
            setHasMetaData(true);
            if (metaData.data.profileCompleted) {
              setIsProfileCompleted(true);
            }
          }
        })
        .catch((err) => {
          console.log('Some error has been occured ' + err.message);
        });
    }
  }, [session, loading]);

  return [hasMetaData, isProfileCompleted];
}
