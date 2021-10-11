import cn from 'classnames';
import { useSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import PieLoading from '../components/PieLoading/PieLoading';
import SponsorForm from '../components/SponsorForm/SponsorForm';
import useFinishSignupRedirect from '../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import fetchJson from '../lib/fetchJson';
import { IPageInfo } from '../lib/userSettings/addPageInfo';
import styles from '../styles/pageStyles/creator.module.css';
import rootStyles from '../styles/root.module.css';

const pagePreview = () => {
  const [session, loading] = useSession();
  useSessionRedirect('/', true);
  const [userMetaData] = useFinishSignupRedirect();
  const [creatorPageInfo, setCreatorPageInfo] = useState<IPageInfo | null>(
    null
  );
  const router = useRouter();
  useEffect(() => {
    if (session && userMetaData) {
      if (!userMetaData.profileCompleted) {
        router.push('/settings');
      }

      if (userMetaData.userLevel === 1) {
        router.push('/404');
      } else {
        const pageInfoBody = {
          userId: session.userId,
        };

        fetchJson(`/api/getPageInfo`, {
          method: 'POST',
          body: JSON.stringify(pageInfoBody),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((data) => {
            setCreatorPageInfo(data.data);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    }
  }, [session, userMetaData]);

  if (loading || !userMetaData || !creatorPageInfo) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading />
      </div>
    );
  } else {
    return (
      <HomeLayout>
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
                <img
                  className={styles.wrapper__pageInfo__avatar}
                  src={session.user.image}
                  alt="creator avatar"
                />
                <h2 className={styles.wrapper__pageInfo__pageName}>
                  {creatorPageInfo.pageName}
                </h2>
                <h4 className={styles.wrapper__pageInfo__pageHeadline}>
                  {creatorPageInfo.pageHeadline}
                </h4>
                <p className={styles.wrapper__pageInfo__aboutPage}>
                  {creatorPageInfo.aboutPage}
                </p>
              </div>
              <SponsorForm
                creatorName={'Creator'}
                creatorId={session.userId}
                fanId={session.userId}
                isDisabled={true}
              />
            </div>
          </div>
        </section>
      </HomeLayout>
    );
  }
};

export default pagePreview;
