import { Typography } from 'antd';
import { FC } from 'react';
import { Container } from '../../../ui';
import { FeatureCard, FeatureCardProps } from '../../../common';
import { PiCardsThreeFill } from 'react-icons/pi';
import { CiCircleList } from 'react-icons/ci';
import { FaVolumeHigh } from 'react-icons/fa6';
import { IoLogoGameControllerB } from 'react-icons/io';

const features: FeatureCardProps[] = [
  {
    title: 'Flashcards with Images',
    text: 'Learn faster with visual aids for each word.',
    icon: <PiCardsThreeFill size={60} />,
  },
  {
    title: 'Personalized Word Lists',
    text: 'Create custom word collections to focus on what matters to you.',
    icon: <CiCircleList size={60} />,
  },
  {
    title: 'Pronunciation Help',
    text: 'Listen to native speakers pronounce each word.',
    icon: <FaVolumeHigh size={60} />,
  },
  {
    title: 'Gamified Learning',
    text: 'Earn badges and rewards as you learn new words.',
    icon: <IoLogoGameControllerB size={60} />,
  },
];

export const KeyFeatures: FC = () => {
  return (
    <div className='bg-slate-100 py-12'>
      <Container>
        <Typography.Title level={2} className='text-center uppercase text-white'>
          Key Features
        </Typography.Title>
        <div className='mt-8 grid gap-4 md:grid-cols-4'>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} className='border-0 bg-transparent' />
          ))}
        </div>
      </Container>
    </div>
  );
};
