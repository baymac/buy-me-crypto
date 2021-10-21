import { UilInfoCircle } from '@iconscout/react-unicons';
import { createElement } from 'react';
import styles from '../AlertBanner/AlertBanner.module.css';

const AlertBanner = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      {createElement(
        UilInfoCircle,
        {
          width: 28,
          height: 28,
        },
        null
      )}
      <span>{children}</span>
    </div>
  );
};

export default AlertBanner;
