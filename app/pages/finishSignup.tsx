import { useSession } from 'next-auth/client';
import fetchJson from '../lib/fetchJson';
import styles from '../styles/pageStyles/finishSignup.module.css';
import PieLoading from '../components/PieLoading/PieLoading';
import useSessionRedirect from '../hooks/useSessionRedirect';
import { useRouter } from 'next/router';
import { UilStar, UilRocket } from '@iconscout/react-unicons';

export default function finishSignup() {
  const [session, loading] = useSession();
  const router = useRouter();

  useSessionRedirect('/', true);

  const handleFanCreation = async (e) => {
    e.preventDefault();
    const body = {
      userId: session.userId,
      userLevel: 1,
    };

    let result = await fetchJson('/api/addUserMetaData', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!result.error) {
      router.push('/app');
    }
  };

  const handleCreatorCreation = async (e) => {
    e.preventDefault();
    const bodyMetaData = {
      userId: session.userId,
      userLevel: 2,
    };
    const bodyPageInfo = {
      userId: session.userId,
    };

    let resultMetaData = await fetchJson('/api/addUserMetaData', {
      method: 'POST',
      body: JSON.stringify(bodyMetaData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resultMetaData.error) {
      let resultPageInfo = await fetchJson('/api/addPageInfo', {
        method: 'POST',
        body: JSON.stringify(bodyPageInfo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!resultPageInfo.error) {
        router.push('/app');
      }
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
