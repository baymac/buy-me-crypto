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

export default function Home() {
  const [session, loading] = useSession();
  useSessionRedirect('/', true);

  let [hasMetaData, isProfileCompleted] = useFinishSignupRedirect();

  if (loading || !hasMetaData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading />
      </div>
    );
  } else {
    return (
      <HomeLayout>
        <section className={cn(rootStyles.section)} id="about">
          <div
            className={cn(
              rootStyles.container,
              rootStyles.grid,
              styles.about__container
            )}
          >
            <div className={styles.wrapper}>
              <Sidebar />
              <div className={styles.wrapper__container}>
                {!isProfileCompleted ? (
                  <AlertBanner>
                    {' '}
                    Your page is currently incomplete.{' '}
                    <Link href="/settings">Click here</Link> to complete profile
                    and start attracting fans{' '}
                  </AlertBanner>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </HomeLayout>
    );
  }
}
