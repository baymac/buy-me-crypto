import React from 'react';
import styles from './Headline.module.css';

const Headline = () => {
  return (
    <div className={styles.content}>
      <h2 className={styles.content__headline}>
        Start earning donations via crypto
      </h2>
      <p className={styles.content__subheadline}>
        Its a fast, easy and secure way to receive donations and provides you
        with a unique way to fund your creative work or support people.
      </p>
    </div>
  );
};

export default Headline;
