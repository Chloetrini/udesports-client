import type { NewsArticle, NewsCategory } from '@/types/dataTypes';
import Ellipse from "@/assets/Ellipse 44.png"
import QuickUpdates from '@/components/QuickUpdates';
// import FuturePlayer from "../../assets/FuturePlayer.png"
import { Link } from 'react-router';
import { useGetNewsArticles } from '@/hooks/useApi';
import news from '@/assets/news.jpeg'
import noAuthorPhoto from '@/assets/no profile photo.jpg'
import { estimateReadTime } from '@/lib/utils';
import PageWrapper from '@/components/page-wrapper';


const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TRANSFER: 'Transferred',
  ACADEMY: 'Academy News',
  ANNOUNCEMENT: 'Announcement',
};

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  TRANSFER: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full',
  ACADEMY: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full',
  ANNOUNCEMENT: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full',
};

// Add near ArticleCard, in the same file
function ArticleCardSkeleton({ variant }: { variant: 'featured' | 'grid' }) {
  return (
    <div className={`${variant === 'featured' ? 'article-card--featured' : 'article-card--grid'} font-manrope py-6 md:py-8 lg:py-10 flex flex-col gap-2`}>
      <div className={`w-full ${variant === 'featured' ? 'aspect-[16/7]' : 'aspect-[16/9]'} rounded-md bg-[#e9e9e9] dark:bg-white/10 animate-pulse`} />
      <div className="h-6 w-36 rounded-full bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
      <div className="h-5 w-4/5 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
      <div className="flex flex-col gap-1.5">
        <div className="h-3.5 w-full rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
        <div className="h-3.5 w-3/4 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 md:h-14 md:w-14 lg:h-15 lg:w-15 rounded-full bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-24 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
            <div className="h-3 w-32 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="h-3.5 w-20 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

export function ArticleCard({ article, variant }: { article: NewsArticle; variant: 'featured' | 'grid' }) {
  return (
    <article className={`${variant === 'featured' ? 'article-card--featured' : 'article-card--grid'} font-manrope py-6 md:py-8 lg:py-10 flex flex-col gap-2 hover:scale-105 transition-transform`}>
      <Link to={`/news/${article.id}`}>
        <img className='h-full w-full' src={article.coverImage ? article.coverImage : news} alt={article.headline} loading="lazy" />
      </Link>
      <span className={`pill ${CATEGORY_STYLE[article.category]} w-36 text-center font-bold py-1`}>
        • {CATEGORY_LABEL[article.category]}
      </span>
      <Link to={`/news/${article.id}`}>
        <h3 className='font-bold text-[17px] md:text-[18px] lg:text-[20px] text-[#1A1A1A] dark:text-white hover:text-[#00A553] dark:hover:text-[#00A553] transition-colors'>{article.headline}</h3>
      </Link>
      <p className='text-[14px] md:text-[15px] lg:text-[15px] text-[#464646] dark:text-gray-400'>{article.summary}</p>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img src={noAuthorPhoto} alt={article.author.name} className="h-12 w-12 md:h-14 md:w-14 lg:h-15 lg:w-15 rounded-full" />
          <div className='flex flex-col'>
            <span className='text-[14px] md:text-[15px] lg:text-[15px] text-[#1A1A1A] dark:text-white font-medium'>{article.author.name}</span>
            <time className='text-[13px] md:text-[14px] lg:text-[14px] text-[#959595] dark:text-gray-500' dateTime={article.createdAt}>
              {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
                new Date(article.createdAt)
              )} • {estimateReadTime(article.body)} read
            </time>
          </div>
        </div>
        <Link className='text-[#382E53] dark:text-gray-300 hover:text-[#00A553] dark:hover:text-[#00A553] hover:underline transition-all' to={`/news/${article.id}`}>Read more »</Link>
      </div>
    </article>
  );
}


const News = () => {
  const {
    data: articles,
    isLoading,
    isError,
  } = useGetNewsArticles();

  if (isError) return <p className="dark:text-white">Something went wrong loading news.</p>;

  // The public endpoint only ever returns published articles, so no extra
  // filtering is needed here — just order them newest first.
  if (!isLoading && (articles ?? []).length === 0) return <p className="dark:text-white">No news yet.</p>;

  const sortedArticles = [...(articles ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [featured, ...rest] = sortedArticles;

  return (
    <PageWrapper className="p-[20px] bg-white dark:bg-black transition-colors duration-300">
      <section className=" flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className='w-full lg:w-8/12'>
          <div className='bg-[#00D46A4D] w-34 rounded-full flex justify-center items-center gap-2'>
            <img src={Ellipse} alt="Ellipse" />
            <p className='text-md text-[#00A553]'>Latest Updates</p>
          </div>
          <h1 className='font-bebas font-semibold leading-none text-[#060A0F] dark:text-white pt-2 text-[40px] md:text-[52px] lg:text-[64px]'>NEWS & TRANSFERS</h1>
          <p className='w-full lg:w-100 text-[#8E8E8E] dark:text-gray-400 font-medium'>Transfers. Trials. Academy updates. Everything moves fast, we keep you informed.</p>

          {isLoading ? (
            <>
              <ArticleCardSkeleton variant="featured" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} variant="grid" />
                ))}
              </div>
            </>
          ) : (
            <>
              <ArticleCard article={featured} variant="featured" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="grid" />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-full lg:w-3/12 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-4rem)] overflow-y-auto [scrollbar-none] [&::-webkit-scrollbar]:hidden">
          <QuickUpdates />
        </div>
      </section>
    </PageWrapper>
  );
}

export default News

