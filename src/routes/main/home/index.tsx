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
      <div className='mb-20 md:mb-30 lg:mb-50'>
        <SectionFive />
      </div>
    </>
  );
};

export default HomePage;