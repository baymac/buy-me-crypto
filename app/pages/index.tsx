import cn from 'classnames';
import React from 'react';
import rootStyles from '../styles/root.module.css';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/index.module.css';
import { getSession } from 'next-auth/client'

export default function Index() {
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


export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: { destination: "/home" },
    };
  }

  return {
    props: {

    },
  };
}
