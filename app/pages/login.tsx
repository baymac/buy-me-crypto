
import {
  ClientSafeProvider,
  csrfToken,
  useSession,
  providers,
} from 'next-auth/client';

import React, { useEffect } from 'react';
import UserLogin from '../components/UserLogin/UserLogin';
import cn from 'classnames';
import styles from '../styles/pageStyles/login.module.css'
import { useRouter } from 'next/router'
import Loading from '../components/Loading/Loading'

export async function getStaticProps(context) {
  return {
    props: {
      providers: await providers(),
      //Only for Email
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
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/home')
    }
  })

  if (loading || session) {
    return (
      <Loading></Loading>
    )
  }
  else {
    return <UserLogin providers={providers} />;
  }
}
