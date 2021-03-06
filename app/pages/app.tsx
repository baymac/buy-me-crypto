import cn from 'classnames';
import { useSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AlertBanner from '../components/AlertBanner/AlertBanner';
import PastTransactionsTable from '../components/PastTransactionsTable/PastTransactionsTable';
import PieLoading from '../components/PieLoading/PieLoading';
import Sidebar from '../components/Sidebar/Sidebar';
import useFinishSignupRedirect from '../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import fetcher from '../lib/fetcher';
import fetchJson from '../lib/fetchJson';
import styles from '../styles/pageStyles/app.module.css';
import rootStyles from '../styles/root.module.css';
import { useSnackbar } from '../context/SnackbarContextProvider';
import { IGenericAPIRequest } from '../lib/utils';
import { IGetActiveSubscriptionsToResponse } from '../lib/getActiveSubscriptionsTo';
import { IGetAcitveSubscriptionsFromResponse } from '../lib/getActiveSubscriptionsFrom';

export default function Home() {
  const [session, loading] = useSession();
  useSessionRedirect('/', true);
  const { enqueueSnackbar } = useSnackbar();
  const [userMetaData] = useFinishSignupRedirect();
  const [activeSubscriptions, setActiveSubscriptions] = useState(null);
  const [pastTransactions, setPastTransactions] = useState(null);

  useEffect(() => {
    if (userMetaData && session) {
      const body = {
        userId: session.userId,
      } as IGenericAPIRequest;
      //request for active Subscriptions
      if (userMetaData.userLevel === 1) {
        fetcher<IGenericAPIRequest, IGetActiveSubscriptionsToResponse>(
          '/api/getActiveSubscriptionsTo',
          body
        )
          .then((data) => {
            if (data.error) {
              throw new Error(data.message);
            }
            setActiveSubscriptions(data);
          })
          .catch((error) => {
            enqueueSnackbar({
              message: error.message,
            });
          });
      } else {
        fetcher<IGenericAPIRequest, IGetAcitveSubscriptionsFromResponse>(
          '/api/getActiveSubscriptionsFrom',
          body
        )
          .then((data) => {
            if (data.error) {
              throw new Error(data.message);
            }
            setActiveSubscriptions(data);
          })
          .catch((error) => {
            enqueueSnackbar({
              message: error.message,
            });
          });
      }

      //fetching one Time Transactions for creator or fan
      fetchJson(
        `/api/getOneTimeTransactions${
          userMetaData.userLevel === 1 ? 'To' : 'From'
        }`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((data) => {
          if (data.error) {
            throw Error(data.message);
          }
          setPastTransactions(data);
        })
        .catch((error) => {
          enqueueSnackbar({
            message: error.message,
          });
        });
    }
  }, [userMetaData, session, enqueueSnackbar]);

  if (loading || !userMetaData || !activeSubscriptions || !pastTransactions) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading />
      </div>
    );
  }

  return (
    <HomeLayout>
      <Head>
        <title>Home | Buy Me Crypto</title>
      </Head>
      <section className={cn(rootStyles.section)} id="about">
        <div
          className={cn(
            rootStyles.container,
            rootStyles.grid,
            styles.about__container
          )}
        >
          <Sidebar userLevel={userMetaData.userLevel} />
          <div className={styles.wrapper__content}>
            {!userMetaData.profileCompleted && (
              <AlertBanner>
                {userMetaData.userLevel === 2 ? (
                  <>
                    We need some info for your creator&apos;s page. Please
                    complete your profile&nbsp;
                    <Link href="/settings">here</Link>.
                  </>
                ) : (
                  <>
                    Please complete your profile&nbsp;
                    <Link href="/settings">here</Link>.
                  </>
                )}
              </AlertBanner>
            )}
            <PastTransactionsTable
              activeSubscriptions={activeSubscriptions.data}
              oneTimeTransactions={pastTransactions.data}
              userLevel={userMetaData.userLevel}
            />
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
