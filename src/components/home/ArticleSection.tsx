import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetNewsArticles } from '@/hooks/useApi';
import arrow1 from '@/assets/arrow1.png';
import type { NewsArticle, NewsCategory } from '@/types/dataTypes';
import noAuthorPhoto from '@/assets/no profile photo.jpg'
import news from '@/assets/news.jpeg'
import { estimateReadTime, formatDate } from '@/lib/utils';
import PageWrapper from '../page-wrapper';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';

// There's no "subtitle" field on the backend — the badge shows the article's
// real category instead.
const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TRANSFER: 'Transfer',
  ACADEMY: 'Academy',
  ANNOUNCEMENT: 'Announcement',
};


const SectionFive: React.FC = () => {
  const navigate = useNavigate();
  const { data: articles, isLoading, error } = useGetNewsArticles();

  const handleAllNews = () => {
    navigate('/news');
  };

  // Shared header so the section keeps its shape in every state
  const Header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-10">
      <div className="flex flex-col items-start">
        <div className="bg-[#00D46A4D] flex flex-row justify-center items-center gap-2 rounded-3xl py-2 px-2 w-fit">
          <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
          <p className="font-manrope font-bold text-[#00A553] text-[13px] leading-[130%] tracking-normal">
            Latest
          </p>
        </div>
        <div>
          <h2 className="font-bebas font-regular text-[#060A0F] dark:text-white text-[clamp(48px,5vw,64px)] max-w-full">
            NEWS & UPDATE
          </h2>
        </div>
      </div>
      <div className='hover:border-[#00A553] hover:text-[#00A553] hover:underline transition-colors'>
        <button
          onClick={handleAllNews}
          className="
              font-manrope font-normal text-[14px] text-[#68717D]
              flex flex-row items-center justify-center gap-2
              bg-transparent border border-transparent rounded-2xl
              py-2 px-2
              cursor-pointer
              transition-colors
              hover:text-[#00A553]
            "
          style={{ lineHeight: '21px' }}
        >
          All News
          <img className="dark:invert" src={arrow1} alt="arrow" />
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <PageWrapper className=" p-[20px]">
        {Header}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col h-full"
            >
              {/* cover image */}
              <div className="w-full h-48 md:h-56 bg-gray-200 animate-pulse" />
              <div className="p-4 md:p-6 flex flex-col flex-1">
                {/* subtitle pill */}
                <div className="h-8 w-28 rounded-4xl bg-gray-200 animate-pulse mb-3" />
                {/* headline (2 lines) */}
                <div className="min-h-[3rem] mb-3 space-y-2">
                  <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                </div>
                {/* excerpt (3 lines) */}
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-gray-200 animate-pulse" />
                </div>
                <hr className="border-t border-[#E5E7EB] my-4 mt-auto" />
                {/* author row */}
                <div className="flex flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-15 md:h-15 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex flex-col items-start gap-2">
                      <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
                      <div className="h-2.5 w-32 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    );
  }

  if (error || !articles) {
    return (
      <div className="container mx-auto w-11/12 py-12">
        {Header}
        <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl">
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
              We couldn't load the news
            </p>
            <p className="font-manrope font-normal text-[#68717D] text-sm max-w-sm">
              Something went wrong fetching the latest articles. Check your connection and try again.
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
    );
  }

  const topArticles = articles.slice(0, 3);

  return (
    <div className="mb-11">
      <PageWrapper className="p-[20px]">
        {/* Header */}
        {Header}
      </PageWrapper>

      {/* Article Cards — same auto-scrolling embla carousel as the home
          page's Featured Players and Instagram Archive sections: loops
          through the real article list (no duplicated cards), pauses on
          hover. Previously this carousel lived directly inside PageWrapper
          (a "container mx-auto" with its own max-width) and only canceled
          its own local padding with -mx-5/px-5 — it never actually broke out
          of that max-width the way the other two carousels do, so on wider
          screens it stayed boxed in with visible padding on the right
          instead of bleeding to the viewport edge like Instagram Archive
          and Featured Players. Moving it outside PageWrapper and using the
          same lg:mr-[calc((100vw-100%)/-2)] breakout, with the same
          pl-[20px] / lg:pl-[calc((100vw-1280px)/2+20px)] content padding
          Instagram Archive uses, makes it match exactly. */}
      <div className="w-full lg:mr-[calc((100vw-100%)/-2)]">
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]}
          className="w-full"
        >
          <CarouselContent className="ml-0 pl-[20px] lg:pl-[calc((100vw-1280px)/2+20px)] gap-6 md:gap-8 mb-5">
            {topArticles.map((article: NewsArticle) => (
              <CarouselItem key={article.id} className="basis-auto pl-0">
                <div
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/news/${article.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/news/${article.id}`);
                    }
                  }}
                  className="w-[320px] md:w-[380px] bg-white dark:bg-[#111820] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full cursor-pointer"
                >
                  <img
                    src={article.coverImage ? article.coverImage : news}
                    alt={article.headline}
                    className="w-full h-48 md:h-56 object-cover flex-shrink-0"
                  />
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <div className='bg-[#fae1bc] flex flex-row justify-start items-center rounded-4xl gap-2 py-2 px-4 mb-3 w-fit'>
                      <span className='bg-[#D47F00] w-2 h-2 rounded-full flex-shrink-0'></span>
                      <h5 className="font-manrope font-bold text-[#D47F00] text-[clamp(14px,1.5vw,16px)] leading-tight">
                        {CATEGORY_LABEL[article.category]}
                      </h5>
                    </div>
                    <p className="font-manrope font-bold text-[#1A1A1A] dark:text-white text-[clamp(18px,2.5vw,20px)] leading-6 mb-3 line-clamp-2 min-h-[3rem]">
                      {article.headline}
                    </p>
                    <p className="font-manrope font-normal text-[#68717D] dark:text-gray-400 text-sm leading-[180%] mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <hr className="border-t border-[#E5E7EB] dark:border-white/10 my-4 mt-auto" />
                    <div className="flex flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          className='w-10 h-10 md:w-15 md:h-15 rounded-full'
                          src={noAuthorPhoto} alt={article.author.name}
                        />
                        <div className='flex flex-col items-start gap-1'>
                          <p className="font-manrope font-bold text-[#060A0F] dark:text-white text-sm">
                            {article.author.name}
                          </p>
                          <p className="font-manrope font-normal text-[#8E8E8E] dark:text-gray-500 text-xs">
                            {formatDate(article.createdAt)} • {estimateReadTime(article.body)} read
                          </p>
                        </div>
                      </div>
                      <span className="font-manrope font-bold text-[#00A553] text-sm inline-block whitespace-nowrap">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default SectionFive;
