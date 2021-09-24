import cn from 'classnames';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import PieLoading from '../components/PieLoading/PieLoading';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/index.module.css';
import rootStyles from '../styles/root.module.css';

export default function Index() {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  }, [session]);

  if (loading || session) {
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
            <>Index</>
          </div>
        </section>
      </HomeLayout>
    );
  }
}
