import cn from 'classnames';
import { useSession } from 'next-auth/client';
import React,{useEffect,useState} from 'react';
import PieLoading from '../components/PieLoading/PieLoading';
import Sidebar from '../components/Sidebar/Sidebar';
import useSessionRedirect from '../hooks/useSessionRedirect';
import HomeLayout from '../layouts/HomeLayout';
import fetchJson from '../lib/fetchJson';
import styles from '../styles/pageStyles/app.module.css';
import rootStyles from '../styles/root.module.css';
import { useRouter } from 'next/router';


export default function Home() {
  const [session, loading] = useSession();
  const [gotMetaData, setGotMetaData] = useState<boolean>(false);
  const router = useRouter();

  useEffect(()=>{
    if(!loading)
    {
      if(session){

        console.log(session)
        const body = {
          userId : session.user.id
        }
        fetchJson('/api/getUserMetaData',{
          method : "POST",
          body :   JSON.stringify(body),
          headers : {
            'Content-Type': 'application/json'
          }
        })
        .then((data)=>{
          if(!data.hasOwnProperty('metaData')){
            router.push('/finishSignup')
          }
        })
        .then(()=>{
          setGotMetaData(true)
        })
        .catch((err)=>{
          console.log("Some error has been occured " + err.message)
        })
      }
    }
  },[session,loading])

  useSessionRedirect('/', true);

  if ((loading || !session) || !gotMetaData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading></PieLoading>
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
              <Sidebar />
            </div>
          </div>
        </section>
      </HomeLayout>
    );
  }
}
