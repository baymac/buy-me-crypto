import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import LoginLayout from '../../layouts/LoginLayout';
import fetchJson from '../../lib/fetchJson';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import styles from './userlogin.module.css';

const LoginSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  // Picked password regex from https://stackoverflow.com/a/21456918/7814679
  password: yup
    .string()
    .required('Password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
    ),
});

export interface ILoginUserRequest {
  email: string;
  password: string;
}

export default function UserLogin() {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<ILoginUserRequest>({
    resolver: yupResolver(LoginSchema),
  });

  const [token, setToken] = useState<string | null>(null);

  const onSubmit = async (data: ILoginUserRequest) => {
    setLoading(true);
    await fetchJson('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        token,
        password: data.password,
      }), // TODO: hash the password
    });
    setLoading(false);
  };

  return (
    <LoginLayout>
      <h1 className={styles.heading}>Buy Me Crypto</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.input_box}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            disabled={loading}
            {...register('email')}
          />
          {errors.email && (
            <p className={styles.error_message}>{errors.email.message}</p>
          )}
        </div>

        <div className={cn(styles.input_box)}>
          <input
            name="password"
            type={'password'}
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <p className={styles.error_message}>{errors.password.message}</p>
          )}
        </div>
        <div
          className={cn(styles.input_box, {
            [styles.button_disable]: loading,
          })}
        >
          <button type="submit" disabled={loading}>
            {loading ? <ButtonLoading /> : 'Login'}
          </button>
        </div>
      </form>
    </LoginLayout>
  );
}
