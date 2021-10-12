import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSnackbar } from './SnackbarContextProvider';

// export const CLUSTER_LOCAL = 'local';
export const CLUSTER_DEVNET = 'devnet';
export const CLUSTER_TESTNET = 'testnet';
// export const CLUSTER_MAINNET = 'mainnet-beta';

export const clusterUrls = {
  // [CLUSTER_LOCAL]: () => 'http://127.0.0.1:8899',
  [CLUSTER_DEVNET]: () => clusterApiUrl(CLUSTER_DEVNET),
  [CLUSTER_TESTNET]: () => clusterApiUrl(CLUSTER_TESTNET),
  // [CLUSTER_MAINNET]: () => clusterApiUrl(CLUSTER_MAINNET),
};

export interface IWalletInfo {
  balance: number;
  address: string;
}

export interface IWalletContextValues {
  cluster: string;
  setCluster: React.Dispatch<React.SetStateAction<string>>;
  clusterConnection: any;
  connectWallet: any;
  disconnectWallet: any;
  walletBalance: number | null;
  walletAddr: string | null;
  confirmTxn: (receiver: string, amount: number) => Promise<string> | null;
}

const WalletContext = createContext({
  cluster: null,
  setCluster: (cluster: string) => {},
  clusterConnection: null,
  connectWallet: () => false,
  disconnectWallet: () => {},
  walletBalance: null,
  walletAddr: null,
  confirmTxn: (receiver: string, amount: number) => null,
});

export function useWalletContext() {
  return useContext(WalletContext);
}

export default function WalletContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  // For cluster shorthand
  const [cluster, setCluster] = useState(CLUSTER_DEVNET);
  // For storing cluster connection
  const [clusterConnection, setClusterConnection] = useState(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletAddr, setWalletAddr] = useState<string | null>(null);

  const setupClusterConnection = () => {
    setClusterConnection(new Connection(clusterUrls[cluster]()));
  };

  // Setup new connection everytime cluster is changed
  useEffect(() => {
    if (cluster) {
      setupClusterConnection();
    }
  }, [cluster]);

  const { enqueueSnackbar } = useSnackbar();

  // Get solana object or notify is wallet not found
  const getProvider = () => {
    if ('solana' in window) {
      // @ts-ignore
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    enqueueSnackbar({
      message: 'Please install Phantom wallet extension in your browser.',
    });
    return null;
  };

  // Connect app with the wallet
  const connectWallet = async (alertOnSuccess?: boolean): Promise<boolean> => {
    const provider = getProvider();
    if (provider) {
      if (!provider.isConnected) {
        try {
          await provider.connect();
          if (alertOnSuccess) {
            enqueueSnackbar({
              message: 'Wallet connected.',
            });
          }
          const pubKey = await getPublicKey();
          setWalletAddr(pubKey.toBase58());
          const balance = await getWalletBalance();
          setWalletBalance(balance);
          return provider.isConnected;
        } catch (e) {
          enqueueSnackbar({
            message: e.message,
          });
          return false;
        }
      } else {
        if (alertOnSuccess) {
          enqueueSnackbar({
            message: 'Wallet connected.',
          });
        }
        return provider.isConnected;
      }
    } else {
      return false;
    }
  };

  const disconnectWallet = async () => {
    const provider = getProvider();
    if (provider) {
      if (provider.isConnected) {
        await provider.disconnect();
        setWalletAddr(null);
        setWalletBalance(null);
        enqueueSnackbar({
          message: 'Wallet disconnected.',
        });
        return provider.isConnected;
      } else {
        enqueueSnackbar({
          message: 'Wallet not connected.',
        });
        return provider.isConnected;
      }
    } else {
      enqueueSnackbar({
        message: 'Unable to connect wallet.',
      });
      return false;
    }
  };

  const getPublicKey = async () => {
    const provider = getProvider();
    if (provider) {
      if (!provider.isConnected) {
        await provider.connect();
      }
      return provider.publicKey;
    } else {
      return null;
    }
  };

  const getWalletBalance = async () => {
    try {
      const balance = await clusterConnection.getBalance(await getPublicKey());
      return balance;
    } catch (err) {
      enqueueSnackbar({
        message: `Unable to get balance: ${err.message}`,
      });
      return null;
    }
  };

  const confirmTxn = async (receiver, amt) => {
    const senderAddr = new PublicKey(walletAddr);
    const receiverAddr = new PublicKey(receiver);
    const txn = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderAddr,
        toPubkey: receiverAddr,
        lamports: amt,
      })
    );
    const { blockhash } = await clusterConnection.getRecentBlockhash();
    txn.recentBlockhash = blockhash;
    txn.feePayer = senderAddr;
    let signed = null;
    try {
      signed = await getProvider()?.signTransaction(txn);
    } catch (err) {
      enqueueSnackbar({
        message: `Error signing transaction: ${err.message}`,
      });
      return null;
    }
    let signature = null;
    try {
      signature = await clusterConnection.sendRawTransaction(
        signed.serialize()
      );
    } catch (err) {
      enqueueSnackbar({
        message: `Error sending transaction: ${err.message}`,
      });
      return null;
    }
    await clusterConnection.confirmTransaction(signature, 'confirmed');
    return signature;
  };

  const value: IWalletContextValues = {
    cluster,
    setCluster,
    clusterConnection,
    connectWallet,
    disconnectWallet,
    walletBalance,
    walletAddr,
    confirmTxn,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
