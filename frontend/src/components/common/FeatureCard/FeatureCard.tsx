import { Card, Typography } from 'antd';
import { cx } from 'class-variance-authority';
import { FC, ReactNode } from 'react';

export interface FeatureCardProps {
  title: string;
  text: string;
  icon: ReactNode;
  className?: string;
}

export const FeatureCard: FC<FeatureCardProps> = ({ title, text, icon, className }) => {
  return (
    <Card className={cx('flex justify-center p-4 text-center', className)}>
      <div className='flex justify-center text-primary-500'>{icon}</div>
      <Typography.Title level={3} className='mt-4'>
        {title}
      </Typography.Title>
      <Typography.Text className='text-slate-500'>{text}</Typography.Text>
    </Card>
  );
};
