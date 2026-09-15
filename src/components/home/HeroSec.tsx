import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import frame from '@/assets/frame.png';
import PageWrapper from '../page-wrapper';

// Staggered intro: the headline, copy, buttons, and each stat fade/slide up
// in sequence on first mount, instead of the whole hero appearing at once.
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const HeroSec: React.FC = () => {
  const navigate = useNavigate();

  const handleViewPlayers = () => {
    navigate('/players');
  };

  const handleOurStory = () => {
    navigate('/about');
  };

  return (
    <section className="bg-[url(./assets/bgMobile.png)] md:bg-[url(./assets/bgphoto.png)] bg-no-repeat bg-cover bg-center min-h-screen flex items-center py-16">
      <PageWrapper className="p-[20px]">
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center gap-8 lg:gap-12 pb-12 md:pb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left content */}
          <div className="flex-1">
            <motion.h1 variants={itemVariants} className="font-bebas font-normal text-white leading-[1.3]">
              <span className="block text-[clamp(40px,8vw,96px)]">
                <img src={frame} alt="" className="w-full max-w-125" />
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="font-manrope font-medium text-[#8E8E8E] text-[clamp(14px,2.5vw,18px)] leading-relaxed max-w-150 mt-6">
              From Nigeria to the world's biggest stadiums. UdeSport has placed 100+ players at elite clubs across Europe, Asia, and Africa.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-8 md:pt-14">
              <button
                type="button"
                onClick={handleViewPlayers}
                className="font-manrope font-normal text-[14px] text-[#68717D] bg-[#00D46A] border-t border-r border-l border-b-0 border-[#38FF9C] border-solid rounded-md px-6 py-3 h-11.25 flex items-center justify-center cursor-pointer hover:text-[#060A0F] transition-colors min-w-35"
              >
                View Players
              </button>
              <button
                type="button"
                onClick={handleOurStory}
                className="font-manrope font-normal text-[14px] text-[#68717D] bg-transparent border border-[#68717D] border-solid rounded-xl px-6 py-3 h-11.25 flex items-center justify-center cursor-pointer hover:text-[#00D46A] hover:border-[#00D46A] transition-colors min-w-30"
              >
                Our Story
              </button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 md:gap-10 pt-8 md:pt-100">
            <div className="text-center flex flex-col items-center">
              <div className="flex flex-row items-start relative">
                <p className="font-manrope font-bold text-[#FFFFFF] text-[clamp(40px,10vw,110px)] leading-none">
                  38
                </p>
                <span className="font-bebas font-regular text-[#00D46A] text-[clamp(30px,6vw,50px)] -ml-1">+</span>
              </div>
              <p className="font-manrope font-regular text-[#8E8E8E] text-[clamp(16px,2.5vw,24px)] uppercase tracking-wider mt-1">
                Transfers
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="flex flex-row items-start relative">
                <p className="font-manrope font-bold text-[#FFFFFF] text-[clamp(40px,10vw,110px)] leading-none">
                  15
                </p>
                <span className="font-bebas font-regular text-[#00D46A] text-[clamp(30px,6vw,50px)] -ml-1">+</span>
              </div>
              <p className="font-manrope font-regular text-[#8E8E8E] text-[clamp(16px,2.5vw,24px)] uppercase tracking-wider mt-1">
                Countries
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <p className="font-manrope font-bold text-[#FFFFFF] text-[clamp(40px,10vw,110px)] leading-none">
                25
              </p>
              <p className="font-manrope font-regular text-[#8E8E8E] text-[clamp(16px,2.5vw,24px)] uppercase tracking-wider mt-1">
                Years of XP
              </p>
            </div>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </section>
  );
};

export default HeroSec;