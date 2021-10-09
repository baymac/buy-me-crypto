import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from '../components/Footer/Footer';
import Nav from '../components/Nav/Nav';
import styles from '../styles/root.module.css';

export default function HomeLayout({
  hideMenu,
  children,
}: {
  hideMenu?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.root}>
      <Head>
        <title>Buy Me Crypto</title>
      </Head>
      <Nav hideMenu={hideMenu} />
      {children}
      <Footer />
    </div>
  );
}
