import cn from 'classnames';
import React from 'react';
import rootStyles from '../styles/root.module.css';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/home.module.css';
import {useSession}  from 'next-auth/client'
export default function Home() {

  const [session,loading] = useSession();

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
          <>home</>
          {loading && <div>Loading...</div>}
          {session && <div>{session.user.email}</div>}
        </div>
      </section>
    </HomeLayout>
  );
}
