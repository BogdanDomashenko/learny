import { cx } from 'class-variance-authority';
import { FC } from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container: FC<ContainerProps> = ({ className, ...rest }) => {
  return <div className={cx('container px-4', className)} {...rest} />;
};
