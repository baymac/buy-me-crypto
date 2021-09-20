import { useRouter } from 'next/router';
import MagicButton from '../components/MagicButton/MagicButton';
import styles from '../styles/pageStyles/error.module.css';

export default function FourOhFour() {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className={styles.center}>
      <div className={styles.container}>
        <div className={styles.message_wrapper}>
          <h1 className={styles.code}>404</h1>
          <h3 className={styles.message}>This page could not be found.</h3>
        </div>
        <div className={styles.button_container}>
          <MagicButton onClick={handleClick} label={'Go Back Home'} />
        </div>
      </div>
    </div>
  );
}
