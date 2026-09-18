import React from 'react';

import HeroSec from '@/components/home/HeroSec';
import SectionTwo from '@/components/home/SectionTwo';
import SectionThree from '@/components/home/SectionThree';
import InstagramArchive from '@/components/home/InstagramArchive';
import SectionFive from '@/components/home/ArticleSection';
import { Seo } from '@/components/seo';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <Seo
        title="Football Scouting, Player Management & Placement"
        description="UdeSport is Nigeria's most prolific football scouting and player placement academy — 38+ verified placements at professional clubs across Europe, Asia, and Africa."
      />
      <HeroSec />
      <SectionTwo />
      <SectionThree />
      <InstagramArchive />
      <SectionFive />
    </div>
  );
};

export default HomePage;


