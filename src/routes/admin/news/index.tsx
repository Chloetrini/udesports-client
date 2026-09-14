import { useNavigate } from "react-router";
import { Plus, ArrowLeftRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useGetNewsArticlesAdmin, useDeleteNewsArticle } from "@/hooks/useApi";
import type { NewsArticle, NewsCategory } from "@/types/dataTypes";
import articleImage from "@/assets/articleSamplePhoto.png";
import { formatDate } from "@/lib/utils";

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TRANSFER: "Transfer",
  ACADEMY: "Academy",
  ANNOUNCEMENT: "Announcement",
};

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  TRANSFER: "bg-green-100 text-green-700",
  ACADEMY: "bg-yellow-50 text-yellow-600",
  ANNOUNCEMENT: "bg-blue-100 text-blue-600",
};

function ArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden shrink-0 w-72 animate-pulse">
      <div className="w-full h-40 bg-gray-200 dark:bg-white/10" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
        <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
  );
}

function ArticleRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-3 w-40 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-6 w-20 rounded bg-gray-200 dark:bg-white/10" /></td>
    </tr>
  );
}

export default function News() {
  const navigate = useNavigate();
  const { data: articles, isLoading, isError } = useGetNewsArticlesAdmin();
  const deleteMutation = useDeleteNewsArticle();

  const [deleteArticle, setDeleteArticle] = useState<NewsArticle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"All Categories" | NewsCategory>("All Categories");
  const [statusFilter, setStatusFilter] = useState<"All Statuses" | "Published" | "Draft">("All Statuses");

  function confirmDelete() {
    if (!deleteArticle) return;
    deleteMutation.mutate(deleteArticle.id, {
      onSuccess: () => toast.success("Article deleted"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't delete this article"),
    });
    setDeleteArticle(null);
  }

  const sorted = [...(articles ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Most recent few, shown as cards above the full filterable table.
  const recentArticles = sorted.slice(0, 4);

  const filteredArticles = sorted.filter((article) => {
    const matchesCategory = categoryFilter === "All Categories" || article.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All Statuses" ||
      (statusFilter === "Published" ? article.published : !article.published);
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-sm font-medium text-green-500">
            Content Management
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NEWS UPDATE</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Publish and manage transfer updates, academy news, and announcements
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/news/article")}
          className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-black hover:text-white text-[13px] font-medium px-5 py-2 rounded-lg transition-colors shrink-0"
        >
          <Plus size={10} />
          New Article
        </button>
      </div>

      {isError && (
        <p className="text-sm text-red-500 mb-4">Couldn't load articles. Please refresh the page.</p>
      )}

      {/* Recent articles */}
      <div className="overflow-hidden mb-8">
        <div className="flex gap-5 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ArticleCardSkeleton key={i} />)
          ) : recentArticles.length === 0 ? (
            <p className="text-sm text-gray-400">No articles yet — click "New Article" to publish the first one.</p>
          ) : (
            recentArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden shrink-0 w-72"
              >
                <div className="relative">
                  <img
                    src={article.coverImage || articleImage}
                    alt={article.headline}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => setDeleteArticle(article)}
                    className="absolute top-2 right-2 border border-red-400 hover:bg-red-600 text-red-500 hover:text-white bg-white dark:bg-white/10 p-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  {!article.published && (
                    <span className="absolute top-2 left-2 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                      Draft
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_STYLE[article.category]}`}>
                    {CATEGORY_LABEL[article.category]}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-2 mb-1 line-clamp-2">
                    {article.headline}
                  </h3>
                  <p className="text-[10px] text-gray-400 mb-3 line-clamp-2">
                    {article.summary}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-black text-xs font-semibold shrink-0">
                      {article.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {article.author.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(article.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Articles History */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Article History
          </h2>
          <div className="flex gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as "All Categories" | NewsCategory)}
              className="text-xs border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="TRANSFER">Transfer</option>
              <option value="ACADEMY">Academy</option>
              <option value="ANNOUNCEMENT">Announcement</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All Statuses" | "Published" | "Draft")}
              className="text-xs border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-green-400"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Headline</th>
              <th className="text-left px-5 py-3 font-medium">Author</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <ArticleRowSkeleton key={i} />)
            ) : filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">
                  No articles match your filters.
                </td>
              </tr>
            ) : (
              filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight size={14} className="shrink-0 text-black dark:text-white" />
                      <p className="text-gray-900 dark:text-white font-medium">
                        {article.headline}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{article.author.name}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_STYLE[article.category]}`}>
                      {CATEGORY_LABEL[article.category]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        article.published
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{formatDate(article.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/news/article/${article.id}`)}
                        className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteArticle(article)}
                        className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteArticle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-lg overflow-hidden border-2 border-red-600">
            <div className="p-8 pt-0">
              <img
                src={deleteArticle.coverImage || articleImage}
                alt={deleteArticle.headline}
                className="w-full h-48 object-cover"
              />
              <div className="pt-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {deleteArticle.headline}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  {deleteArticle.summary}
                </p>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">delete</span> this
                Article?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-10 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </button>
                <button
                  onClick={() => setDeleteArticle(null)}
                  className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
