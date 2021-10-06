import React from 'react'
import {useSession} from 'next-auth/client'
import useFinishSignupRedirect from '../../hooks/useFinishSignupRedirect';
import useSessionRedirect from '../../hooks/useSessionRedirect';
import styles from '../../styles/pageStyles/creator.module.css'
import rootStyles from '../../styles/root.module.css';
import AlertBanner from '../../components/AlertBanner/AlertBanner';
import PieLoading from '../../components/PieLoading/PieLoading';
import HomeLayout from '../../layouts/HomeLayout';
import cn from 'classnames';
import Link from 'next/link'
import Sidebar from '../../components/Sidebar/Sidebar'
import fetchJson from '../../lib/fetchJson';
import { IGetUserRequest } from '../../lib/getUser';
import { IGetPageInfoRequest } from '../../lib/getPageInfo';


export async function getServerSideProps(context){

    const {params,req,res} = context;

    const {username} = params
    const body : IGetUserRequest ={
      username
    }
    const creator = await fetchJson('http://localhost:3000/api/getUser',{
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if(!creator.data){
      console.log("no creator")
      return {
        redirect :{
          destination : '/404'
        }
      }
    }

    const pageInfoBody : IGetPageInfoRequest = {
      userId : creator.data.id
    }

    const creatorPageInfo = await fetchJson('http://localhost:3000/api/getPageInfo',{
      method: 'POST',
      body: JSON.stringify(pageInfoBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if(!creatorPageInfo.data){
      console.log('creatorPageinfo missgin')      
      return {
        redirect :{
          destination : '/404'
        }
      }
    }

    return {
        props : {
          creator : creator.data, 
          creatorPageInfo : creatorPageInfo.data
        }
    }
}

const creatorPage = ({creator, creatorPageInfo}) => {
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
                      <img src={creator.image} alt='creator avatar'/>
                      <h2>{creator.username}</h2>
                      <h4>{creatorPageInfo.pageHeadline}</h4>
                      <p>{creatorPageInfo.aboutPage}</p>
                    </div>
                    <div className={styles.wrapper__sponsor}>
                      <h2>{`Sponsor ${creator.username}`}</h2>
                      <button>
                        sponsor
                      </button>
                    </div>
                </div>
            </div>
          </section>
        </HomeLayout>
      );
    }
}

export default creatorPage
