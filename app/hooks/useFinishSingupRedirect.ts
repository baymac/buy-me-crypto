import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import fetchJson from '../lib/fetchJson';

export default function useNavSelection() {
  const [gotMetaData, setGotMetaData] = useState<boolean>(false);
  const [isProfileCompleted, setProfileCompleted] = useState<boolean>(false);
  const router = useRouter();

  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading) {
      if (session) {
        console.log(session);
        const body = {
          userId: session.user.id,
        };
        fetchJson('/api/getUserMetaData', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((data) => {
            if (!data.hasOwnProperty('metaData')) {
              router.push('/finishSignup');
            }
            return data;
          })
          .then((data) => {
            setGotMetaData(true);
            if (data.metaData.profileCompleted) {
              setProfileCompleted(true);
            }
          })
          .catch((err) => {
            console.log('Some error has been occured ' + err.message);
          });
      }
    }
  }, [session, loading]);

  return [gotMetaData, isProfileCompleted];
}
