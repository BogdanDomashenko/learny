import { FC } from 'react';
import { Container } from '../../../ui';
import { Typography } from 'antd';

export const Footer: FC = () => {
  return (
    <footer className='border-t py-4'>
      <Container className='flex justify-center'>
        <Typography.Text className='block text-center text-slate-500'>
          © {new Date().getFullYear()} Learny. All rights reserved
        </Typography.Text>
      </Container>
    </footer>
  );
};
