import cn from 'classnames';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { createElement, useEffect, useState } from 'react';
import Image from 'next/image';
import useNavSelection from '../../hooks/useNavSelection';
import { INavItem, sidebarItems } from '../Nav/NavbarLinks';
import styles from '../Sidebar/sidebar.module.css';

const Sidebar = ({ userLevel }) => {
  const [selectedMenu] = useNavSelection();

  const [session, loading] = useSession();
  const [sidebarItemsArr, setSidebarItemsArr] =
    useState<Array<INavItem> | null>(sidebarItems);

  useEffect(() => {
    if (userLevel) {
      if (userLevel === 1) {
        setSidebarItemsArr(
          sidebarItems.filter((item) => item.selector !== 'preview')
        );
      } else {
        setSidebarItemsArr(sidebarItems);
      }
    }
  }, [userLevel]);

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.userInfo}>
        <Image
          priority
          src={session.user.image}
          height={80}
          width={80}
          alt={'user avatar'}
          layout="fixed"
          className={styles.userInfo__img}
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
