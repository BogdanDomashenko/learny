import { FC } from 'react';
import { Card, Typography } from 'antd';

export interface ReviewCardProps {
  imgSrc: string;
  text: string;
}

export const ReviewCard: FC<ReviewCardProps> = ({ imgSrc, text }) => {
  return (
    <Card className='text-center'>
      <img src={imgSrc} alt='Customer 1' className='mx-auto h-20 w-20 rounded-full object-cover' />
      <Typography.Text className='text-slate-500'>{text}</Typography.Text>
    </Card>
  );
};
