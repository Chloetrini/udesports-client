import React from 'react';

import HeroSec from '@/components/home/HeroSec';
import SectionTwo from '@/components/home/SectionTwo';
import SectionThree from '@/components/home/SectionThree';
import InstagramArchive from '@/components/home/InstagramArchive';
import SectionFive from '@/components/home/ArticleSection';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <HeroSec />
      <SectionTwo />
      <SectionThree />
      <InstagramArchive />
      <SectionFive />
    </div>
  );
};

export default HomePage;


