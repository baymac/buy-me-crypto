import cn from 'classnames';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import PieLoading from '../components/PieLoading/PieLoading';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/home.module.css';
import rootStyles from '../styles/root.module.css';

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session]);

  if (loading || !session) {
    return (
      <div className={rootStyles.center}>
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
            <div>home</div>
            {session && <div>{`${session.user.name}`}</div>}
            {session && <div>{`${session.user.email}`}</div>}
          </div>
        </section>
      </HomeLayout>
    );
  }
}
