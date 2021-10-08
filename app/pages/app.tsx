import cn from 'classnames';
import { useSession } from 'next-auth/client';
import React,{useEffect ,useState} from 'react';
import AlertBanner from '../components/AlertBanner/AlertBanner';
import PieLoading from '../components/PieLoading/PieLoading';
import Sidebar from '../components/Sidebar/Sidebar';
import useFinishSignupRedirect from '../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/app.module.css';
import rootStyles from '../styles/root.module.css';
import Link from 'next/link';
import Head from 'next/head';
import ActiveSubscriptionsTable from '../components/ActiveSubscriptionsTable/ActiveSubscriptionsTable'
import PastTransactionsTable from '../components/PastTransactionsTable/PastTransactionsTable'
import fetchJson from '../lib/fetchJson';
export default function Home() {
  const [session , loading] = useSession();
  useSessionRedirect('/', true);

  const [userMetaData] = useFinishSignupRedirect();
  const [ activeSubscriptions,setActiveSubscriptions ] = useState(null)
  const [ pastTransactions, setPastTransactions ] = useState(null)
  useEffect(()=>{

    if(userMetaData && session){
      if(userMetaData.userLevel === 1){
        const body = {
          userId : session.userId
        }

        //request for active Subscriptions
        fetchJson('/api/getActiveSubscriptionsTo',{
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((data)=>{
          setActiveSubscriptions(data)
        })
        .catch((error)=>{
          console.log('error ' + error.message)
        })


        //request for past transactions oneTime
        fetchJson('/api/getOneTimeTransactionsTo',{
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((data)=>{
          console.log('past Transactions')
          console.log(data)
          setPastTransactions(data)
        })
        .catch((error)=>{
          console.log('error ' + error.message)
        })
      }
      else{
        const body = {
          userId : session.userId
        }
        fetchJson('/api/getActiveSubscriptionsFrom',{
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((data)=>{
          setActiveSubscriptions(data)
        })
        .catch((error)=>{
          console.log('error ' + error.message)
        })
        //request for past transactions oneTime
        fetchJson('/api/getOneTimeTransactionsFrom',{
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((data)=>{
          setPastTransactions(data)
        })
        .catch((error)=>{
          console.log('error ' + error.message)
        })
      }
    }

  },[userMetaData,session])
  

  console.log(activeSubscriptions)

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
          <div className={styles.wrapper}>
            <Sidebar />
            <div className={styles.wrapper__container}>
              {!userMetaData.profileCompleted && (
                <AlertBanner>
                  {userMetaData.userLevel === 2 ? (
                    <>
                      We need some info for your creator's page. Please complete
                      your profile&nbsp;
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
              <ActiveSubscriptionsTable activeSubscriptions={activeSubscriptions.data} userLevel={userMetaData.userLevel}/>
              <PastTransactionsTable activeSubscriptions={activeSubscriptions.data} oneTimeTransactions={pastTransactions.data} userLevel={userMetaData.userLevel}/>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
