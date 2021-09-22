import React from 'react';
import UserLogin from '../components/UserLogin/UserLogin';

export default function Login() {

  console.log(process.env.NODE_PUBLIC_MAGIC_PUB_KEY);

  return <UserLogin />;
}
