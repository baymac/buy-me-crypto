import cn from 'classnames';
import { getSession } from 'next-auth/client';
import React, { useEffect } from 'react';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import HomeLayout from '../../layouts/HomeLayout';
import {
  IGetCheckoutRequest,
  IGetCheckoutResponse,
} from '../../lib/checkout/getCheckoutSession';
import fetcher from '../../lib/fetcher';
import styles from '../../styles/pageStyles/app.module.css';
import rootStyles from '../../styles/root.module.css';

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
  useEffect(() => {
    const res = fetcher<IGetCheckoutRequest, IGetCheckoutResponse>(
      '/api/checkout/getSession',
      { sessionId }
    ).then((res) => console.log(res));
  }, []);

  return (
    <HomeLayout hideMenu={true}>
      <section className={cn(rootStyles.section)} id="about">
        <div
          className={cn(
            rootStyles.container,
            rootStyles.grid,
            styles.about__container
          )}
        >
          <ConnectWallet />
        </div>
      </section>
    </HomeLayout>
  );
}
