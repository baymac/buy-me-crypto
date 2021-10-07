import cn from 'classnames';
import React, { useState, useEffect } from 'react';
import styles from '../DashboardForms/DashboardForms.module.css';
import fetchJson from '../../lib/fetchJson';
import { useSession } from 'next-auth/client';
import PieLoading from '../PieLoading/PieLoading';
import rootStyles from '../../styles/root.module.css';
import CreatorPageInfoForm from '../CreatorPageInfoForm/CreatorPageInfoForm';
import { copyFileSync } from 'fs';
import FanSettingForm from '../FanSettingForm/FanSettingForm';

export interface IFormInputField {
  label: string;
  isRequired: boolean;
  type: string;
  isInput: boolean;
  registerName: string;
}

const DashboardForms = () => {
  const [session, loading] = useSession();
  const [initialData, setInitialData] = useState(null);
  const [userMetaData, setUserMetaData] = useState(null);

  useEffect(() => {
    const body = {
      userId: session.userId,
    };

    fetchJson('/api/getUserMetaData', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setUserMetaData(res.data);
        if (res.data.userLevel === 2) {
          fetchJson('/api/getPageInfo', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((pageInfo) => {
            if (pageInfo.data) {
              console.log(pageInfo);
              setInitialData(pageInfo);
            }
          });
        } else {
          fetchJson('/api/getUserFromId', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((data) => {
            console.log('user meta data is 1 ');
            console.log(data);
            setInitialData(data);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [session]);

  if (loading || !session || !initialData || !userMetaData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading></PieLoading>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        {userMetaData.userLevel === 1 && (
          <FanSettingForm initialData={initialData} userId={session.userId} />
        )}
        {userMetaData.userLevel === 2 && (
          <CreatorPageInfoForm
            initialData={initialData}
            userId={session.userId}
          />
        )}
      </div>
    );
  }
};

export default DashboardForms;
