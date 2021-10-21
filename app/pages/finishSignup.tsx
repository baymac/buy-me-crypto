import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { UilStar, UilRocket } from '@iconscout/react-unicons';
import fetcher from '../lib/fetcher';
import styles from '../styles/pageStyles/finishSignup.module.css';
import PieLoading from '../components/PieLoading/PieLoading';
import useSessionRedirect from '../hooks/useSessionRedirect';
import { useSnackbar } from '../context/SnackbarContextProvider';
import { IAddUserMetaDataRequest } from '../lib/userSettings/addUserMetaData';
import { IGenericAPIResponse } from '../lib/utils';
import { IAddPageInfoRequest } from '../lib/userSettings/addPageInfo';

export default function FinishSignup() {
  const [session, loading] = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  useSessionRedirect('/', true);

  const handleFanCreation = async (e) => {
    e.preventDefault();
    const body = {
      userId: session.userId,
      userLevel: 1,
    } as IAddUserMetaDataRequest;

    let result = await fetcher<IAddUserMetaDataRequest, IGenericAPIResponse>(
      '/api/userMetaData/add',
      body
    );

    if (!result.error) {
      router.push('/app');
    } else {
      enqueueSnackbar({
        message: result.message,
      });
    }
  };

  const handleCreatorCreation = async (e) => {
    e.preventDefault();
    const bodyMetaData = {
      userId: session.userId,
      userLevel: 2,
    } as IAddUserMetaDataRequest;
    const bodyPageInfo = {
      userId: session.userId,
    } as IAddPageInfoRequest;

    let resultMetaData = await fetcher<
      IAddUserMetaDataRequest,
      IGenericAPIResponse
    >('/api/userMetaData/add', bodyMetaData);

    if (!resultMetaData.error) {
      let resultPageInfo = await fetcher<
        IAddPageInfoRequest,
        IGenericAPIResponse
      >('/api/pageInfo/add', bodyPageInfo);

      if (!resultPageInfo.error) {
        router.push('/app');
      } else {
        enqueueSnackbar({
          message: resultPageInfo.message,
        });
      }
    } else {
      enqueueSnackbar({
        message: resultMetaData.message,
      });
    }
  };

  if (loading || !session) {
    return <PieLoading />;
  } else {
    return (
      <div className={styles.wrapper}>
        <h1>Select your user type</h1>
        <div className={styles.btnWrapper}>
          <button
            onClick={handleCreatorCreation}
            className={styles.btnWrapper_btn}
          >
            <UilStar />
            Creator
          </button>
          <button onClick={handleFanCreation} className={styles.btnWrapper_btn}>
            <UilRocket />
            Fan
          </button>
        </div>
      </div>
    );
  }
}
