import Head from 'next/head';
import Footer from '../components/Footer/Footer';
import Nav from '../components/Nav/Nav';
import styles from '../styles/root.module.css';

export default function HomeLayout({ children }) {
  return (
    <div className={styles.root}>
      <Head>
        <title>Buy Me Crypto</title>
      </Head>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
