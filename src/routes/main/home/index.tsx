import React from 'react';

import HeroSec from '@/components/home/HeroSec';
import SectionTwo from '@/components/home/SectionTwo';
import SectionThree from '@/components/home/SectionThree';
import SectionFive from '@/components/home/ArticleSection';

const HomePage: React.FC = () => {
  return (
    <div className="dark:bg-[#0B0F14] transition-colors duration-300">
      <HeroSec />
      <SectionTwo />
      <SectionThree />
      <SectionFive />
    </div>
  );
};

export default HomePage;
