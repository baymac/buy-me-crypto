import cn from 'classnames';
import { getSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import PieLoading from '../../components/PieLoading/PieLoading';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import HomeLayout from '../../layouts/HomeLayout';
import {
  IGetCheckoutRequest,
  IGetCheckoutResponse,
  IGetCheckoutResponseData,
} from '../../lib/checkout/getCheckoutSession';
import fetcher from '../../lib/fetcher';
import styles from '../../styles/pageStyles/app.module.css';
import rootStyles from '../../styles/root.module.css';

export async function getServerSideProps(context) {
  const { params, req } = context;
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }
  const { sid: sessionId } = params;
  return {
    props: {
      sessionId,
    },
  };
}

export default function Checkout({ sessionId }: { sessionId: string }) {
  const [loadingTxnDetails, setLoadingTxnDetails] = useState(false);
  const [txnDetails, setTxnDetails] = useState<IGetCheckoutResponseData | null>(
    null
  );
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoadingTxnDetails(true);
    fetcher<IGetCheckoutRequest, IGetCheckoutResponse>(
      '/api/checkout/getSession',
      { sessionId }
    ).then((res) => {
      if (res.error) {
        enqueueSnackbar({
          message: res.message,
        });
      } else {
        setTxnDetails(res.data);
      }
      setLoadingTxnDetails(false);
    });
  }, []);

  return (
    <HomeLayout hideMenu={true}>
      <section className={cn(rootStyles.section)} id="about">
        <div
          className={cn(
            rootStyles.container,
            rootStyles.grid,
            styles.about__container
          )}
        >
          {loadingTxnDetails && <PieLoading />}
          {!loadingTxnDetails && txnDetails !== null && (
            <>
              <h3>Transaction Details</h3>
              <p>Amount: {txnDetails?.amt} Lamports</p>
              <p>Creator Solana Address: {txnDetails?.creatorSolAddr}</p>
              <ConnectWallet />
            </>
          )}
        </div>
      </section>
    </HomeLayout>
  );
}
