import cn from 'classnames';
import { getSession, useSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import PieLoading from '../../components/PieLoading/PieLoading';
import SponsorForm from '../../components/SponsorForm/SponsorForm';
import useFinishSignupRedirect from '../../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../../hooks/useSessionRedirect';
import HomeLayout from '../../layouts/HomeLayout';
import {
  IGetActiveSubscriptionRequest,
  IGetActiveSubscriptionResponse,
} from '../../lib/creatorPage/getActiveSubscription';
import fetcher from '../../lib/fetcher';
import { IGetPageInfoResponse } from '../../lib/home/getPageInfo';
import {
  IGetUserRequest,
  IGetUserResponse,
} from '../../lib/userSettings/getUser';
import { IGetUserMetaDataResponse } from '../../lib/userSettings/getUserMetadata';
import { getHostUrl, IGenericAPIRequest } from '../../lib/utils';
import styles from '../../styles/pageStyles/creator.module.css';
import rootStyles from '../../styles/root.module.css';
import Image from 'next/image';

export async function getServerSideProps(context) {
  const { params, req } = context;

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
  const creator = await fetcher<IGetUserRequest, IGetUserResponse>(
    `${getHostUrl}/api/user/get`,
    body
  );
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
        destination: '/pagePreview',
      },
    };
  }

  const pageInfoBody: IGenericAPIRequest = {
    userId: creator.data.id,
  };

  const creatorMetaData = await fetcher<
    IGenericAPIRequest,
    IGetUserMetaDataResponse
  >(`${getHostUrl}/api/userMetaData/get`, pageInfoBody);

  if (!creatorMetaData.data.profileCompleted) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }

  const creatorPageInfo = await fetcher<
    IGenericAPIRequest,
    IGetPageInfoResponse
  >(`${getHostUrl}/api/pageInfo/get`, pageInfoBody);

  if (!creatorPageInfo.data) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }

  const activeSubscriptionBody = {
    fan: session.userId,
    creator: creator.data.id,
  } as IGetActiveSubscriptionRequest;

  const activeSubscriptions = await fetcher<
    IGetActiveSubscriptionRequest,
    IGetActiveSubscriptionResponse
  >(`${getHostUrl}/api/getActiveSubscriptions`, activeSubscriptionBody);

  return {
    props: {
      creator: creator.data,
      creatorPageInfo: creatorPageInfo.data,
      activeSubscription: activeSubscriptions.data,
    },
  };
}

export default function CreatorPage({
  creator,
  creatorPageInfo,
  activeSubscription,
}) {
  const [session, loading] = useSession();
  useSessionRedirect('/', true);
  const [userMetaData] = useFinishSignupRedirect();

  if (loading || !userMetaData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading />
      </div>
    );
  }
  return (
    <HomeLayout hideMenu>
      <Head>
        <title>Sponsor | Buy Me Crypto</title>
      </Head>
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
              <Image
                priority
                src={creator.image}
                height={80}
                width={80}
                alt={'creator avatar'}
                layout="fixed"
                className={styles.userInfo__img}
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
                isDisabled={false}
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
