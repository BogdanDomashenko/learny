import { FC } from 'react';
import { Container } from '../../../ui';
import { Typography } from 'antd';

export const ChoseYourPlan: FC = () => {
  return (
    <section>
      <Container>
        <Typography.Title level={2} className='text-center uppercase'>
          Choose Your Plan
        </Typography.Title>
      </Container>
    </section>
  );
};
