import cn from 'classnames';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import PieLoading from '../components/PieLoading/PieLoading';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/app.module.css';
import rootStyles from '../styles/root.module.css';
import Sidebar from '../components/Sidebar/Sidebar';
import DashboardForms from '../components/DashboardForms/DashboardForms';
import useSessionRedirect from '../hooks/useSessionRedirect';

export default function Home() {
  const [session, loading] = useSession();
  useSessionRedirect('/', true);

  if (loading || !session) {
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
              <DashboardForms />
            </div>
          </div>
        </section>
      </HomeLayout>
    );
  }
}
