import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import useFinishSignupRedirect from '../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../hooks/useSessionRedirect';
import styles from '../styles/pageStyles/creator.module.css';
import rootStyles from '../styles/root.module.css';
import PieLoading from '../components/PieLoading/PieLoading';
import HomeLayout from '../layouts/HomeLayout';
import cn from 'classnames';
import fetchJson from '../lib/fetchJson';
import { IGetUserRequest } from '../lib/getUser';
import { IGetPageInfoRequest } from '../lib/getPageInfo';
import SponsorForm from '../components/SponsorForm/SponsorForm';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { getHostUrl } from '../lib/utils';
import { IPageInfo } from '../lib/addPageInfo';

const pagePreview = () => {
    const [session, loading] = useSession();
    useSessionRedirect('/', true);
    const [userMetaData] = useFinishSignupRedirect();
    const [creatorPageInfo,setCreatorPageInfo] = useState<IPageInfo | null>(null)

    useEffect(()=>{
        if(session){
            
            const pageInfoBody = {
                userId : session.userId,
            };            
            
            fetchJson(`/api/getPageInfo`, {
                method: 'POST',
                body: JSON.stringify(pageInfoBody),
                headers: {
                  'Content-Type': 'application/json',
                },
            })
            .then((data)=>{
                setCreatorPageInfo(data.data)
            })
            .catch((error)=>{
                console.log(error.message)
            });
        }
    },[session])

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
  
export default pagePreview