import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
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
  cluster: string;
  setCluster: React.Dispatch<React.SetStateAction<string>>;
  clusterConnection: any;
  wallet: any;
  setWallet: React.Dispatch<React.SetStateAction<any>>;
  connectWallet: any;
  disconnectWallet: any;
  getWalletBalance: any;
}

const WalletContext = createContext({
  cluster: null,
  setCluster: (cluster: string) => {},
  clusterConnection: null,
  wallet: null,
  // eslint-disable-next-line no-unused-vars
  setWallet: (wallet: any) => {},
  connectWallet: () => false,
  disconnectWallet: () => {},
  getWalletBalance: () => {},
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

  const setupClusterConnection = () => {
    setClusterConnection(new Connection(clusterUrls[cluster]()));
  };

  // Setup new connection everytime cluster is changed
  useEffect(() => {
    if (cluster) {
      console.log(cluster);
      setupClusterConnection();
    }
  }, [cluster]);

  const [wallet, setWallet] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  // Get solana object or notify is wallet not found
  const getProvider = () => {
    if ('solana' in window) {
      // @ts-ignore
      const provider = window.solana;
      if (provider.isPhantom) {
        console.log(provider);
        return provider;
      }
    }
    enqueueSnackbar({
      message: 'Please install Phantom wallet extension in your browser.',
    });
    return null;
  };

  // Connect app with the wallet
  const connectWallet = async (): Promise<boolean> => {
    const provider = getProvider();
    if (provider) {
      if (!provider.isConnected) {
        try {
          await provider.connect();
          enqueueSnackbar({
            message: 'Wallet connected.',
          });
          return provider.isConnected;
        } catch (e) {
          enqueueSnackbar({
            message: e.message,
          });
          return false;
        }
      } else {
        enqueueSnackbar({
          message: 'Wallet connected.',
        });
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
        await provider.disconect();
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
      const address = await getPublicKey();
      const pubKey = new PublicKey(address);
      const balance = await clusterConnection.getBalance(pubKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (err) {
      enqueueSnackbar({
        message: `Unable to get balance: ${err.message}`,
      });
      return null;
    }
  };

  const value: IWalletContextValues = {
    cluster,
    setCluster,
    clusterConnection,
    wallet,
    setWallet,
    connectWallet,
    disconnectWallet,
    getWalletBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
