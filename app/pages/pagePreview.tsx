import cn from 'classnames';
import { useSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PieLoading from '../components/PieLoading/PieLoading';
import SponsorForm from '../components/SponsorForm/SponsorForm';
import useFinishSignupRedirect from '../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import fetcher from '../lib/fetcher';
import { IPageInfo } from '../lib/userSettings/addPageInfo';
import styles from '../styles/pageStyles/creator.module.css';
import rootStyles from '../styles/root.module.css';
import { useSnackbar } from '../context/SnackbarContextProvider';
import { IGenericAPIRequest } from '../lib/utils';
import { IGetPageInfoResponse } from '../lib/home/getPageInfo';

export default function PagePreview() {
  const [session, loading] = useSession();
  useSessionRedirect('/', true);
  const [userMetaData] = useFinishSignupRedirect();
  const [creatorPageInfo, setCreatorPageInfo] = useState<IPageInfo | null>(
    null
  );
  const { enqueueSnackbar } = useSnackbar();
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
        } as IGenericAPIRequest;

        fetcher<IGenericAPIRequest, IGetPageInfoResponse>(
          '/api/pageInfo/get',
          pageInfoBody
        )
          .then((data) => {
            if (data.error) {
              throw new Error(data.message);
            }
            setCreatorPageInfo(data.data);
          })
          .catch((error) => {
            enqueueSnackbar({
              message: error.message,
            });
          });
      }
    }
  }, [session, userMetaData, enqueueSnackbar, router]);

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
                <Image
                  priority
                  src={session.user.image}
                  height={80}
                  width={80}
                  alt={'creator avatar'}
                  layout="fixed"
                  className={styles.wrapper__pageInfo__avatar}
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
}
