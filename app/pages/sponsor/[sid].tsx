import cn from 'classnames';
import { getSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import ButtonLoading from '../../components/ButtonLoading/ButtonLoading';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import PieLoading from '../../components/PieLoading/PieLoading';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import { useWalletContext } from '../../context/WalletContextProvider';
import HomeLayout from '../../layouts/HomeLayout';
import {
  IGetCheckoutRequest,
  IGetCheckoutResponse,
  IGetCheckoutResponseData,
} from '../../lib/checkout/getCheckoutSession';
import fetcher from '../../lib/fetcher';
import styles from '../../styles/pageStyles/app.module.css';
import rootStyles from '../../styles/root.module.css';
import inputStyles from '../../components/FormGenerator/FormGenerator.module.css';
import router from 'next/router';

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
  const [transacting, setTransacting] = useState(false);

  const { walletBalance, confirmTxn } = useWalletContext();

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

  const onConfirmTxnClick = async (e) => {
    setTransacting(true);
    const signature = await confirmTxn(
      txnDetails?.creatorSolAddr,
      txnDetails?.amt
    );
    if (signature) {
      enqueueSnackbar({
        message: `Transaction confirmed with signature: ${signature}`,
      });
      router.push('/app');
    }
    setTransacting(false);
  };

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
              <h1>Transaction Details</h1>
              <p>Amount: {txnDetails?.amt} Lamports</p>
              <p>Creator Solana Address: {txnDetails?.creatorSolAddr}</p>
              <ConnectWallet />
              {walletBalance && (
                <button
                  className={cn(inputStyles.btn, inputStyles.saveBtn)}
                  disabled={transacting}
                  onClick={(e) => onConfirmTxnClick(e)}
                >
                  {transacting ? (
                    <ButtonLoading />
                  ) : (
                    <span>Confirm Transaction</span>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </HomeLayout>
  );
}
