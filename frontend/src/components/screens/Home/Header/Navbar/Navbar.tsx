import { FC } from 'react';
import { Logo } from '../../../../common';
import { Button } from 'antd';

export const Navbar: FC = () => {
  return (
    <nav className='py-4'>
      <div className='container flex items-center justify-between'>
        <Logo className='text-white' />
        <Button type='primary' size='large'>
          Get Started
        </Button>
      </div>
    </nav>
  );
};
