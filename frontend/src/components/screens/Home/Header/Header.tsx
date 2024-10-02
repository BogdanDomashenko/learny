import { FC } from 'react';
import { Navbar } from './Navbar';
import { GradualSpacing } from '../../../ui';
import { Typography } from 'antd';

export const Header: FC = () => {
  return (
    <div>
      <section className='h-svh w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600'>
        <Navbar />
        <div className='container py-12 md:py-24 lg:py-32 xl:py-48'>
          <GradualSpacing
            text='Master English Vocabulary Effortlessly!'
            textClassName='text-primary-950 text-6xl font-bold '
          />
          <Typography className='text-2xl'>
            Expand your vocabulary with fun, interactive flashcards designed to boost your English
            proficiency in no time.
          </Typography>
        </div>
      </section>
    </div>
  );
};
