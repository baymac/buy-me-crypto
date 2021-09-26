import cn from 'classnames';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { createElement, useEffect, useState, useRef } from 'react';
import PieLoading from '../components/PieLoading/PieLoading';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/index.module.css';
import rootStyles from '../styles/root.module.css';
import { UilArrowRight } from '@iconscout/react-unicons';

export default function Index() {
  const [session, loading] = useSession();
  const router = useRouter();

  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (session) {
      router.push('/app');
    }
  }, [session]);

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = () => {
    if (inputRef.current.innerHTML == '') {
      setInputFocus(false);
    }
  };

  const handleStartMyPageSubmit = () => {
    if (inputRef.current.innerHTML == '') {
      console.log('cannot submit without name');
    } else {
      //check with database if that name is taken
    }
  };

  if (loading || session) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading />
      </div>
    );
  }

  return (
    <HomeLayout>
      <section className={cn(rootStyles.section)} id="about">
        <div
          className={cn(
            rootStyles.container,
            rootStyles.grid,
            styles.about__container
          )}
        >
          <div className={styles.landingContainer}>
            <div className={styles.landingContainer__content}>
              <h2 className={styles.landingContainer__content__headline}>
                Start earning donations via crypto
              </h2>
              <p className={styles.landingContainer__content__subheadline}>
                Its a fast, easy and secure way to receive donations and
                provides you with a unique way to fund your creative work or
                support people.
              </p>
            </div>
            <div className={styles.landingContainer__getStarted}>
              <div className={styles.landingContainer__getStarted__inpWrapper}>
                <div
                  className={
                    styles.landingContainer__getStarted__inpWrapper__url
                  }
                >
                  <div
                    className={
                      styles.landingContainer__getStarted_inpWrapper__url__L
                    }
                  >
                    buymecrypto.com/
                  </div>
                  <div
                    className={
                      styles.landingContainer__getStarted_inpWrapper__url__S
                    }
                  >
                    buymecryp.to/
                  </div>
                </div>
                <div
                  ref={inputRef}
                  className={cn(
                    styles.landingContainer__getStarted__inpWrapper__inp,
                    { [styles.inputFocused]: inputFocus }
                  )}
                  contentEditable="true"
                  onFocus={() => handleInputFocus()}
                  onBlur={() => handleInputBlur()}
                ></div>
              </div>

              <div className={styles.landingContainer__getStarted__btnWrapper}>
                <button onClick={() => handleStartMyPageSubmit()}>
                  <span>Start my page</span>
                  {createElement(
                    UilArrowRight,
                    {
                      id: 'right-arrow-icon',
                      width: 28,
                      height: 28,
                    },
                    null
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
