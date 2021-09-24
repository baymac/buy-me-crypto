import { ClientSafeProvider, providers, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Loading from '../components/Loading/Loading';
import UserLogin from '../components/UserLogin/UserLogin';

export async function getStaticProps(context) {
  return {
    props: {
      providers: await providers(),
      // Only for Email
      // csrfToken: await csrfToken(context),
    },
  };
}

export default function Login({
  providers,
}: {
  providers: Record<string, ClientSafeProvider>;
}) {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  }, [session]);

  if (loading || session) {
    return <Loading></Loading>;
  } else {
    return <UserLogin providers={providers} />;
  }
}
