import { FC } from 'react';
import { Container } from '../../../ui';
import { Button, Typography } from 'antd';

export const StartLearningToday: FC = () => {
  return (
    <section className='bg-slate-100 py-12'>
      <Container className='flex flex-col items-center'>
        <Typography.Title level={2} className='text-center uppercase'>
          Start Learning Today
        </Typography.Title>
        <Typography.Text className='block text-center text-slate-500'>
          Sign up now and start improving your vocabulary today.
        </Typography.Text>
        <div className='mt-4'>
          <Button type='primary' size='large'>
            Get Started
          </Button>
        </div>
      </Container>
    </section>
  );
};
