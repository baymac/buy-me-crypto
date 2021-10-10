import cn from 'classnames';
import React, { useState } from 'react';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import { useWalletContext } from '../../context/WalletContextProvider';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import inputStyles from '../FormGenerator/FormGenerator.module.css';

export default function ConnectWallet() {
  const [connecting, setConnecting] = useState(false);
  const [transacting, setTransacting] = useState(false);

  const { connectWallet, walletBalance, walletAddr } = useWalletContext();

  const { enqueueSnackbar } = useSnackbar();

  const onConnectClick = async (e) => {
    setConnecting(true);
    await connectWallet();
    setConnecting(false);
  };

  const onConfirmTxnClick = async (e) => {
    setTransacting(true);

    setTransacting(false);
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
      {walletBalance && (
        <button
          className={cn(inputStyles.btn, inputStyles.saveBtn)}
          disabled={transacting}
          onClick={(e) => onConfirmTxnClick(e)}
        >
          {transacting ? <ButtonLoading /> : <span>Confirm Transaction</span>}
        </button>
      )}
    </>
  );
}
