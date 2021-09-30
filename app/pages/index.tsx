import cn from 'classnames';
import { useSession } from 'next-auth/client';
import React from 'react';
import GettingStarted from '../components/GettingStarted/GettingStarted';
import Headline from '../components/Headline/Headline';
import PieLoading from '../components/PieLoading/PieLoading';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/index.module.css';
import rootStyles from '../styles/root.module.css';

export default function Index() {
  const [session, loading] = useSession();
  useSessionRedirect('/app', false);

  if (loading || session) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading />
      </div>
    );
  }

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
          <div className={styles.landingContainer}>
            <Headline />
            <GettingStarted />
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
