import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import arrow1 from '@/assets/arrow1.png';
import silhouette from '@/assets/silhouette.png';
import { useGetPlayers } from '@/hooks/useApi';
import type { Player } from '@/types/dataTypes';
import { getAge } from '@/hooks/getAge';
import { STATUS_LABEL } from '@/lib/playerStatus';
import { Award } from 'lucide-react';
import ClubBadge from '@/components/player-information/ClubBadge';
import PlayerImage from '@/components/player-information/PlayerImage';
import PageWrapper from '../page-wrapper';


const SectionTwo = () => {
  const navigate = useNavigate();
  const { data: players, isLoading, error } = useGetPlayers();

  const handleViewPlayers = () => {
    navigate('/players');
  };

  const featuredPlayers = players?.filter((player: Player) => player.isFeatured);

  // Static left column, reused in every state so the layout never collapses
  const LeftSide = (
    <div className="flex-1 flex flex-col justify-start items-start gap-10">
      <div className="bg-[#00D46A4D] flex flex-row justify-center items-center gap-2 rounded-3xl py-2 px-2 w-fit">
        <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
        <p className="font-manrope font-bold text-[#00A553] text-[13px] leading-[130%] tracking-normal">
          Our Stars
        </p>
      </div>
      <div className="flex flex-col justify-start items-start gap-14 lg:w-[400px]">
        <h2 className="font-bebas font-semibold text-[#060A0F] dark:text-white text-[clamp(52px,5vw,64px)] leading-0 tracking-normal">
          FEATURED PLAYERS
        </h2>
        <p className="font-manrope font-bold text-[#8E8E8E] dark:text-gray-400 text-[clamp(14px,2vw,18px)] leading-6.75 tracking-normal max-w-125">
          Every player on this roster has been developed, tested, and proven.
          These are not prospects. These are professionals in the making.
        </p>
      </div>
      <button
        className="flex justify-start items-center gap-2 border-[#FFFFFF] rounded-xl py-2 px-2 border-s hover:border-[#00A553] hover:border cursor-pointer"
        type="button"
        onClick={handleViewPlayers}
      >
        <p className="font-manrope font-normal text-[#68717D] dark:text-gray-300 text-[14px] leading-5.25 tracking-normal">
          View all Players
        </p>
        <img className="w-[17.86px] h-[17.86px] dark:invert" src={arrow1} alt="" />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="my-14">
        <PageWrapper className="p-[20px] flex flex-col lg:flex-row items-start gap-8">
          {LeftSide}
          {/* Player card skeletons mirroring the carousel row */}
          <div className="w-full min-w-0 lg:max-w-[1123px] lg:mr-[calc((100vw-100%)/-2)]">
            <div className="flex pl-4 md:pl-6 lg:pl-8 gap-4 md:gap-6 lg:gap-10.75 overflow-hidden" style={{ minHeight: '340px' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-[358px] h-[318px] md:w-[384px] md:h-[340px] lg:w-[490px] lg:h-[430px] flex gap-2 flex-shrink-0"
                >
                  {/* main card */}
                  <div className="h-full w-[317px] md:w-[340px] lg:w-[399px] rounded-[10px] bg-gray-200 animate-pulse relative">
                    {/* status pill placeholder */}
                    <div className="absolute top-4 left-4 md:top-3 md:left-3 lg:top-5 lg:left-5 w-24 h-7 rounded-[99px] bg-gray-300 animate-pulse" />
                    {/* bottom info panel placeholder */}
                    <div className="absolute bottom-0 left-0 w-full h-[177px] md:h-[190px] lg:h-[222px] rounded-b-[10px] bg-gray-300/70 animate-pulse" />
                  </div>
                  {/* right stats column */}
                  <div className="h-full w-[97px] md:w-[104px] lg:w-[122px] rounded-r-3xl flex flex-col justify-between gap-2">
                    <div className="w-full h-[88px] lg:h-[134px] rounded-tr-2xl bg-gray-200 animate-pulse" />
                    <div className="w-full flex-1 bg-gray-200 animate-pulse rounded" />
                    <div className="w-[67px] h-[152px] lg:w-[101px] lg:h-[229px] rounded-br-2xl bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  if (error || !players) {
    return (
      <div className="my-14">
        <PageWrapper className="p-[20px] flex flex-col lg:flex-row items-start gap-8">
          {LeftSide}
          <div className="w-full min-w-0 flex items-center justify-center" style={{ minHeight: '340px' }}>
            <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl w-full max-w-xl">
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
                  We couldn't load players
                </p>
                <p className="font-manrope font-normal text-[#68717D] text-sm max-w-sm">
                  Something went wrong fetching the featured roster. Check your connection and try again.
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
        </PageWrapper>
      </div>
    );
  }

  // No players have been marked "Featured" in the admin yet — show a
  // friendly placeholder instead of leaving the carousel area blank.
  if (!featuredPlayers || featuredPlayers.length === 0) {
    return (
      <div className="my-14">
        <PageWrapper className="p-[20px] flex flex-col lg:flex-row items-start gap-8">
          {LeftSide}
          <div className="w-full min-w-0 flex items-center justify-center" style={{ minHeight: '340px' }}>
            <div className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6 border border-dashed border-gray-300 dark:border-white/15 rounded-2xl w-full max-w-xl">
              <p className="font-manrope font-bold text-[#060A0F] dark:text-white text-lg">
                No featured players yet
              </p>
              <p className="font-manrope font-normal text-[#68717D] dark:text-gray-400 text-sm max-w-sm">
                Mark a player as "Featured" from the admin panel to have them show up here.
              </p>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="my-14">
      {/* container holds the left content; carousel sits outside its right padding so it can bleed */}
      <PageWrapper className="p-[20px] flex flex-col lg:flex-row items-start gap-8">
        {/* LEFT SIDE */}
        {LeftSide}

        {/* RIGHT SIDE: bleeds to the right edge of the viewport.
            On mobile it's full width in the column; from lg up it breaks out of the
            container's right padding using calc + a negative right margin. */}
        <div className="w-full min-w-0 lg:max-w-[1123px] lg:mr-[calc((100vw-100%)/-2)]">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[
              AutoScroll({
                speed: 1,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent
              className="ml-0 pl-4 md:pl-6 lg:pl-8 gap-4 md:gap-6 lg:gap-10.75"
              style={{ minHeight: '340px' }}
            >
              {featuredPlayers?.map((result: Player) => (
                <CarouselItem key={result.id} className="basis-auto pl-0 "
                  onClick={() => {
                    navigate('/players', {
                      state: { playerId: result.id }
                    });
                  }}>
                  <div className="w-[358px] h-[318px] md:w-[384px] md:h-[340px] lg:w-[490px] lg:h-[430px] flex gap-2 cursor-pointer relative  transition-transform duration-200 ease-out
    hover:scale-[0.97]">
                    <div className="flex flex-row-reverse items-center gap-[8px] px-[13px] py-[6px] rounded-[99px] font-manrope text-[13px] lg:text-[16px] font-bold absolute top-4 left-4 md:top-3 md:left-3 lg:top-5 lg:left-5 bg-[#155535] text-[#00D46A]">
                      {result?.status && STATUS_LABEL[result.status]}
                      <div className="w-[11px] h-[11px] lg:w-[14px] lg:h-[14px] rounded-full bg-[#00D46A]"></div>
                    </div>

                    <div className="h-full w-[317px] md:w-[340px] lg:w-[399px] rounded-[10px] bg-[url(./assets/playerCard.png)] bg-cover relative overflow-hidden">
                      {/* photo - fills the whole card, anchored to the top
                          (object-top) so the head sits high on the card
                          instead of being pushed down toward the panel. */}
                      <PlayerImage
                        src={result.playerPhoto ? result.playerPhoto : silhouette}
                        alt=""
                        className="absolute inset-0 z-10 w-full h-full object-cover object-top"
                        skeletonClassName="absolute inset-0 z-10 w-full h-full"
                        width={800}
                      />

                      {/* gradient - overlays only the lower portion of the photo (shoulder height) */}
                      <div className="absolute bottom-0 left-0 z-20 w-full h-[177px] md:h-[190px] lg:h-[222px] bg-gradient-to-b from-transparent to-[#00D46A] rounded-b-[10px]" />

                      {/* text content - sits on top of the gradient, over the shoulders rather than the face */}
                      <div className="absolute bottom-0 left-0 z-30 w-full h-[177px] md:h-[190px] lg:h-[222px] flex flex-col items-center justify-center gap-2 lg:gap-3">
                        <div className="px-[11px] lg:px-[14px] bg-[#00D46A] mt-12 lg:mt-11">
                          <p className="font-bebas font-normal text-[24px] lg:text-[30px]">{result.playerName}</p>
                        </div>

                        <div className="flex gap-6 lg:gap-7 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-[14px] lg:text-[15px] font-medium text-[#FFFFFF]">Age</p>
                            <p className="text-[24px] lg:text-[30px] font-bold text-[#FFFFFF]">{getAge(result.DOB)}</p>
                          </div>

                          <div className="flex flex-col items-center justify-center">
                            <p className="text-[14px] lg:text-[15px] font-medium text-[#FFFFFF]">Position</p>
                            <p className="text-[24px] lg:text-[30px] font-bold text-[#FFFFFF]">{result.position}</p>
                          </div>

                          <div className="flex flex-col items-center justify-center">
                            <p className="text-[14px] lg:text-[15px] font-medium text-[#FFFFFF]">{'Height (cm)'}</p>
                            <p className="text-[24px] lg:text-[30px] font-bold text-[#FFFFFF]">{result.height}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-full w-[97px] md:w-[104px] lg:w-[122px] rounded-r-3xl overflow-hidden flex flex-col justify-between">
                      {/* G/A (outfield) or Saves/Clean Sheets (goalkeeper) — optional
                          stat, only shown once an admin has actually recorded one */}
                      {result.position === "GK" ? (
                        (result.saves + result.cleanSheets) > 0 && (
                          <div className="bg-[#00D46A] w-full h-[88px] lg:h-[134px] flex flex-col justify-center items-center">
                            <span className="font-manrope font-bold text-[15px] lg:text-[19px] leading-[100%]">SV/CS</span>
                            <span className="font-wdxl-lubrifont-sc font-normal text-[56px] lg:text-[60px] leading-[100%]">{result.saves + result.cleanSheets}</span>
                          </div>
                        )
                      ) : (
                        (result.goals + result.assists) > 0 && (
                          <div className="bg-[#00D46A] w-full h-[88px] lg:h-[134px] flex flex-col justify-center items-center">
                            <span className="font-manrope font-bold text-[15px] lg:text-[19px] leading-[100%]">G/A</span>
                            <span className="font-wdxl-lubrifont-sc font-normal text-[56px] lg:text-[60px] leading-[100%]">{result.goals + result.assists}</span>
                          </div>
                        )
                      )}

                      {/* APP. — optional, only shown once an admin has recorded an appearance count.
                          Free-text field (can hold "382+"), so check against "0"/blank rather than a numeric > 0. */}
                      {result.playerAppearance && result.playerAppearance !== "0" && (
                        <div className="w-full justify-center items-center flex flex-col">
                          <span className="font-manrope font-bold text-[15px] lg:text-[19px] leading-[100%]">APP.</span>
                          <span className="font-wdxl-lubrifont-sc font-normal text-[56px] lg:text-[60px] leading-[100%]">{result.playerAppearance}</span>
                        </div>
                      )}

                      {/* current club — always rendered so every card is the same
                          height; shows a "Retired" badge for a retired player, a
                          previous → current transfer stack when a previous club
                          is on record, or just the current club logo otherwise. */}
                      <div className="bg-[url(./assets/bgEffect.png)] bg-contain bg-[#00D46A] w-[67px] h-[152px] lg:w-[101px] lg:h-[229px] flex justify-center items-end pb-5">
                        {result.status === "RETIRED" ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-[34px] h-[34px] lg:w-[46px] lg:h-[46px] rounded-full bg-white/15 border border-white/30 flex items-center justify-center">
                              <Award className="w-[18px] h-[18px] lg:w-[24px] lg:h-[24px] text-white" strokeWidth={2} />
                            </div>
                            <span className="font-manrope font-bold text-[10px] lg:text-[12px] text-white text-center leading-none tracking-wide">
                              RETIRED
                            </span>
                          </div>
                        ) : (
                          <ClubBadge
                            previousClubName={result.previousClubName}
                            previousClubLogo={result.previousClubLogo}
                            currentClubName={result.currentClubName}
                            currentClubLogo={result.currentClubLogo}
                            size="md"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </PageWrapper>
    </div>
  );
};

export default SectionTwo;




