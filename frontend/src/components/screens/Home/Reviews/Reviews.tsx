import { FC } from 'react';
import { Container } from '../../../ui';
import { Typography } from 'antd';
import { ReviewCard } from './ReviewCard';
import customer1 from '../../../../assets/images/customer-1.jpg';
import customer2 from '../../../../assets/images/customer-2.jpg';
import customer3 from '../../../../assets/images/customer-3.jpg';
import customer4 from '../../../../assets/images/customer-4.jpg';

const reviews = [
  {
    imgSrc: customer1,
    text: 'I love this app! It has helped me improve my vocabulary in just a few weeks.',
  },
  {
    imgSrc: customer2,
    text: 'I can’t believe how much my vocabulary has improved. I highly recommend this app!',
  },
  {
    imgSrc: customer3,
    text: 'I love the quizzes. They are challenging and fun. I learn something new every time.',
  },
  {
    imgSrc: customer4,
    text: 'I’ve tried other vocabulary apps, but this one is by far the best. I love the daily reports.',
  },
];

export const Reviews: FC = () => {
  return (
    <section className='py-10'>
      <Container>
        <Typography.Title level={2} className='text-center uppercase'>
          What Our Users Are Saying
        </Typography.Title>
        <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </Container>
    </section>
  );
};
