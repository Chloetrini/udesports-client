import React from 'react';
import { useGetHeadlines } from '@/hooks/useApi';
import negotiationsIcon from '@/assets/negotiation.png'
import announcementIcon from '@/assets/announcementIcon.png'
import transferIcon from '@/assets/transfer.png'
import academyIcon from '@/assets/academy.png'

const UpdateBar: React.FC = () => {
  const { data: headlines, isLoading, error } = useGetHeadlines();

  // Loading: keep the bar's height and colour, show shimmer placeholder items
  if (isLoading) {
    return (
      <div className="w-full bg-[#00D46A] h-15 flex items-center overflow-hidden border-b border-[#00D46A] relative">
        <div className="container mx-auto w-11/12 px-4 sm:px-6 relative">
          <div className="flex items-center gap-8 md:gap-12 lg:gap-16">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                <div className="h-3.5 w-20 rounded bg-black/15 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-black/15 animate-pulse" />
                <div className="h-3.5 w-40 rounded bg-white/30 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error: keep the bar, show a compact inline message with an icon
  if (error || !headlines) {
    return (
      null
      // <div className="w-full bg-[#00D46A] h-15 flex items-center overflow-hidden border-b border-[#00D46A] relative">
      //   <div className="container mx-auto w-11/12 px-4 sm:px-6 flex items-center gap-2">
      //     <svg
      //       xmlns="http://www.w3.org/2000/svg"
      //       width="16"
      //       height="16"
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       stroke="#000000"
      //       strokeWidth="2"
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //       aria-hidden="true"
      //     >
      //       <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      //       <line x1="12" y1="9" x2="12" y2="13" />
      //       <line x1="12" y1="17" x2="12.01" y2="17" />
      //     </svg>
      //     <span className="text-[#000000] font-manrope font-bold text-sm">
      //       Latest headlines are unavailable right now.
      //     </span>
      //   </div>
      // </div>
    );
  }

  const duplicatedItems = [...headlines, ...headlines, ...headlines];

  return (
    <div className="w-full bg-[#00D46A] h-15 flex items-center overflow-hidden border-b border-[#00D46A] relative transition-all duration-300 ease-in-out">
      <div className="container mx-auto w-11/12 px-4 sm:px-6 relative">
        <div className="overflow-visible">
          <div
            className="flex items-center gap-8 md:gap-12 lg:gap-16 animate-scroll"
            style={{
              animation: 'scroll 80s linear infinite',
              width: 'max-content',
            }}
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <span className="text-[#000000] font-manrope font-bold text-sm uppercase tracking-wider">
                  {item.category}
                </span>
                <img
                  src={
                    item.category === "negotiation"
                      ? negotiationsIcon
                      : item.category === "transfer"
                        ? transferIcon
                        : item.category === "academy"
                          ? academyIcon
                          : announcementIcon
                  }
                  alt={item.category}
                  className="w-4 h-4"
                />
                <span className="text-white font-manrope font-regular text-sm">
                  {item.headline}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default UpdateBar;