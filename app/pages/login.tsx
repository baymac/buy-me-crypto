import { ClientSafeProvider, getSession, providers } from 'next-auth/client';
import React from 'react';
import UserLogin from '../components/UserLogin/UserLogin';

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/home' },
    };
  }

  return {
    props: {
      providers: await providers(),
      // csrfToken: await csrfToken(context), //Only for Email
    },
  };
}

export default function Login({
  providers,
}: {
  providers: Record<string, ClientSafeProvider>;
}) {
  return <UserLogin providers={providers} />;
}
