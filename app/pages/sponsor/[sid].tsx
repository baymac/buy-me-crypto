import { getSession } from 'next-auth/client';
import React from 'react';
import HomeLayout from '../../layouts/HomeLayout';
import rootStyles from '../../styles/root.module.css';
import cn from 'classnames';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import styles from '../../styles/pageStyles/app.module.css';

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
