import { useQuery } from "@tanstack/react-query";
import type { NewsArticle, NewsCategory } from "@/types/dataTypes";
// import QuickUpdates from "@/components/QuickUpdates";
import views from "@/assets/views.png";
import shares from "@/assets/shares.png";
import pinterest from "@/assets/pinterest.png";
import facebook from "@/assets/facebook.png";
import { useParams } from "react-router";
import { calculateReadTime, estimateReadTime, formatCount, formatDate } from "@/lib/utils";
import { Seo } from "@/components/seo";
import { useGetNewsArticles } from "@/hooks/useApi";
import news from '@/assets/news.jpeg'
import noAuthorPhoto from '@/assets/no profile photo.jpg'
import PageWrapper from "@/components/page-wrapper";

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TRANSFER: "Transferred",
  ACADEMY: "Academy News",
  ANNOUNCEMENT: "Announcement",
};

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  TRANSFER: "bg-amber-100 text-amber-700",
  ACADEMY: "bg-blue-100 text-blue-700",
  ANNOUNCEMENT: "bg-emerald-100 text-emerald-700",
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
      <h3 className="text-lg font-bold leading-snug text-[#1A1A1A]">
        {article.headline}
      </h3>
      <p className="text-sm text-[#464646]">{article.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={article.authorPhoto ? article.authorPhoto : noAuthorPhoto}
            alt={article.author}
            className="h-9 w-9 rounded-full"
          />
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-medium text-[#1A1A1A]">
              {article.author}
            </span>
            <time dateTime={article.createdAt} className="text-[#959595]">
              {formatDate(article.createdAt)} • {estimateReadTime(article.body)} read
            </time>
          </div>
        </div>
        <a
          href={`/news/${article.id}`}
          className="text-sm font-medium text-[#382E53] hover:text-[#00A553] hover:underline transition-all"
        >
          Read more »
        </a>
      </div>
    </article>
  );
}


const SingleNews = () => {
  const { id: articleId } = useParams<{ id: string }>();

  const {
    data: articles,
    isLoading,
    isError,
  } = useGetNewsArticles();

  if (isLoading) return <p>Loading article…</p>;
  if (isError) return <p>Something went wrong loading this article.</p>;

  const article = (articles ?? []).find(
    (a) => a.id === articleId && a.published,
  );

  if (!article) return <p>Article not found.</p>;

  const relatedArticles = (articles ?? [])
    .filter((a) => a.published && a.id !== article.id)
    .slice(0, 2);

  return (
    <PageWrapper className="p-[20px]">
      <Seo title={article.headline} description={article.excerpt ?? 'Full article — UdeSport News & Transfers.'} />
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className="w-full lg:w-8/12">
          <img
            src={article.coverImage ? article.coverImage : news}
            alt={article.headline}
            className="h-64 w-full rounded-2xl object-cover md:h-80 lg:h-96"
          />

          <h1 className="mt-6 text-2xl font-bold text-[#1A1A1A] md:text-3xl lg:text-3xl">
            {article.headline}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.authorPhoto ? article.authorPhoto : noAuthorPhoto}
                alt={article.author}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col text-sm leading-tight">
                <span className="font-medium text-[#1A1A1A]">
                  {article.author}
                </span>
                <time dateTime={article.createdAt} className="text-[#959595]">
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
            className="prose prose-neutral mt-8 max-w-none text-[#464646]"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-[#1A1A1A]">
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
            <h2 className="font-bold text-[#1A1A1A]">Recommended Topic</h2>
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
