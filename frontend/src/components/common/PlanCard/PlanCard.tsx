import { Card, Typography } from 'antd';
import { FC } from 'react';

export interface PlanCardProps {
  title: string;
  price: number;
  description: string;
}

export const PlanCard: FC<PlanCardProps> = ({ title, price, description }) => {
  return (
    <Card>
      <Typography.Title level={3} className='text-center uppercase'>
        {title}
      </Typography.Title>
    </Card>
  );
};
