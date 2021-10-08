import cn from 'classnames';
import { SnackbarVariants } from '../../context/SnackbarContextProvider';
import { useReset } from '../../hooks/useReset';
import styles from './snackbar.module.css';

export interface ISnackbarProps {
  id: string;
  dequeueSnackbar: (id: string) => void;
  variant?: SnackbarVariants;
  message: string;
  duration?: number;
}

// Variants

export default function Snackbar(props: ISnackbarProps) {
  const { id, duration, dequeueSnackbar } = props;

  useReset(dequeueSnackbar, id, duration);

  return (
    <div className={cn(styles.snackbar__container)}>
      <div className={styles.snackbar__content}>{props.message}</div>
    </div>
  );
}
