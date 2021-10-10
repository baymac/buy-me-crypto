import cn from 'classnames';
import { useSession } from 'next-auth/client';
import React from 'react';
import AlertBanner from '../components/AlertBanner/AlertBanner';
import PieLoading from '../components/PieLoading/PieLoading';
import Sidebar from '../components/Sidebar/Sidebar';
import useFinishSignupRedirect from '../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/app.module.css';
import rootStyles from '../styles/root.module.css';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [_, loading] = useSession();
  useSessionRedirect('/', true);

  const [userMetaData] = useFinishSignupRedirect();

  if (loading || !userMetaData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading />
      </div>
    );
  }

  return (
    <HomeLayout>
      <Head>
        <title>Home | Buy Me Crypto</title>
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
            <div className={styles.wrapper__container}>
              {!userMetaData.profileCompleted && (
                <AlertBanner>
                  {userMetaData.userLevel === 2 ? (
                    <>
                      We need some info for your creator's page. Please complete
                      your profile&nbsp;
                      <Link href="/settings">here</Link>.
                    </>
                  ) : (
                    <>
                      Please complete your profile&nbsp;
                      <Link href="/settings">here</Link>.
                    </>
                  )}
                </AlertBanner>
              )}
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
