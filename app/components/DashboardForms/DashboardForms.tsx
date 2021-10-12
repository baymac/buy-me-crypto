import { useSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import fetchJson from '../../lib/fetchJson';
import rootStyles from '../../styles/root.module.css';
import CreatorPageInfoForm from '../CreatorPageInfoForm/CreatorPageInfoForm';
import styles from '../DashboardForms/DashboardForms.module.css';
import FanSettingForm from '../FanSettingForm/FanSettingForm';
import PieLoading from '../PieLoading/PieLoading';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import useFinishSignupRedirect from '../../hooks/useFinishSignupRedirect';

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
  const [userMetaData, setUserMetaData] = useFinishSignupRedirect();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (userMetaData) {
      const body = {
        userId: session.userId,
      };
      if (userMetaData.userLevel === 2) {
        fetchJson('/api/pageInfo/get', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((pageInfo) => {
            if (pageInfo.error) {
              throw new Error(pageInfo.message);
            }
            if (pageInfo.data) {
              setInitialData(pageInfo);
            }
          })
          .catch((error) => {
            enqueueSnackbar({
              message: error.message,
            });
          });
      } else {
        fetchJson('/api/user/getFromId', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((data) => {
            if (data.error) {
              throw new Error(data.message);
            }
            setInitialData(data);
          })
          .catch((error) => {
            enqueueSnackbar({
              message: error.message,
            });
          });
      }
    }
  }, [session, userMetaData]);

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
