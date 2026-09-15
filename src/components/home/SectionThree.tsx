import React, { useState } from 'react';
import { useGetTestimonials } from '@/hooks/useApi';
import straightQuote from '@/assets/straightQuote.png'
import leftQuote from '@/assets/leftQuote.png'
import PageWrapper from '../page-wrapper';

const SectionThree: React.FC = () => {
  const { data: testimonials, isLoading, error } = useGetTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Left text column is static, so it's reused across every state
  const LeftSide = (
    <div className="flex-1 flex flex-col justify-start items-start gap-6">
      <div className="bg-[#00D46A4D] flex flex-row justify-center items-center gap-2 rounded-3xl py-2 px-2 w-fit">
        <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
        <p className="font-manrope font-bold text-[#00A553] text-[13px] leading-[130%] tracking-normal">
          Our Stars
        </p>
      </div>
      <div className="flex flex-col justify-start items-start gap-10">
        <h2 className="font-bebas font-semibold text-[#060A0F] dark:text-white text-[clamp(52px,5vw,64px)] leading-12 tracking-normal max-w-[500px]">
          WHAT CLUBS AND FAMILY SAY
        </h2>
        <p className="font-manrope font-bold text-[#8E8E8E] dark:text-gray-400 text-[clamp(14px,2vw,18px)] leading-6.75 tracking-normal uppercase max-w-[500px]">
          Every player on this roster has been developed, tested, and proven.
          These are not prospects. These are professionals in the making.
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <PageWrapper className="p-[20px]">
        <div className="flex flex-col lg:flex-row-reverse items-stretch gap-8 md:gap-20">
          {LeftSide}
          {/* Testimonial card skeleton */}
          <div className="w-full max-w-3xl mx-auto bg-[#d4f8e6] dark:bg-[#0f2e1c] rounded-3xl">
            <div className="p-6 md:p-8 lg:p-12 relative flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10">
              <div className="flex flex-col justify-start items-start gap-6 md:gap-10 flex-1">
                <div className="flex flex-col justify-start items-start gap-4 w-full">
                  {/* quote mark */}
                  <div className="w-5 h-5 rounded bg-[#b6ecd0] animate-pulse" />
                  {/* quote lines */}
                  <div className="space-y-3 w-full">
                    <div className="h-5 w-full rounded bg-[#b6ecd0] animate-pulse" />
                    <div className="h-5 w-11/12 rounded bg-[#b6ecd0] animate-pulse" />
                    <div className="h-5 w-2/3 rounded bg-[#b6ecd0] animate-pulse" />
                  </div>
                </div>
                {/* nav row */}
                <div className="flex items-center justify-start gap-4 mt-4">
                  <div className="w-8 h-8 rounded-full bg-[#b6ecd0] animate-pulse" />
                  <div className="h-10 w-24 rounded bg-[#b6ecd0] animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-[#b6ecd0] animate-pulse" />
                </div>
              </div>
              {/* author block */}
              <div className="flex flex-col items-start gap-3">
                <div className="h-7 w-40 rounded bg-[#b6ecd0] animate-pulse" />
                <div className="h-4 w-28 rounded bg-[#b6ecd0] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !testimonials) {
    return (
      <PageWrapper className="p-[20px]">
        <div className="flex flex-col lg:flex-row-reverse items-stretch gap-8 md:gap-20">
          {LeftSide}
          <div className="w-full max-w-3xl mx-auto bg-[#d4f8e6] dark:bg-[#0f2e1c] rounded-3xl">
            <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6 h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="font-manrope font-bold text-[#060A0F] text-lg mb-1">
                  We couldn't load testimonials
                </p>
                <p className="font-manrope font-normal text-[#68717D] text-sm max-w-sm">
                  Something went wrong fetching what clubs and family say. Check your connection and try again.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="font-manrope font-bold text-white text-sm bg-[#00A553] hover:bg-[#00934a] transition-colors rounded-xl py-2.5 px-5 cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // No published testimonials yet (fresh install, or all drafted) — render
  // the section without a card rather than crashing on testimonials[0].
  if (testimonials.length === 0) {
    return (
      <PageWrapper className="p-[20px]">
        <div className="flex flex-col lg:flex-row-reverse items-stretch gap-8 md:gap-20">
          {LeftSide}
          <div className="w-full max-w-3xl mx-auto bg-[#d4f8e6] dark:bg-[#0f2e1c] rounded-3xl flex items-center justify-center py-16 px-6">
            <p className="font-manrope font-normal text-[#68717D] text-sm text-center">
              Testimonials are coming soon.
            </p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const total = testimonials.length;
  const current = testimonials[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <PageWrapper className="p-[20px]">
      <div className="flex flex-col lg:flex-row-reverse items-stretch gap-8 md:gap-20">
        {/* LEFT SIDE */}
        {LeftSide}

        {/* RIGHT SIDE: Testimonial Card */}
        <div className="w-full max-w-3xl mx-auto bg-[#d4f8e6] dark:bg-[#0f2e1c] rounded-3xl">
          <div className="p-6 md:p-8 lg:p-12 relative flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10">
            <div className="flex flex-col justify-start items-start gap-6 md:gap-10 flex-1 z-20">
              <div className="flex flex-col justify-start items-start gap-4">
                <img
                  src={straightQuote}
                  alt=""
                  className="w-4.75 h-5"
                />
                <blockquote className="font-manrope font-medium text-[#060A0F] dark:text-white text-[clamp(18px,3vw,24px)] leading-relaxed text-start max-w-full">
                  "{current.quote}"
                </blockquote>
              </div>

              {/* Navigation */}
              <div className="flex-1 flex items-center justify-start gap-4 mt-4">
                <button
                  onClick={goToPrev}
                  className="text-[#202020] dark:text-white text-3xl md:text-5xl hover:text-[#00D46A] transition-colors cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  ‹
                </button>
                <div className='flex justify-center w-30'>

                <div className=''>
                <span className="font-manrope font-medium text-[#202020] dark:text-white text-[clamp(32px,5vw,56px)]">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-[#202020] dark:text-white text-base">/</span>
                <span className="font-manrope font-medium text-[#8E8E8E] text-base">
                  {String(total).padStart(2, '0')}
                </span>
                </div>
                </div>
                <button
                  onClick={goToNext}
                  className="text-[#202020] dark:text-white text-3xl md:text-5xl hover:text-[#00D46A] transition-colors cursor-pointer"
                  aria-label="Next testimonial"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Author and left quote */}
            <div className="flex flex-col justify-between items-start gap-6 md:gap-10 relative">
              <div className="flex flex-col items-start gap-2 z-10">
                <p className="font-manrope font-semibold text-[#060A0F] dark:text-white text-[clamp(22px,2vw,33px)] leading-[100%]">
                  {current.author}
                </p>
                <p className="font-manrope font-normal text-[#68717D] text-[clamp(12px,1.5vw,14px)] leading-[100%]">
                  {current.club}, {current.country}
                </p>
              </div>
            </div>
              <img
                src={leftQuote}
                alt=""
                className="w-40 md:w-20 lg:w-70 opacity-50 absolute bottom-5 right-5  md:bottom-10 md:right-10 z-0"
              />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SectionThree;

