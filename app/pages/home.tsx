import cn from 'classnames';
import React from 'react';
import rootStyles from '../styles/root.module.css';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/home.module.css';
import {useRouter} from 'next/router'


import {useSession,getSession,providers,csrfToken} from 'next-auth/client'
export default function Home() {
  const [session,loading] = useSession()
  const router = useRouter();

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
          {session && <div>{`${session.user.name}`}</div> }
          {session && <div>{`${session.user.email}`}</div> }
        </div>
      </section>
    </HomeLayout>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  console.log(session)
  if (!session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      
    },
  };
}
