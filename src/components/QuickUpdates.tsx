import { useGetQuickUpdates } from '@/hooks/useApi';
import type { QuickUpdateCategory } from '@/types/dataTypes';
import noAuthorPhoto from '@/assets/no profile photo.jpg';

const CATEGORY_LABEL: Record<QuickUpdateCategory, string> = {
  TRANSFER: 'Transfer',
  ACADEMY: 'Academy',
  ANNOUNCEMENT: 'Announcement',
  MILESTONE: 'Milestone',
  INTERNATIONAL: 'International',
};

const CATEGORY_STYLE: Record<QuickUpdateCategory, string> = {
  TRANSFER: 'bg-amber-100 text-amber-700',
  ACADEMY: 'bg-blue-100 text-blue-700',
  ANNOUNCEMENT: 'bg-emerald-100 text-emerald-700',
  MILESTONE: 'bg-[#00D46A4D] text-[#00A553]',
  INTERNATIONAL: 'bg-purple-100 text-purple-700',
};

const QuickUpdates = () => {
  const { data: updates, isLoading, error } = useGetQuickUpdates();

  if (isLoading) {
    return (
      <section className="pt-12 font-manrope">
        <h2 className="font-bold text-[20px] text-[#292929] dark:text-white">Quick Updates</h2>
        <div className="flex flex-col gap-5 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#e9e9e9] animate-pulse" />
                <div className="h-3.5 w-24 rounded bg-[#e9e9e9] animate-pulse" />
              </div>
              <div className="h-3.5 w-full rounded bg-[#e9e9e9] animate-pulse" />
              <div className="h-3 w-32 rounded bg-[#e9e9e9] animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fails quietly — this is a secondary sidebar module, not worth a full error state
  if (error || !updates || updates.length === 0) return null;

  // Tag cloud below the list, built from whichever categories actually appear
  const recommendedTopics = Array.from(new Set(updates.map((update) => update.category)));

  return (
    <section className="pt-12 font-manrope">
      <h2 className="font-bold text-[20px] text-[#292929] dark:text-white">Quick Updates</h2>

      <div className="flex flex-col gap-5 mt-4">
        {updates.map((update) => (
          <div key={update.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src={noAuthorPhoto}
                alt={update.author.name}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-[14px] text-[#292929] dark:text-white font-light">{update.author.name}</span>
            </div>

            <div className="flex flex-col">
              <p className="text-[14px] text-[#191919] dark:text-white font-medium">{update.headline}</p>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 mt-1">
                <time className="text-[#959595]" dateTime={update.createdAt}>
                  {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
                    new Date(update.createdAt)
                  )}
                </time>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[12px] ${CATEGORY_STYLE[update.category]}`}>
                  {CATEGORY_LABEL[update.category]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-[16px] text-[#292929] dark:text-white mb-3">Recommended Topic</h3>
        <div className="flex flex-wrap gap-2">
          {recommendedTopics.map((category) => (
            <span
              key={category}
              className={`px-3 py-1.5 rounded-full font-bold text-[12px] ${CATEGORY_STYLE[category]}`}
            >
              {CATEGORY_LABEL[category]}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickUpdates;


