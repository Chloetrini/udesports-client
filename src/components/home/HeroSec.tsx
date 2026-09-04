import React from 'react';
import { useNavigate } from 'react-router-dom';
import frame from '@/assets/frame.png';

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
      <div className="container mx-auto w-11/12 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 lg:gap-12 pb-12 md:pb-20">
          {/* Left content */}
          <div className="flex-1">
            <h1 className="font-bebas font-normal text-white leading-[1.3]">
              <span className="block text-[clamp(40px,8vw,96px)]">
                <img src={frame} alt="" className="w-full max-w-125" />
              </span>
            </h1>

            <p className="font-manrope font-medium text-[#8E8E8E] text-[clamp(14px,2.5vw,18px)] leading-relaxed max-w-150 mt-6">
              From Nigeria to the world's biggest stadiums. UdeSport has placed 38+ players at elite clubs across Europe, Asia, and Africa.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-8 md:pt-14">
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
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-8 md:pt-100">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSec;