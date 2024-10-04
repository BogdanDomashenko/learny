import { FC } from 'react';
import { Navbar } from './Navbar';
import { Container, GradualSpacing } from '../../../ui';
import { Typography } from 'antd';
import { BsChevronDoubleDown } from 'react-icons/bs';

export const Header: FC = () => {
  return (
    <div>
      <header className='relative h-svh w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600'>
        <Navbar />
        <Container>
          <div className='absolute top-[45%] -translate-y-1/2 transform'>
            <GradualSpacing
              text='Master English Vocabulary Effortlessly!'
              textClassName='text-white text-4xl lg:text-6xl font-bold'
            />
            <Typography className='text-2xl text-white'>
              Expand your vocabulary with fun, interactive flashcards designed to boost your English
              proficiency in no time.
            </Typography>
          </div>
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 transform'>
            <BsChevronDoubleDown className='animate-bounce text-4xl text-white opacity-30' />
          </div>
        </Container>
      </header>
    </div>
  );
};
