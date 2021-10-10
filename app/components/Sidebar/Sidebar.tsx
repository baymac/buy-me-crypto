import cn from 'classnames';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { createElement, useEffect, useState } from 'react';
import useFinishSignupRedirect from '../../hooks/useFinishSignupRedirect';
import useNavSelection from '../../hooks/useNavSelection';
import { sidebarItems } from '../Nav/NavbarLinks';
import styles from '../Sidebar/Sidebar.module.css';
import { INavItem } from '../Nav/NavbarLinks';

const Sidebar = () => {
  const [selectedMenu] = useNavSelection();

  const [session, loading] = useSession();
  const [sidebarItemsArr, setSidebarItemsArr] =
    useState<Array<INavItem> | null>(sidebarItems);
  const [userMetaData] = useFinishSignupRedirect();

  useEffect(() => {
    if (userMetaData) {
      if (userMetaData.userLevel === 1) {
        setSidebarItemsArr(
          sidebarItems.filter((item) => item.selector !== 'preview')
        );
      }
    }
  }, [userMetaData]);

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.userInfo}>
        <img
          className={styles.userInfo__img}
          src={session.user.image}
          alt="user avatar"
        />
        <h4 className={styles.userInfo__name}>{session.user.name}</h4>
      </div>
      <ul className={styles.sidebarList}>
        {sidebarItemsArr.map((item) => {
          return (
            <Link href={`${item.path}`} key={item.label}>
              <a
                className={cn(styles.sidebarList__item, {
                  [styles.sidebarList__item_selected]:
                    selectedMenu === `${item.selector}`,
                })}
                tabIndex={0}
              >
                <span
                  className={styles.sidebarList__item__link}
                  id={`${item.selector}`}
                >
                  {createElement(
                    item.icon,
                    { className: styles.sidebarList__item__link__icon },
                    null
                  )}
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
