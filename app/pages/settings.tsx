import cn from 'classnames';
import { useSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import DashboardForms from '../components/DashboardForms/DashboardForms';
import PieLoading from '../components/PieLoading/PieLoading';
import Sidebar from '../components/Sidebar/Sidebar';
import useFinishSignupRedirect from '../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/app.module.css';
import rootStyles from '../styles/root.module.css';

export default function Home() {
  const [_, loading] = useSession();

  const [userMetaData] = useFinishSignupRedirect();

  useSessionRedirect('/', true);

  if (loading || !userMetaData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading></PieLoading>
      </div>
    );
  } else {
    return (
      <HomeLayout>
        <Head>
          <title>Settings | Buy Me Crypto</title>
        </Head>
        <section className={cn(rootStyles.section)} id="about">
          <div
            className={cn(
              rootStyles.container,
              rootStyles.grid,
              styles.about__container
            )}
          >
            <div className={styles.wrapper}>
              <Sidebar userLevel={userMetaData.userLevel} />
              <DashboardForms />
            </div>
          </div>
        </section>
      </HomeLayout>
    );
  }
}
