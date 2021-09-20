import styles from './magicbutton.module.css';

export default function MagicButton({ onClick, label }: any) {
  return (
    <>
      <button className={styles.pushable} onClick={onClick}>
        <span className={styles.shadow}></span>
        <span className={styles.edge}></span>
        <span className={styles.front}>{label}</span>
      </button>
    </>
  );
}
