import { ReactNode } from 'react';
import styles from './contentwrapper.module.css';
import cn from 'classnames';

export interface IContentWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function ContentWrapper(props: IContentWrapperProps) {
  return (
    <div
      className={cn(styles.contentWrapper, {
        [props.className]: props.className,
      })}
    >
      {props.children}
    </div>
  );
}
