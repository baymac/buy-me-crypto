import cn from 'classnames';
import { useSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import PieLoading from '../components/PieLoading/PieLoading';
import Sidebar from '../components/Sidebar/Sidebar';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import fetchJson from '../lib/fetchJson';
import styles from '../styles/pageStyles/app.module.css';
import rootStyles from '../styles/root.module.css';
import { useRouter } from 'next/router';
import AlertBanner from '../components/AlertBanner/AlertBanner';
import useFinishSingupRedirect from '../hooks/useFinishSingupRedirect';

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  let [gotMetaData, isProfileCompleted] = useFinishSingupRedirect();
  useSessionRedirect('/', true);

  if (loading || !session || !gotMetaData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading></PieLoading>
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
              <div className={styles.wrapper__contianer}>
                {!isProfileCompleted ? (
                  <AlertBanner> Your profile is not completed </AlertBanner>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </HomeLayout>
    );
  }
}
