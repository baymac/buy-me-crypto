import cn from 'classnames';
import React, { useState } from 'react';
import { useWalletContext } from '../../context/WalletContextProvider';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import inputStyles from '../FormGenerator/FormGenerator.module.css';
import styles from './connectwallet.module.css';

export default function ConnectWallet() {
  const [connecting, setConnecting] = useState(false);

  const { connectWallet, walletBalance } = useWalletContext();

  const onConnectClick = async (e) => {
    setConnecting(true);
    await connectWallet();
    setConnecting(false);
  };

  return (
    <>
      {!walletBalance && (
        <button
          className={cn(inputStyles.btn, inputStyles.socialBtn)}
          style={{ marginBottom: 0 }}
          disabled={connecting}
          onClick={(e) => onConnectClick(e)}
        >
          {connecting ? (
            <ButtonLoading className={styles.buttonLoading} />
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      )}
    </>
  );
}
