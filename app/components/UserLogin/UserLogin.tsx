import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import LoginLayout from '../../layouts/LoginLayout';
import fetchJson from '../../lib/fetchJson';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import styles from './userlogin.module.css';
import { signIn } from 'next-auth/client';

const UserLogin = ({ providers }) => {
  const providerEleArr = Object.values(providers).map((provider) => {
    return (
      <div className={cn(styles.input_box)}>
        <button onClick={() => signIn(provider.id, { callbackUrl: process.env.CALLBACK_URL })}>
          Sign in with {provider.name}
        </button>
      </div>
    );
  })
  return (
    <LoginLayout>
      <h1 className={styles.heading}>Buy Me Crypto</h1>
      <>
        {providerEleArr}
      </>
    </LoginLayout>

  )
}

export default UserLogin
