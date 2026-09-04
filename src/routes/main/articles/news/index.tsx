import { useQuery } from '@tanstack/react-query';
import type { NewsArticle, NewsCategory } from '@/types/dataTypes';
import Ellipse from "@/assets/Ellipse 44.png"
// import QuickUpdates from '@/components/QuickUpdates';
// import FuturePlayer from "../../assets/FuturePlayer.png"
import { Link } from 'react-router';
import { Seo } from '@/components/SEO';
import { useGetNewsArticles } from '@/hooks/useApi';
import news from '@/assets/news.jpeg'
import noAuthorPhoto from '@/assets/no profile photo.jpg'
import { estimateReadTime } from '@/lib/utils';


const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TRANSFER: 'Transferred',
  ACADEMY: 'Academy News',
  ANNOUNCEMENT: 'Announcement',
};

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  TRANSFER: 'bg-amber-100 text-amber-700 rounded-full',
  ACADEMY: 'bg-blue-100 text-blue-700 rounded-full',
  ANNOUNCEMENT: 'bg-emerald-100 text-emerald-700 rounded-full',
};

export function ArticleCard({ article, variant }: { article: NewsArticle; variant: 'featured' | 'grid' }) {
  return (
    <article className={`${variant === 'featured' ? 'article-card--featured' : 'article-card--grid'} font-manrope py-6 md:py-8 lg:py-10 flex flex-col gap-2 hover:scale-105 transition-transform`}>
      <div>
        <img className='h-full w-full' src={article.coverImage ? article.coverImage : news} alt={article.headline} loading="lazy" />
      </div>
      <span className={`pill ${CATEGORY_STYLE[article.category]} w-36 text-center font-bold py-1`}>
        • {CATEGORY_LABEL[article.category]}
      </span>
      <h3 className='font-bold text-[17px] md:text-[18px] lg:text-[20px] text-[#1A1A1A]'>{article.headline}</h3>
      <p className='text-[14px] md:text-[15px] lg:text-[15px] text-[#464646]'>{article.excerpt}</p>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img src={article.authorPhoto ? article.authorPhoto : noAuthorPhoto} alt={article.author} className="h-12 w-12 md:h-14 md:w-14 lg:h-15 lg:w-15 rounded-full" />
          <div className='flex flex-col'>
            <span className='text-[14px] md:text-[15px] lg:text-[15px] text-[#1A1A1A] font-medium'>{article.author}</span>
            <time className='text-[13px] md:text-[14px] lg:text-[14px] text-[#959595]' dateTime={article.createdAt}>
              {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
                new Date(article.createdAt)
              )} • {estimateReadTime(article.body)} read
            </time>
          </div>
        </div>
        <Link className='text-[#382E53] hover:text-[#00A553] hover:underline transition-all' to={`/news/${article.id}`}>Read more »</Link>
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

  if (isLoading) return <p>Loading news…</p>;
  if (isError) return <p>Something went wrong loading news.</p>;

  // Only published articles show on the public site.
  const publishedArticles = (articles ?? []).filter((article) => article.published);

  if (publishedArticles.length === 0) return <p>No news yet.</p>;

  const sortedArticles = [...publishedArticles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [featured, ...rest] = sortedArticles;

  return (
    <div className='mx-auto container'>
      <Seo
        title="News & Transfers"
        description="Transfer updates, trials, and academy news from UdeSport."
      />
      <section className="mx-auto container px-6 md:px-8 lg:px-8 py-5 flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className='w-full lg:w-8/12'>
          <div className='bg-[#00D46A4D] w-34 rounded-full flex justify-center items-center gap-2'>
            <img src={Ellipse} alt="Ellipse" />
            <p className='text-md'>Latest Updates</p>
          </div>
          <h1 className='font-bebas font-semibold leading-none text-[#060A0F] pt-2 text-[40px] md:text-[52px] lg:text-[64px]'>NEWS & TRANSFERS</h1>
          <p className='w-full lg:w-100 text-[#8E8E8E] font-medium'>Transfers. Trials. Academy updates. Everything moves fast, we keep you informed.</p>

          <ArticleCard article={featured} variant="featured" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} variant="grid" />
            ))}
          </div>
        </div>


        <div className="w-full lg:w-3/12 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-4rem)] overflow-y-auto [scrollbar-none] [&::-webkit-scrollbar]:hidden">
          {/* <QuickUpdates /> */}
        </div>
      </section>
      {/* <img src={FuturePlayer} alt="FuturePlayer" /> */}
    </div>
  );
}

export default News