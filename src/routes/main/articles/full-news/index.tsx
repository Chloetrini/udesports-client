import type { NewsArticle, NewsCategory } from "@/types/dataTypes";
// import QuickUpdates from "@/components/QuickUpdates";
// PLACEHOLDER — engagementStats is not a real schema field yet, see the
// commented-out block below. Re-add these imports (views/shares/pinterest/
// facebook icons + formatCount) if that block is restored.
import { useParams } from "react-router";
import { calculateReadTime, estimateReadTime, formatDate } from "@/lib/utils";
import { Seo } from "@/components/seo";
import { useGetNewsArticles, useGetSingleNewsArticle } from "@/hooks/useApi";
import news from '@/assets/news.jpeg'
import noAuthorPhoto from '@/assets/no profile photo.jpg'
import PageWrapper from "@/components/page-wrapper";

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TRANSFER: "Transferred",
  ACADEMY: "Academy News",
  ANNOUNCEMENT: "Announcement",
};

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  TRANSFER: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  ACADEMY: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  ANNOUNCEMENT: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
};

// Recommended Topic — only the real categories that exist on NewsCategory.
// No "Milestone"/"International" here, those aren't real values yet.
const RECOMMENDED_TOPICS: NewsCategory[] = [
  "TRANSFER",
  "ACADEMY",
  "ANNOUNCEMENT",
];

function RelatedArticleCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-col gap-2 hover:scale-105 transition-transform">
      <img
        src={article.coverImage ? article.coverImage : news}
        alt={article.headline}
        className="h-48 w-full rounded-2xl object-cover"
      />
      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLE[article.category]}`}
      >
        • {CATEGORY_LABEL[article.category]}
      </span>
      <h3 className="text-lg font-bold leading-snug text-[#1A1A1A] dark:text-white">
        {article.headline}
      </h3>
      <p className="text-sm text-[#464646] dark:text-gray-400">{article.summary}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={noAuthorPhoto}
            alt={article.author.name}
            className="h-9 w-9 rounded-full"
          />
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-medium text-[#1A1A1A] dark:text-white">
              {article.author.name}
            </span>
            <time dateTime={article.createdAt} className="text-[#959595] dark:text-gray-500">
              {formatDate(article.createdAt)} • {estimateReadTime(article.body)} read
            </time>
          </div>
        </div>
        <a
          href={`/news/${article.id}`}
          className="text-sm font-medium text-[#382E53] dark:text-gray-300 hover:text-[#00A553] dark:hover:text-[#00A553] hover:underline transition-all"
        >
          Read more »
        </a>
      </div>
    </article>
  );
}

function SingleNewsSkeleton() {
  return (
    <PageWrapper className="p-[20px] bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className="w-full lg:w-8/12">
          {/* cover image */}
          <div className="h-64 w-full rounded-2xl bg-[#e9e9e9] dark:bg-white/10 animate-pulse md:h-80 lg:h-96" />

          {/* headline */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="h-7 w-full rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
            <div className="h-7 w-2/3 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
          </div>

          {/* author row */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-28 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
              <div className="h-3 w-40 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
            </div>
          </div>

          {/* body */}
          <div className="mt-8 flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-3.5 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse ${i === 5 ? 'w-2/3' : 'w-full'}`}
              />
            ))}
          </div>

          {/* related articles */}
          <div className="mt-12">
            <div className="h-6 w-44 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-48 w-full rounded-2xl bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
                  <div className="h-5 w-4/5 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
                  <div className="h-3.5 w-full rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-9 w-9 rounded-full bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3 w-20 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
                      <div className="h-3 w-28 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-3/12 lg:sticky lg:top-6 lg:self-start">
          <div className="mt-8">
            <div className="h-5 w-32 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 w-24 rounded-full bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}

const SingleNews = () => {
  const { id: articleId } = useParams<{ id: string }>();

  // The single-article route isn't filtered server-side (an admin needs to
  // be able to load a draft by id to preview it), so a draft's id typed into
  // the public URL is still rejected below via article.published.
  const {
    data: article,
    isLoading,
    isError,
  } = useGetSingleNewsArticle(articleId);

  // Related articles come from the public (published-only) list, so no
  // extra filtering is needed beyond excluding the current article.
  const { data: articles } = useGetNewsArticles();

  if (isLoading) return <SingleNewsSkeleton />;
  if (isError) return <p className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-white text-center p-6">Something went wrong loading this article.</p>;

  if (!article || !article.published) return <p className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-white p-6">Article not found.</p>;

  const relatedArticles = (articles ?? [])
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return (
    <PageWrapper className="p-[20px] bg-white dark:bg-black transition-colors duration-300">
      <Seo title={article.headline} description={article.summary ?? 'Full article — UdeSport News & Transfers.'} />
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className="w-full lg:w-8/12">
          <img
            src={article.coverImage ? article.coverImage : news}
            alt={article.headline}
            className="h-64 w-full rounded-2xl object-cover md:h-80 lg:h-96"
          />

          <h1 className="mt-6 text-2xl font-bold text-[#1A1A1A] dark:text-white md:text-3xl lg:text-3xl">
            {article.headline}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={noAuthorPhoto}
                alt={article.author.name}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col text-sm leading-tight">
                <span className="font-medium text-[#1A1A1A] dark:text-white">
                  {article.author.name}
                </span>
                <time dateTime={article.createdAt} className="text-[#959595] dark:text-gray-500">
                  {formatDate(article.createdAt)} •{" "}
                  {calculateReadTime(article.body)} min read
                </time>
              </div>
            </div>

            {/* PLACEHOLDER — engagementStats is not a real schema field yet. See types/news.ts. */}
            {/* <div className="flex items-center gap-6 text-sm text-[#1A1A1A]">
              <div className="flex flex-col items-center">
                <img src={views} alt="views" />
                <span className="text-[11px] text-[#959595]">views</span>
                <span className="font-semibold">
                  {formatCount(article.engagementStats.views)}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <img src={shares} alt="shares" />
                <span className="text-[11px] text-[#959595]">shares</span>
                <span className="font-semibold">
                  {formatCount(article.engagementStats.shares)}
                </span>
              </div>
              <span className="font-semibold">
                <img src={pinterest} alt="pinterest" />{" "}
                {formatCount(article.engagementStats.pinterestShares)}
              </span>
              <span className="font-semibold">
                <img src={facebook} alt="facebook" />{" "}
                {formatCount(article.engagementStats.facebookShares)}
              </span>
            </div> */}
          </div>

          <div
            className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-[#464646] dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-[#1A1A1A] dark:text-white">
                You Might also like
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {relatedArticles.map((related) => (
                  <RelatedArticleCard key={related.id} article={related}/>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="w-full lg:w-3/12 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-4rem)] overflow-y-auto [scrollbar-none] [&::-webkit-scrollbar]:hidden">
          {/* <QuickUpdates /> */}

          <div className="mt-8">
            <h2 className="font-bold text-[#1A1A1A] dark:text-white">Recommended Topic</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {RECOMMENDED_TOPICS.map((topic) => (
                <span
                  key={topic}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLE[topic]}`}
                >
                  • {CATEGORY_LABEL[topic]}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
};

export default SingleNews;



