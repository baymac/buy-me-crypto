import React from 'react';
import UserLogin from '../components/UserLogin/UserLogin';
import { providers, signIn, getSession, csrfToken } from "next-auth/client"
import cn from 'classnames';
import styles from '../styles/pageStyles/login.module.css'

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/home" },
    };
  }

  return {
    props: {
      providers: await providers(),
      csrfToken: await csrfToken(context), //Only for Email 
    },
  };
}

export default function Login({ providers }) {


  return <UserLogin providers={providers} />;
}

