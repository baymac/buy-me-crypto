import cn from 'classnames';
import { useSession } from 'next-auth/client';
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
  const [session, loading] = useSession();

  const [hasMetaData] = useFinishSignupRedirect();
  useSessionRedirect('/', true);

  if (loading || !hasMetaData) {
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
