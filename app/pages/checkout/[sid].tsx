import cn from 'classnames';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ButtonLoading from '../../components/ButtonLoading/ButtonLoading';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import ContentWrapper from '../../components/ContentWrapper/ContentWrapper';
import DisconnectWallet from '../../components/DisconnectWallet/DisconnectWallet';
import inputStyles from '../../components/FormGenerator/FormGenerator.module.css';
import PieLoading from '../../components/PieLoading/PieLoading';
import Select from '../../components/Select/Select';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import {
  clusterUrls,
  useWalletContext,
} from '../../context/WalletContextProvider';
import useSessionRedirect from '../../hooks/useSessionRedirect';
import HomeLayout from '../../layouts/HomeLayout';
import {
  IAddOneTimeTxnRequest,
  IAddOneTimeTxnResponse,
} from '../../lib/checkout/addOneTimeTxn';
import {
  IGetCheckoutRequest,
  IGetCheckoutResponse,
  IGetCheckoutResponseData,
} from '../../lib/checkout/getCheckoutSession';
import fetcher from '../../lib/fetcher';
import styles from '../../styles/pageStyles/checkout.module.css';
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
  useSessionRedirect('/', true);

  const [loadingTxnDetails, setLoadingTxnDetails] = useState(false);
  const [txnDetails, setTxnDetails] = useState<IGetCheckoutResponseData | null>(
    null
  );
  const [transacting, setTransacting] = useState(false);

  const { walletBalance, confirmTxn, walletAddr } = useWalletContext();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  useEffect(() => {
    setLoadingTxnDetails(true);
    fetcher<IGetCheckoutRequest, IGetCheckoutResponse>(
      '/api/checkout/getSession',
      { sessionId }
    ).then((res) => {
      if (res.error) {
        if (res.message.includes('Checkout session not found')) {
          router.push('/404');
        } else if (res.message.includes('Transaction complete')) {
          router.push('/app');
          enqueueSnackbar({
            message: 'Transaction complete.',
          });
        } else if (res.message.includes('Checkout session expired')) {
          router.push('/app');
          enqueueSnackbar({
            message: 'Checkout session expired.',
          });
        } else {
          enqueueSnackbar({
            message: res.message,
          });
        }
      } else {
        setTxnDetails(res.data);
      }
      setLoadingTxnDetails(false);
    });
  }, [enqueueSnackbar, router, sessionId]);

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
      // TODO: First add txn to db then complete txn then add txnId (or signature)
      const addOneTimeTxnResp = await fetcher<
        IAddOneTimeTxnRequest & { payId: string },
        IAddOneTimeTxnResponse
      >('/api/checkout/addOneTimeTxn', {
        amount: txnDetails.amt,
        txnId: signature,
        creator: txnDetails.creator,
        fan: txnDetails.fan,
        note: txnDetails.note,
        payId: sessionId,
      });
      if (addOneTimeTxnResp.error) {
        enqueueSnackbar({ message: addOneTimeTxnResp.message });
      } else {
        router.push('/app');
      }
    }
    setTransacting(false);
  };

  const { cluster, setCluster } = useWalletContext();

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
            <ContentWrapper className={styles.contentWrapper}>
              <h1 className={styles.pageHeading}>Transaction Details</h1>
              <p>Amount: {txnDetails?.amt} Lamports</p>
              <p>Creator&apos;s Solana Address: {txnDetails?.creatorSolAddr}</p>
              {!walletBalance && (
                <div className={styles.selectWrapper}>
                  <Select
                    label="Cluster Connection"
                    onChange={setCluster}
                    item={cluster}
                    items={Object.keys(clusterUrls)}
                  />
                </div>
              )}
              {walletBalance && <p>Cluster connection: {cluster}</p>}
              <ConnectWallet />
              {walletAddr && <p>Your Wallet Address: {walletAddr}</p>}
              {walletBalance && (
                <p>Your Wallet Balance: {`${walletBalance} Lamports`}</p>
              )}
              {walletBalance && <DisconnectWallet />}
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
            </ContentWrapper>
          )}
        </div>
      </section>
    </HomeLayout>
  );
}
