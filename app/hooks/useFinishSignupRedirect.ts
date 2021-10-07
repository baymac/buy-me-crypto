import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IUserMetaData } from '../lib/addUserMetaData';
import fetchJson from '../lib/fetchJson';

export default function useFinishSignupRedirect() {
  const [userMetaData, setUserMetaData] = useState<IUserMetaData | null>(null);
  const router = useRouter();

  const [session, loading] = useSession();

  useEffect(() => {
    if (session) {
      console.log(session);
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
            setUserMetaData(metaData.data);
          }
        })
        .catch((err) => {
          console.log('Some error has been occured ' + err.message);
        });
    }
  }, [session]);

  return [userMetaData];
}
