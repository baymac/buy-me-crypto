import cn from 'classnames';
import React from 'react';
import rootStyles from '../styles/root.module.css';
import HomeLayout from '../layouts/HomeLayout';
import styles from '../styles/pageStyles/home.module.css';

export default function Home() {
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
          <>home</>
        </div>
      </section>
    </HomeLayout>
  );
}
