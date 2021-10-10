import cn from 'classnames';
import React, { useState } from 'react';
import { useWalletContext } from '../../context/WalletContextProvider';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import inputStyles from '../FormGenerator/FormGenerator.module.css';

export default function ConnectWallet() {
  const [connecting, setConnecting] = useState(false);

  const { connectWallet, walletBalance, walletAddr } = useWalletContext();

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
          disabled={connecting}
          onClick={(e) => onConnectClick(e)}
        >
          {connecting ? <ButtonLoading /> : <span>Connect Wallet</span>}
        </button>
      )}
      {walletAddr && (
        <div>
          <p>Your Wallet Address: {walletAddr}</p>
        </div>
      )}
      {walletBalance && (
        <div>
          <p>Your Wallet Balance: {`${walletBalance} Lamports`}</p>
        </div>
      )}
    </>
  );
}
