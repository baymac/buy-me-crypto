import cn from 'classnames';
import React, { useState } from 'react';
import { useWalletContext } from '../../context/WalletContextProvider';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import inputStyles from '../FormGenerator/FormGenerator.module.css';

export default function DisconnectWallet() {
  const [disconnecting, setDisconnecting] = useState(false);

  const { disconnectWallet, walletBalance } = useWalletContext();

  const onConnectClick = async (e) => {
    setDisconnecting(true);
    await disconnectWallet();
    setDisconnecting(false);
  };

  return (
    <button
      className={cn(inputStyles.btn, inputStyles.socialBtn)}
      style={{ marginBottom: 0 }}
      disabled={disconnecting}
      onClick={(e) => onConnectClick(e)}
    >
      {disconnecting ? <ButtonLoading /> : <span>Disonnect Wallet</span>}
    </button>
  );
}
