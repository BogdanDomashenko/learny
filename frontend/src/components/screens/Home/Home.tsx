import { FC } from 'react';
import { Header } from './Header';
import { HowItWorks } from './HowItWorks';
import { KeyFeatures } from './KeyFeatures';
import { Reviews } from './Reviews';
import { StartLearningToday } from './StartLearningToday';
import { Footer } from './Footer';

export const Home: FC = () => {
  return (
    <div>
      <Header />
      <HowItWorks />
      <KeyFeatures />
      <Reviews />
      <StartLearningToday />
      <Footer />
    </div>
  );
};
