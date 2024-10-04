import { FC } from 'react';
import { Container } from '../../../ui';
import { Typography } from 'antd';
import { FeatureCard, FeatureCardProps } from '../../../common';
import { GiOpenBook } from 'react-icons/gi';
import { GiProgression } from 'react-icons/gi';
import { BsCardChecklist } from 'react-icons/bs';

const features: FeatureCardProps[] = [
  {
    title: 'Browse Word Cards',
    text: 'Our library includes thousands of words tailored to your level, with definitions, pronunciations, and example sentences.',
    icon: <GiOpenBook size={60} />,
  },
  {
    title: 'Track Your Progress',
    text: 'Mark words as mastered or review them again. See your progress in real-time with daily and weekly reports.',
    icon: <GiProgression size={60} />,
  },
  {
    title: 'Test Your Knowledge',
    text: 'Take quizzes and review challenging words to solidify your learning.',
    icon: <BsCardChecklist size={60} />,
  },
];

export const HowItWorks: FC = () => {
  return (
    <section className='py-12'>
      <Container>
        <Typography.Title level={2} className='text-center uppercase'>
          How It Works
        </Typography.Title>
        <div className='mt-8 grid gap-4 md:grid-cols-3'>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
};
