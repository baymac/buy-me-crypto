import cn from 'classnames';
import { ClientSafeProvider, signIn } from 'next-auth/client';
import React from 'react';
import LoginLayout from '../../layouts/LoginLayout';
import { getHttpProtocol } from '../../lib/utils';
import styles from './userlogin.module.css';

const UserLogin = ({
  providers,
}: {
  providers: Record<string, ClientSafeProvider>;
}) => {
  const providerEleArr = Object.values(providers).map((provider) => {
    return (
      <div className={cn(styles.input_box)}>
        <button
          onClick={() =>
            signIn(provider.id, {
              callbackUrl: `${getHttpProtocol(process.env.NODE_ENV)}${
                process.env.VERCEL_URL
              }/home`,
            })
          }
        >
          Sign in with {provider.name}
        </button>
      </div>
    );
  });
  return (
    <LoginLayout>
      <h1 className={styles.heading}>Buy Me Crypto</h1>
      {providerEleArr}
    </LoginLayout>
  );
};

export default UserLogin;
