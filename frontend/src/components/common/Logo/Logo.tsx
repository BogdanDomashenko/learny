import { cva, cx, VariantProps } from 'class-variance-authority';
import { FC } from 'react';

const logo = cva('logo', {
  variants: {
    intent: {
      primary: 'text-primary-400',
    },
    size: {
      small: 'text-xl',
      medium: 'text-3xl',
      large: 'text-6xl',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export interface LogoProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof logo> {}

export const Logo: FC<LogoProps> = ({ intent, size, className }) => {
  return (
    <h1 className={cx('font-sans font-extrabold uppercase', logo({ intent, size }), className)}>
      Learny
    </h1>
  );
};
