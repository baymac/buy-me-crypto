import { ReactNode } from 'react';
import cn from 'classnames';
import styles from './contentwrapper.module.css';

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
