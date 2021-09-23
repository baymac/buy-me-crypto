import cn from 'classnames';
import React, { useEffect } from 'react';
import rootStyles from '../styles/root.module.css';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/home.module.css';
import { useRouter } from 'next/router'
import { useSession, getSession, providers, csrfToken } from 'next-auth/client'
import Loading from '../components/Loading/Loading'


export default function Home() {
  const [session, loading] = useSession()
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/')
    }
  })

  if (loading || !session) {
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
            <div>home</div>
            {session && <div>{`${session.user.name}`}</div>}
            {session && <div>{`${session.user.email}`}</div>}
          </div>
        </section>
      </HomeLayout>
    );
  }
}
