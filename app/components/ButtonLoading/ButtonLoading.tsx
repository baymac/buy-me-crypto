import styles from './buttonloading.module.css';
import cn from 'classnames';

export default function ButtonLoading({ className }: { className?: string }) {
  return (
    <div className={cn(styles.squareHolder)}>
      <div className={cn(styles.square, { [className]: className })}></div>
    </div>
  );
}
