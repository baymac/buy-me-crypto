import {
  UilEye,
  UilHome,
  UilSetting,
  UilSignInAlt,
  UilSignOutAlt,
  UilUsersAlt,
} from '@iconscout/react-unicons';
import cn from 'classnames';
import { signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createElement } from 'react';
import { useAppContext } from '../../context/AppContextProvider';
import useFinishSignupRedirect from '../../hooks/useFinishSignupRedirect';
import useNavSelection from '../../hooks/useNavSelection';
import styles from './navlink.module.css';

export interface INavItem {
  label: string;
  path?: string;
  selector: string;
  icon: any;
}

const navItems: INavItem[] = [
  {
    label: 'Home',
    icon: UilHome,
    path: '/',
    selector: 'home',
  },
];

export const sidebarItems: INavItem[] = [
  {
    label: 'Home',
    icon: UilHome,
    path: '/',
    selector: 'home',
  },
  {
    label: 'Page Preview',
    icon: UilEye,
    path: '/',
    selector: 'preview',
  },
  {
    label: 'Settings',
    icon: UilSetting,
    path: '/settings',
    selector: 'settings',
  },
];

export default function NavBarLinks() {
  const { setNavBarOpen } = useAppContext();

  const [selectedMenu] = useNavSelection();

  const router = useRouter();

  const [session, loading] = useSession();

  return (
    <>
      {session && (
        <div className={styles.infoContainer}>
          <img
            className={styles.infoContainer__avatar}
            src={session.user.image}
            alt="User avatar"
          />
          <h4 className={styles.infoContainer__name}> {session.user.name}</h4>
          <p className={styles.infoContainer__email}>{session.user.email}</p>
        </div>
      )}

      <div className={cn(styles.nav__list)}>
        {(!session ? navItems : sidebarItems).map((navItem) => (
          <Link href={`${navItem.path}`} key={navItem.label}>
            <a
              className={cn(styles.nav__item, {
                [styles.nav__item_selected]:
                  selectedMenu === `${navItem.selector}`,
              })}
              onClick={() => setNavBarOpen(false)}
              tabIndex={0}
            >
              <span className={styles.nav__link} id={`${navItem.selector}`}>
                {createElement(
                  navItem.icon,
                  { className: styles.nav__icon },
                  null
                )}
                {navItem.label}
              </span>
            </a>
          </Link>
        ))}

        {session && (
          <a
            className={cn(styles.nav__item, styles.signout_nav_item)}
            onClick={() => {
              signOut();
              router.push('/');
            }}
            tabIndex={0}
          >
            <span className={styles.nav__link}>
              {createElement(
                UilSignOutAlt,
                {
                  className: styles.nav__icon,
                },
                null
              )}
              Sign Out
            </span>
          </a>
        )}

        {!session && (
          <a
            className={cn(styles.nav__item, styles.signout_nav_item)}
            onClick={() => {
              router.push('/login');
            }}
            tabIndex={0}
          >
            <span className={styles.nav__link}>
              {createElement(
                UilSignInAlt,
                {
                  className: styles.nav__icon,
                },
                null
              )}
              Log In
            </span>
          </a>
        )}
      </div>
    </>
  );
}
