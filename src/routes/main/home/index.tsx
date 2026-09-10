import React from 'react';

import HeroSec from '@/components/home/HeroSec';
import SectionTwo from '@/components/home/SectionTwo';
import SectionThree from '@/components/home/SectionThree';
import SectionFive from '@/components/home/ArticleSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSec />
      <SectionTwo />
      <SectionThree />
       <SectionFive />
    
    </>
  );
};

export default HomePage;