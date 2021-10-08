import cn from 'classnames';
import { SnackbarVariants } from '../../context/SnackbarContextProvider';
import styles from './snackbar.module.css';

export interface ISnackbarProps {
  id: string;
  reset?: () => void;
  onClose?: () => void;
  variant?: SnackbarVariants;
  message: string;
  duration?: number;
}

// Variants and duration not implemented yet

export default function Snackbar(props: ISnackbarProps) {
  const { id } = props;

  return (
    <div className={cn(styles.snackbar__container)}>
      <div className={styles.snackbar__content}>{props.message}</div>
    </div>
  );
}
