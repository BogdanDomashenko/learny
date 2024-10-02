import { cx } from 'class-variance-authority';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { FC, useRef } from 'react';

export interface GradualSpacingProps {
  text: string;
  textClassName?: string;
}

export const GradualSpacing: FC<GradualSpacingProps> = ({
  text = 'Gradual Spacing',
  textClassName,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div className='flex space-x-1'>
      <AnimatePresence>
        {text.split('').map((char, i) => (
          <motion.p
            ref={ref}
            key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            exit='hidden'
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={cx('tracking-tighter', textClassName)}
          >
            {char === ' ' ? <span>&nbsp;</span> : char}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
};
