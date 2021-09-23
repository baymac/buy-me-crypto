import cn from 'classnames';
import React, { useEffect } from 'react';
import rootStyles from '../styles/root.module.css';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/index.module.css';
import { getSession, useSession } from 'next-auth/client'
import Loading from '../components/Loading/Loading'
import { useRouter } from 'next/router'
export default function Index() {

  const [session, loading] = useSession();
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/home')
    }
  })

  if (loading || session) {
    return (
      <Loading></Loading>
    )
  }
  else {
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

