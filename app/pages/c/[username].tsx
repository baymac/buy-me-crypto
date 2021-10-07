import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import useFinishSignupRedirect from '../../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../../hooks/useSessionRedirect';
import styles from '../../styles/pageStyles/creator.module.css';
import rootStyles from '../../styles/root.module.css';
import PieLoading from '../../components/PieLoading/PieLoading';
import HomeLayout from '../../layouts/HomeLayout';
import cn from 'classnames';
import fetchJson from '../../lib/fetchJson';
import { IGetUserRequest } from '../../lib/getUser';
import { IGetPageInfoRequest } from '../../lib/getPageInfo';
import SponsorForm from '../../components/SponsorForm/SponsorForm';
import { getSession } from 'next-auth/client';

export async function getServerSideProps(context) {
  const { params, req, res } = context;

  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  const { username } = params;
  const body: IGetUserRequest = {
    username,
  };
  const creator = await fetchJson('http://localhost:3000/api/getUser', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!creator.data) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }

  if (session.userId === creator.data.id) {
    return {
      redirect: {
        destination: '/app',
      },
    };
  }

  const pageInfoBody: IGetPageInfoRequest = {
    userId: creator.data.id,
  };

  const creatorPageInfo = await fetchJson(
    'http://localhost:3000/api/getPageInfo',
    {
      method: 'POST',
      body: JSON.stringify(pageInfoBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const activeSubscriptionBody = {
    fan: session.userId,
    creator: creator.data.id,
  };

  const activeSubscriptions = await fetchJson(
    'http://localhost:3000/api/getActiveSubscriptions',
    {
      method: 'POST',
      body: JSON.stringify(activeSubscriptionBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!creatorPageInfo.data) {
    console.log('creatorPageinfo missgin');
    return {
      redirect: {
        destination: '/404',
      },
    };
  }

  return {
    props: {
      creator: creator.data,
      creatorPageInfo: creatorPageInfo.data,
      activeSubscription: activeSubscriptions.data,
    },
  };
}

const creatorPage = ({ creator, creatorPageInfo, activeSubscription }) => {
  const [session, loading] = useSession();
  useSessionRedirect('/', true);
  let [hasMetaData, isProfileCompleted] = useFinishSignupRedirect();

  if (loading || !hasMetaData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading />
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
              <div className={styles.wrapper__pageInfo}>
                <img
                  className={styles.wrapper__pageInfo__avatar}
                  src={creator.image}
                  alt="creator avatar"
                />
                <h2 className={styles.wrapper__pageInfo__pageName}>
                  {creator.username}
                </h2>
                <h4 className={styles.wrapper__pageInfo__pageHeadline}>
                  {creatorPageInfo.pageHeadline}
                </h4>
                <p className={styles.wrapper__pageInfo__aboutPage}>
                  {creatorPageInfo.aboutPage}
                </p>
              </div>
              {!activeSubscription && (
                <SponsorForm
                  creatorName={'Creator'}
                  creatorId={creator.id}
                  fanId={session.userId}
                />
              )}
              {activeSubscription && (
                <div className={styles.wrapper__sponsor}>
                  <h2
                    className={styles.wrapper__sponsor__heading}
                  >{`Sponsor Creator`}</h2>
                  <h3>Active Subscriptions</h3>
                </div>
              )}
            </div>
          </div>
        </section>
      </HomeLayout>
    );
  }
};

export default creatorPage;
