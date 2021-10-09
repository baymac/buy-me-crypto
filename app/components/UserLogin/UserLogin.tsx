import cn from 'classnames';
import { ClientSafeProvider, signIn } from 'next-auth/client';
import React from 'react';
import HomeLayout from '../../layouts/HomeLayout';
import { getHostUrl } from '../../lib/utils';
import styles from './userlogin.module.css';

const UserLogin = ({
  providers,
}: {
  providers: Record<string, ClientSafeProvider>;
}) => {
  const providerEleArr = Object.values(providers).map((provider) => {
    return (
      <div className={cn(styles.input_box)} key={provider.id}>
        <button
          onClick={() =>
            signIn(provider.id, {
              callbackUrl: `${getHostUrl}/app`,
            })
          }
        >
          Sign in with {provider.name}
        </button>
      </div>
    );
  });
  return (
    <HomeLayout hideMenu>
      <div className={styles.container}>
        <h1 className={styles.heading}>Select your preferred login method</h1>
        {providerEleArr}
      </div>
    </HomeLayout>
  );
};

export default UserLogin;
