import { Connection } from '@solana/web3.js';
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { useSnackbar } from './SnackbarContextProvider';
import { clusterApiUrl } from '@solana/web3.js';

export const CLUSTER_LOCAL = 'local';
export const CLUSTER_DEVNET = 'devnet';
export const CLUSTER_TESTNET = 'testnet';
export const CLUSTER_MAINNET = 'mainnet-beta';

const clusterUrls = {
  [CLUSTER_LOCAL]: () => 'http://127.0.0.1:8899',
  [CLUSTER_DEVNET]: () => clusterApiUrl(CLUSTER_DEVNET),
  [CLUSTER_TESTNET]: () => clusterApiUrl(CLUSTER_TESTNET),
  [CLUSTER_MAINNET]: () => clusterApiUrl(CLUSTER_MAINNET),
};

export interface IWalletContextValues {
  wallet: any;
  setWallet: React.Dispatch<React.SetStateAction<any>>;
  connectWallet: any;
  disconnectWallet: any;
}

const WalletContext = createContext({
  // eslint-disable-next-line no-unused-vars
  setWallet: (wallet: any) => {},
  wallet: null,
  connectWallet: () => {},
  disconnectWallet: () => {},
});

export function useWalletContext() {
  return useContext(WalletContext);
}

let memoizedConnection = {};

const getConnection = (clusterUrl: string) => {
  const key = clusterUrl;
  if (!memoizedConnection[key]) {
    memoizedConnection = { [key]: new Connection(clusterUrl) };
  }
  return memoizedConnection[key];
};

export default function WalletContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cluster, setCluster] = useState(CLUSTER_DEVNET);
  const [wallet, setWallet] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const connectWallet = () => {
    wallet?.connect().catch((e) => {
      setWallet(null);
      enqueueSnackbar({
        message: 'Wallet not connected, please try again',
      });
    });
  };

  const disconnectWallet = () => wallet?.disconnect();

  // const connection = getConnection(clusterUrls[cluster]);

  const value: IWalletContextValues = {
    setWallet,
    wallet,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
