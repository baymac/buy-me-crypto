import {
  UilApps,
  UilArrowLeft,
  UilMoon,
  UilMultiply,
  UilSun,
} from '@iconscout/react-unicons';
import cn from 'classnames';
import { signOut, useSession } from 'next-auth/client';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createElement, useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContextProvider';
import rootStyles from '../../styles/root.module.css';
import Logo from '../Logo/Logo';
import styles from './nav.module.css';
import NavLinkMobile from './NavLinkMobile';

export default function Nav() {
  const { navBarOpen, setNavBarOpen } = useAppContext();

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [session, loading] = useSession();
  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const router = useRouter();

  return (
    <>
      <header className={styles.header}>
        <nav className={cn(styles.nav, rootStyles.container)}>
          {!router.pathname.startsWith('/posts') && (
            <Link href="/">
              <Logo />
              {/* <button
                className={styles.nav__logo_button}
                aria-label="logo-button"
              >
                <div className={styles.nav__logo}>
                  <Logo />
                  <div className={styles.nav__logo__name}>Buy Me Crypto</div>
                </div>
              </button> */}
            </Link>
          )}
          {router.pathname.startsWith('/posts') && (
            <Link href={`/blog`} passHref>
              <button
                className={styles.nav__logo_button}
                aria-label="back-button"
              >
                <div className={styles.nav__logo}>
                  <UilArrowLeft />
                </div>
              </button>
            </Link>
          )}
          {/* <NavLinkBigScreen /> */}
          <div className={styles.nav__btns}>
            {mounted &&
              createElement(
                'button',
                {
                  className: cn(styles.nav__changeTheme),
                  onClick: () =>
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
                  'aria-label': 'change-theme-button',
                  title: 'Change theme',
                },
                createElement(
                  resolvedTheme === 'dark' ? UilSun : UilMoon,
                  {
                    id: 'theme-button',
                    width: 28,
                    height: 28,
                  },
                  null
                )
              )}
            {!mounted && (
              <div className={styles.skeleton_loader_container}>
                {createElement(
                  'div',
                  {
                    className: cn(styles.skeleton_loader),
                    title: 'Loading...',
                  },
                  null
                )}
              </div>
            )}
            {!navBarOpen && (
              <button
                onClick={() => setNavBarOpen(true)}
                className={styles.nav__toggle}
                aria-label="nav-open-button"
                title="Show Menu"
              >
                <UilApps id="nav_toggle" width={28} height={28} />
              </button>
            )}
            {navBarOpen && (
              <button
                className={styles.nav__toggle}
                onClick={() => setNavBarOpen(false)}
                aria-label="nav-close-button"
                title="Close Menu"
              >
                <UilMultiply width={28} height={28} id="nav_toggle" />
              </button>
            )}
            {session &&
              createElement(
                'button',
                {
                  className: cn(styles.nav__signout),
                  onClick: () => {
                    signOut();
                  },
                  'aria-label': 'sign-out-button',
                  title: 'Sign out',
                },
                [
                  createElement(
                    'span',
                    {
                      className: cn(styles.nav__signout__text),
                    },
                    'Log Out'
                  ),
                ]
              )}
            {!session &&
              createElement(
                'button',
                {
                  className: cn(styles.nav__signin),
                  onClick: () => {
                    router.push('/login');
                  },
                  'aria-label': 'sign-in-button',
                  title: 'Sign in',
                },
                [
                  createElement(
                    'span',
                    {
                      className: cn(styles.nav__signin__text),
                    },
                    'Log In'
                  ),
                ]
              )}
          </div>
        </nav>
      </header>
      <NavLinkMobile />
    </>
  );
}
