// import React from 'react'
import articleImage from "@/assets/articleSamplePhoto.png";
import authorImage from "@/assets/photo.png";
import { useNavigate } from "react-router";
import { Plus, ArrowLeftRight, Trash2, Eye, Share2 } from "lucide-react";
import { useState } from "react";
import { articleHistory } from "@/data/articles";

const articles = [
  {
    headline: "Kenneth Omeruo Secures Permanent Move to Leganés, LaLiga",
    category: "Transfer",
    description:
      "After a successful loan spell, Kenneth Omeruo has completed his permanent transfer to CD Leganés in the Spanish La Liga. European placement to UdeSport's portfolio",
    author: "Anwar Pandar",
    date: "March 16, 2022",
    readTime: "6 min read",
    views: "1.6K",
    shares: "14K",
    authorImage: authorImage,
    image: articleImage,
  },
  {
    headline: "Kenneth Omeruo Secures Permanent Move to Leganés, LaLiga",
    category: "Academy",
    description:
      "After a successful loan spell, Kenneth Omeruo has completed his permanent transfer to CD Leganés in the Spanish La Liga. European placement to UdeSport's portfolio",
    author: "Anwar Pandar",
    date: "March 16, 2022",
    readTime: "6 min read",
    views: "1.6K",
    shares: "14K",
    authorImage: authorImage,
    image: articleImage,
  },
  {
    headline: "Kenneth Omeruo Secures Permanent Move to Leganés, LaLiga",
    category: "Academy",
    description:
      "After a successful loan spell, Kenneth Omeruo has completed his permanent transfer to CD Leganés in the Spanish La Liga. European placement to UdeSport's portfolio",
    author: "Anwar Pandar",
    date: "March 16, 2022",
    readTime: "6 min read",
    views: "1.6K",
    shares: "14K",
    authorImage: authorImage,
    image: articleImage,
  },
  {
    headline: "Kenneth Omeruo Secures Permanent Move to Leganés, LaLiga",
    category: "Academy",
    description:
      "After a successful loan spell, Kenneth Omeruo has completed his permanent transfer to CD Leganés in the Spanish La Liga. European placement to UdeSport's portfolio",
    date: "March 16, 2022",
    readTime: "6 min read",
    views: "1.6K",
    shares: "14K",
    authorImage: authorImage,
    image: articleImage,
  },
];

const statusStyles: Record<string, string> = {
  Published: " text-green-400 font-light",
  Draft: " text-yellow-400 font-light",
};

export default function News() {
  const navigate = useNavigate();

  const [deleteArticle, setDeleteArticle] = useState<
    (typeof articles)[0] | null
  >(null);

  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredArticles = articleHistory.filter((article) => {
    const matchesCategory =
      categoryFilter === "All Categories" ||
      article.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All Statuses" || article.status === statusFilter;

    return matchesCategory && matchesStatus;
  });
  return (
    <div className="p-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-green-500">
            Content Management
          </p>
          <h1 className="text-2xl font-bold text-gray-900">NEWS UPDATE</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Publish and manage transfer updates, academy news, and announcements
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/news/article")}
          className="flex items-center bg-green-500 hover:bg-green-600 text-black hover:text-white text-[15px] font-[13px] px-5 py-2 rounded-lg transition-colors"
        >
          <Plus size={10} />
          New Article
        </button>
      </div>

      {/* Article cards */}
      <div className="overflow-hidden mb-8">
        <div className="flex gap-5 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {articles.map((article, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden shrink-0 w-72"
            >
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => {
                    setDeleteArticle(article)
                    // navigate("/admin/news")
                  }}
                  className="absolute top-2 right-2 border border-red-400  hover:bg-red-600 text-red-500 hover:text-white bg-white p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    article.category === "Transfer"
                      ? "bg-green-100 text-green-700"
                      : article.category === "Negotiation"
                      ? "bg-orange-100 text-orange-700"
                      : article.category === "International"
                      ? "bg-blue-100 text-blue-600"
                      : article.category === "Academy"
                      ? "bg-yellow-50 text-yellow-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {article.category}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 mt-2 mb-1">
                  {article.headline}
                </h3>
                <p className="text-[10px] text-gray-400 mb-3">
                  {article.description}
                </p>

                <div className="flex items-center justify-between mt-2">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <img
                      src={article.authorImage}
                      alt={article.author}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        {article.author}
                      </p>
                      <p className="text-xs text-gray-400">
                        {article.date} · {article.readTime}
                      </p>
                    </div>
                  </div>

                  {/* Views & shares */}
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Views</p>
                      <p className="text-xs font-medium text-gray-700">
                        {article.views}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Shares</p>
                      <p className="text-xs font-medium text-gray-700">
                        {article.shares}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Article History
          </h2>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none"
            >
              <option>All Categories</option>
              <option>Transfer</option>
              <option>Academy</option>
              <option>Negotiation</option>
              <option>International</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-green-400"
            >
              <option>All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Headline</th>
              <th className="text-left px-5 py-3 font-medium">Views</th>
              <th className="text-left px-5 py-3 font-medium">Shares</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredArticles.map((article, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight size={14} className="shrink-0 text-black" />
                    <div>
                      <p className="text-gray-900 font-medium">
                        {article.headline}
                      </p>
                      <p className="text-xs text-gray-400">{article.meta}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-500">{article.views}</td>
                <td className="px-5 py-4 text-gray-500">{article.shares}</td>
                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      article.category === "Transfer"
                        ? "bg-green-100 text-green-700"
                        : article.category === "Negotiation"
                        ? "bg-orange-100 text-orange-700"
                        : article.category === "International"
                        ? "bg-blue-100 text-blue-700"
                        : article.category === "Academy"
                        ? "bg-yellow-50 text-yellow-400"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {article.category}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      statusStyles[article.status]
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/news/article/${i}`)}
                      className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteArticle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border-2 border-red-600">
            <div className="p-8 pt-0">
              <img
                src={deleteArticle.image}
                alt={deleteArticle.headline}
                className="w-full h-48 object-cover"
              />
              <div className="pt-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {deleteArticle.headline}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  {deleteArticle.description}
                </p>

                {/* Authors view and shares */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={deleteArticle.authorImage}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        {deleteArticle.author}
                      </p>
                      <p className="text-xs text-gray-400">
                        {deleteArticle.date} · {deleteArticle.readTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye size={11} /> Views
                      </p>
                      <p className="text-xs font-medium text-gray-700">
                        {deleteArticle.views}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Share2 size={11} /> Shares
                      </p>
                      <p className="text-xs font-medium text-gray-700">
                        {deleteArticle.shares}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold text-gray-900">delete</span> this
                Article?
              </p>
              <div className="flex items-center gap-3">
                <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-10 py-1.5 rounded-lg transition-colors">
                  Delete
                </button>
                <button
                  onClick={() => {
                    setDeleteArticle(null);
                    navigate("/admin/news")
                  }}
                  className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
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
