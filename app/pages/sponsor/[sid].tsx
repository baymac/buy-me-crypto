import { getSession } from 'next-auth/client';
import React from 'react';
import HomeLayout from '../../layouts/HomeLayout';

export async function getServerSideProps(context) {
  const { params, req } = context;
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }
  const { sid: sessionId } = params;
  return {
    props: {
      sessionId,
    },
  };
}

export default function Checkout({ sessionId }: { sessionId: string }) {
  return (
    <HomeLayout hideMenu={true}>
      <h1 style={{ marginTop: '8rem' }}>{sessionId}</h1>
    </HomeLayout>
  );
}
