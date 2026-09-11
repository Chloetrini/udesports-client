#!/usr/bin/env bash
set -e
echo "Applying UDESPORT round-5 fixes: dark mode (news-article) + admin responsiveness/scroll fixes..."

mkdir -p "src/routes/admin/gallery"
cat > "src/routes/admin/gallery/index.tsx" << 'EOF_UDEx_5b8fe6e5'
// import React from 'react'
import { useNavigate } from "react-router";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import articleImage from "@/assets/udesportimage.jpg"

const photos = [
  {
    id: 1,
    image: articleImage,
    title: "Day out with the agents",
    caption: "from the left description of people and event happening",
  },
  {
    id: 2,
    image: articleImage,
    title: "Day out with the agents",
    caption: "from the left description of people and event happening",
  },
  {
    id: 3,
    image: articleImage,
    title: "Day out with the agents",
    caption: "from the left description of people and event happening",
  },
  {
    id: 4,
    image: articleImage,
    title: "Day out with the agents",
    caption: "from the left description of people and event happening",
  },
  {
    id: 5,
    image: articleImage,
    title: "Day out with the agents",
    caption: "from the left description of people and event happening",
  },
  {
    id: 6,
    image: articleImage,
    title: "Day out with the agents",
    caption: "from the left description of people and event happening",
  },
];

export default function Gallery() {
  const navigate = useNavigate();
  const [viewPhoto, setViewPhoto] = useState<(typeof photos)[0] | null>(null);
  const [deletePhoto, setDeletePhoto] = useState<(typeof photos)[0] | null>(
    null,
  );

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-medium text-green-500 mb-1">
              Content Management
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GALLERY</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Upload and manage photos shown on the public gallery page
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/gallery/upload")}
            className="flex items-center gap-0.5 bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-[14px] px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={10} />
            Upload Content
          </button>
        </div>

        {/* Photp section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group rounded-xl overflow-hidden shadow-sm"
            >
              <img
                src={photo.image}
                alt={photo.caption}
                className="w-full h-72 object-cover"
              />

              {/* Caption section*/}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-green-500 via-green-500/70 to-transparent px-3 py-5">
                <p className="text-white text-sm font-semibold">
                  {photo.title}
                </p>
                <p className="text-white text-xs font-light opacity-90">
                  {photo.caption}
                </p>
              </div>

              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <button
                  onClick={() => setViewPhoto(photo)}
                  className="bg-transparent border hover:bg-gray-50 hover:text-black border-gray-400 text-gray-600 text-xs font-medium px-12 py-1.5 rounded-lg transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => setDeletePhoto(photo)}
                  className="bg-white hover:bg-red-500 hover:text-white text-red-500 text-xs font-light px-12 py-1.5 rounded-lg shadow transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Section */}
      {viewPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-white/15">
            <img
              src={viewPhoto.image}
              alt={viewPhoto.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {viewPhoto.title}
                </h3>
                <button onClick={() => setViewPhoto(null)}>
                  <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-6">{viewPhoto.caption}</p>
              <button
                onClick={() => setViewPhoto(null)}
                className="bg-white dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-200 dark:border-white/15 text-sm font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletePhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-lg overflow-hidden border-2 border-red-500">
            <img
              src={deletePhoto.image}
              alt={deletePhoto.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {deletePhoto.title}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {deletePhoto.caption}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">delete</span> this
                photo?
              </p>
              <div className="flex items-center gap-3">
                <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-10 py-1.5 rounded-lg transition-colors">
                  Delete
                </button>
                <button
                  onClick={() => setDeletePhoto(null)}
                  className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

EOF_UDEx_5b8fe6e5
echo "  wrote src/routes/admin/gallery/index.tsx"

mkdir -p "src/routes/admin/gallery-upload"
cat > "src/routes/admin/gallery-upload/index.tsx" << 'EOF_UDEx_4f6ebd90'
// import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { ImagePlus } from "lucide-react"

export default function GalleryUpload() {
  const navigate = useNavigate()
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [headline, setHeadline] = useState('')
  const [instaUrl, setInstaUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<Record<string, string>>({})

  function validate(){
       const newError: Record<string, string> = {}
    if (!headline.trim() && !instaUrl.trim()) {
      newError.headline = 'Either Photo Headline or Insta URL is required'
    }
    if (!description.trim()) newError.description = 'Photo description is required'
    return newError
  }

  function handlePublish(){
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors)
      return
    }
    navigate("/admin/gallery")
  }

  return (
    <div className='p-6'>
       <p className="text-sm font-medium text-green-500 mb-1"> Content Management</p>
       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        <span className="text-gray-400">GALLERY</span> › UPLOAD CONTENT
       </h1>
       <p className="text-sm text-gray-400 mb-4">Upload and manage photos shown on the public gallery page</p>

       {/* Back button */}
      <button onClick={() =>("/gallery")} className='flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors'>
        <ArrowLeft size={18}/>
        Back
      </button>

      {/* Form */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
           <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  Photo Headline <span className="text-gray-400 font-medium">(Optional on Insta URL paste)</span>
                </label>
                <input type="text" placeholder='Input Headline' value={headline} onChange={(e) => {setHeadline(e.target.value); setError({...error, headline: ""})}}
                className={`border px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error.headline ? 'border-red-400' : 'border-gray-200 dark:border-white/15 hover:border-green-400'}`} />
                {error.headline && <p className='text-xs text-red-500'>{error.headline}</p>}
              </div>

              <div  className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Insta URL</label>
                <input type="text" placeholder='Input Headline' value={instaUrl} onChange={(e) => setInstaUrl(e.target.value)}
                 className='border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 py-2 px-3 text-sm'/>

              </div>
           </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Photo Description <span className="text-gray-400 font-normal">(Optional on Insta URL paste)</span>
          </label>
          <textarea placeholder="Input Description" rows={5} value={description} onChange={(e) => {setDescription(e.target.value); setError({...error, description: ""})}}
               className={`border px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 resize-none rounded-lg ${error.description ? 'border-red-400' : 'border-gray-200 dark:border-white/15 hover:border-green-400'}`} />
               {error.description && <p className='text-xs text-red-500'>{error.description}</p>}
        </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-6 md:w-1/2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Cover Image <span className="text-gray-400 font-normal">(Optional on Insta URL paste)</span>
          </label>
          <label className="border border-gray-200 dark:border-white/15 h-36 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
            {coverImage ? (
              <img src={coverImage} className="h-full w-full object-cover rounded-lg" />
        ) : (
           <div className="flex items-center gap-2">
             <ImagePlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
             <p className="text-xs text-gray-400">Upload Photo</p>
           </div>
            )}

            <input type="file" accept='image/*' className='hidden' onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setCoverImage(URL.createObjectURL(file))
            }} />
          </label>
        </div>

{/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={handlePublish} className="bg-gray-200 dark:bg-white/10 hover:bg-green-600 text-black dark:text-white hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
            + Publish
          </button>
          <button className="bg-gray-200 dark:bg-white/10 hover:bg-green-500 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
             Save as Draft
          </button>
          <button onClick={() => navigate("/admin/gallery")} className='bg-gray-200 dark:bg-white/10 hover:bg-green-500 hover:text-white text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-6 py-2 rounded-lg transition-colors'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}


EOF_UDEx_4f6ebd90
echo "  wrote src/routes/admin/gallery-upload/index.tsx"

mkdir -p "src/routes/admin/news"
cat > "src/routes/admin/news/index.tsx" << 'EOF_UDEx_32c56347'
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
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-black hover:text-white text-[15px] font-[13px] px-5 py-2 rounded-lg transition-colors shrink-0"
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
              className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden shrink-0 w-72"
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
                  className="absolute top-2 right-2 border border-red-400  hover:bg-red-600 text-red-500 hover:text-white bg-white dark:bg-white/10 p-1.5 rounded-lg transition-colors"
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
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-2 mb-1">
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
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {article.views}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Shares</p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Article History
          </h2>
          <div className="flex gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none"
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
              className="text-xs border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-green-400"
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
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight size={14} className="shrink-0 text-black dark:text-white" />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {article.headline}
                      </p>
                      <p className="text-xs text-gray-400">{article.meta}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{article.views}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{article.shares}</td>
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
                      className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
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
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-lg overflow-hidden border-2 border-red-600">
            <div className="p-8 pt-0">
              <img
                src={deleteArticle.image}
                alt={deleteArticle.headline}
                className="w-full h-48 object-cover"
              />
              <div className="pt-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
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
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {deleteArticle.views}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Share2 size={11} /> Shares
                      </p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {deleteArticle.shares}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">delete</span> this
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

EOF_UDEx_32c56347
echo "  wrote src/routes/admin/news/index.tsx"

mkdir -p "src/routes/main/articles/full-news"
cat > "src/routes/main/articles/full-news/index.tsx" << 'EOF_UDEx_8eb24359'
import type { NewsArticle, NewsCategory } from "@/types/dataTypes";
// import QuickUpdates from "@/components/QuickUpdates";
// PLACEHOLDER — engagementStats is not a real schema field yet, see the
// commented-out block below. Re-add these imports (views/shares/pinterest/
// facebook icons + formatCount) if that block is restored.
import { useParams } from "react-router";
import { calculateReadTime, estimateReadTime, formatDate } from "@/lib/utils";
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
      <p className="text-sm text-[#464646] dark:text-gray-400">{article.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={article.authorPhoto ? article.authorPhoto : noAuthorPhoto}
            alt={article.author}
            className="h-9 w-9 rounded-full"
          />
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-medium text-[#1A1A1A] dark:text-white">
              {article.author}
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

  const {
    data: articles,
    isLoading,
    isError,
  } = useGetNewsArticles();

  if (isLoading) return <SingleNewsSkeleton />;
  if (isError) return <p className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-white text-center p-6">Something went wrong loading this article.</p>;

  const article = (articles ?? []).find(
    (a) => a.id === articleId && a.published,
  );

  if (!article) return <p className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-white p-6">Article not found.</p>;

  const relatedArticles = (articles ?? [])
    .filter((a) => a.published && a.id !== article.id)
    .slice(0, 2);

  return (
    <PageWrapper className="p-[20px] bg-white dark:bg-black transition-colors duration-300">
      <Seo title={article.headline} description={article.excerpt ?? 'Full article — UdeSport News & Transfers.'} />
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
                src={article.authorPhoto ? article.authorPhoto : noAuthorPhoto}
                alt={article.author}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col text-sm leading-tight">
                <span className="font-medium text-[#1A1A1A] dark:text-white">
                  {article.author}
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



EOF_UDEx_8eb24359
echo "  wrote src/routes/main/articles/full-news/index.tsx"

mkdir -p "src/routes/admin/news-article"
cat > "src/routes/admin/news-article/index.tsx" << 'EOF_UDEx_5e7394b1'
// import React from 'react'
import { useNavigate } from "react-router";
import { ArrowLeft, List, ListOrdered, Quote, Eye, Share2, ImagePlus, CircleUserRound } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { articleHistory } from "@/data/articles";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NewsArticle() {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Transfer");
  const [featuredPlayer, setFeaturedPlayer] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  const { index } = useParams();
  const article = index !== undefined ? articleHistory[Number(index)] : null;

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  function validate() {
    const newError: Record<string, string> = {};
    if (!headline.trim()) newError.headline = "Headline is required";
    if (!summary.trim()) newError.summary = "Article summary is required";
    const bodyText = editor?.getText().trim();
    if (!bodyText) newError.body = "Article body is required";

    return newError;
  }

  function handlePublish() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    setShowPublishModal(true);
  }

  return (
    <div className="p-6">
      <p className="text-sm font-medium text-green-500 mb-1">
        Content Management
      </p>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl">
            <strong className="text-gray-500">NEWS UPDATE</strong>{" "}
            <span className="text-gray-900 dark:text-white">››</span>{" "}
            <strong className="text-gray-900 dark:text-white">{article ? "EDIT ARTICLE" : "NEWS ARTICLE"}</strong>
          </h1>
          <p className="text-[15px] text-gray-400 mt-0.5">
            Publish and manage transfer updates, academy news, and announcements
          </p>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/admin/news")}
        className="flex items-center gap-1.5 text-[18px] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={26} className="text-gray-500 dark:text-gray-300" />
        Back
      </button>

      {/* Form section */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        {/*  Headline, Category, Featured Player */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Headline
            </label>
            <input
              type="text"
              placeholder="Content"
              value={headline}
              onChange={(e) => {
                setHeadline(e.target.value);
                setError({ ...error, headline: "" });
              }}
              className={`border-2 px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${
                error.headline
                  ? "border-red-400"
                  : "border-gray-100 dark:border-white/15 hover:border-green-500"
              }`}
            />
            {error.headline && (
              <p className="text-xs text-red-500">{error.headline}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:border-green-500"
            >
              <option>Transfer</option>
              <option>Academy</option>
              <option>Negotiation</option>
              <option>International</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Featured Player
            </label>
            <input
              type="text"
              placeholder="Player Name"
              value={featuredPlayer}
              onChange={(e) => setFeaturedPlayer(e.target.value)}
              className="border bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/15 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Article Summary, Cover Image  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Article Summary
            </label>
            <textarea
              placeholder="Input text"
              rows={6}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setError({ ...error, summary: "" });
              }}
              className={`border px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 resize-none ${
                error.summary ? "border-red-400" : "border-gray-200 dark:border-white/15"
              }`}
            />
            {error.summary && (
              <p className="text-xs text-red-500">{error.summary}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Cover Image
            </label>
            <label className="border-2 border-gray-300 dark:border-white/15 h-34 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
              {coverImage ? (
                <img
                  src={coverImage}
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-6 h-6 text-gray-400" />
                    <p className="text-xs text-gray-400">Upload Photo</p>
                  </div>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCoverImage(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* Article section */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Article Body
          </label>

          {/* Toolbar */}
          <div className="border border-gray-200 dark:border-white/15 rounded-t-lg px-3 py-2 flex items-center gap-2 flex-wrap bg-gray-50 dark:bg-white/5">
            {/*Heading 1 */}
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              T1
            </button>

            {/*Heading 2 */}
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              T2
            </button>

            {/*Paragraph */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("paragraph") && !editor?.isActive("heading")
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              P
            </button>

            <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1" />

            {/*Bold */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("bold") ? "bg-gray-300 dark:bg-white/20" : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              B
            </button>

            {/* I - Italic */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors text-gray-700 dark:text-gray-200 ${
                editor?.isActive("italic") ? "bg-gray-300 dark:bg-white/20" : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              I
            </button>

            <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("bulletList")
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <List size={14} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("orderedList")
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <ListOrdered size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
            {/* Blockquote */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("blockquote")
                  ? "bg-gray-300 dark:bg-white/20"
                  : "hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <Quote size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            className={`border border-t-0 rounded-b-lg px-3 py-2 text-sm min-h-50 bg-white dark:bg-white/5 text-gray-900 dark:text-white [&_.tiptap]:outline-none ${
              error.body ? "border-red-400" : "border-gray-200 dark:border-white/15"
            }`}
          />
          {error.body && <p className="text-xs text-red-500">{error.body}</p>}
        </div>

        {/* buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handlePublish}
            className="bg-white dark:bg-white/5 hover:bg-green-500 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 dark:border-white/15 transition-colors"
          >
            {article ? "Save Changes" : "+ Publish"}
          </button>
          <button className="bg-white dark:bg-white/5 hover:bg-green-500 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 dark:border-white/15 transition-colors">
            Save as Draft
          </button>
          <button
            onClick={() => navigate("/admin/news")}
            className="bg-white dark:bg-white/5 hover:bg-green-500 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 dark:border-white/15 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Publish modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border-2 border-green-500">
            <div className="p-8 pb-0 pt-0">
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover image"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="pb-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3 mb-1">
                  {headline}
                </h3>

                {/* Summary */}
                <p className="text-xs text-gray-400 mb-4">{summary}</p>

                {/* Author views and shares */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                      <CircleUserRound className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Anwar pandar
                      </p>
                      <p className="text-xs text-gray-400">
                        March 16, 2022 · 6 min read
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye size={11} /> Views
                      </p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">1.6K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Share2 size={11} />
                        Shares
                      </p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">14K</p>
                    </div>
                  </div>
                </div>

                {/* Featured Player */}
                {featuredPlayer && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Featured Player:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {featuredPlayer}
                    </span>
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                  Are you sure you want to{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {" "}
                    {article ? "save changes to" : "publish"}
                  </span>{" "}
                  this Article?
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowPublishModal(false);
                      navigate("/admin/news");
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
                  >
                    {article ? "Save Changes" : "+ Publish"}
                  </button>
                  <button
                    onClick={() => setShowPublishModal(false)}
                    className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

EOF_UDEx_5e7394b1
echo "  wrote src/routes/admin/news-article/index.tsx"

mkdir -p "src/routes/admin/player-overview"
cat > "src/routes/admin/player-overview/index.tsx" << 'EOF_UDEx_414b0f0b'
// import React from 'react'
import { Search, Plus } from "lucide-react"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useGetPlayers } from "@/hooks/useApi";

const statusStyle : Record<string, string> = {
    Transferred: "bg-green-200 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    Negotiation: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    Free: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
}

function PlayerRowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />
                    <div className="space-y-1.5">
                        <div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/10" />
                        <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                </div>
            </td>
            <td className="px-5 py-4"><div className="h-3 w-10 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-8 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-6 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-6 w-20 rounded bg-gray-200 dark:bg-white/10" /></td>
        </tr>
    );
}

export default function PlayerOverview() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [groupFilter, setGroupFilter] = useState('All Groups')
    const [statusFilter, setStatusFilter] = useState('All Statuses')

      const { data: players, isLoading } = useGetPlayers();


const filteredPlayers = players?.filter((player) => {
    const matchSearch =
    player.playerFullName.toLowerCase().includes(search.toLowerCase()) ||
    player.status.toLowerCase().includes(search.toLowerCase()) ||
    player.currentClubName.toLowerCase().includes(search.toLowerCase())

    const matchGroup = groupFilter === "All Groups" || player.ageGroup === groupFilter
    const matchStatus = statusFilter === 'All Statuses' || player.status === statusFilter

    return matchSearch && matchGroup && matchStatus
})

return(
    <div className="p-6">
{/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <div>
                <p className="text-sm font-medium text-green-500 mb-1">Overview</p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PLAYER</h1>
                <p className="text-xs text-gray-400 mt-0.5">Add, edit, and manage player profiles and status</p>
            </div>
            <button onClick={() => navigate("/admin/player-overview/add")} className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-black text-xs font-medium px-4 py-2 rounded-lg transition-colors shrink-0">
                 <Plus size={10}/>
                 Add Player
            </button>
          </div>

{/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative w-full sm:w-64">
                  <Search size={15} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="text"
                  placeholder="Search Players"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-2 py-2 text-xs border border-gray-200 dark:border-white/15 rounded-lg focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
              </div>

              <div className="flex gap-3 flex-wrap">
              <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="text-xs border border-gray-200 dark:border-white/15 rounded-lg px-3 py-2 focus:border-green-400 focus:bg-green-100 dark:focus:bg-green-900/30 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5">
                <option>All Groups</option>
                <option>U - 17</option>
                <option>U - 21</option>
                <option>U - 23</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border border-gray-200 dark:border-white/15 focus:bg-green-100 dark:focus:bg-green-900/30 rounded-lg px-3 py-2 focus:outline-none focus:border-green-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5">
                <option>All Statuses</option>
                <option>Transferred</option>
                <option>Negotiation</option>
                <option>Free</option>
              </select>
              </div>
          </div>

{/* Table Section */}
       <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-x-auto">
         <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Player</th>
              <th className="text-left px-5 py-3 font-medium">Group</th>
              <th className="text-left px-5 py-3 font-medium">Position</th>
              <th className="text-left px-5 py-3 font-medium">Ratings</th>
              <th className="text-left px-5 py-3 font-medium">Club</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/10">
            {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <PlayerRowSkeleton key={i} />)
            ) : (
            filteredPlayers?.map((player, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                   {/* Player */}
                   <td className="px-5 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {player.playerFullName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{player.playerFullName}</p>
                            <p className="text-xs text-gray-400">Pos. {player.position}</p>
                        </div>
                     </div>
                   </td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.ageGroup}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.position}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.rating}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.currentClubName}</td>

 {/* Status */}
             <td className="px-5 py-4">
               <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[player.status]}`}>
                 {player.status}
               </span>
             </td>

             {/* Actions */}
             <td className="px-5 py-4">
               <div className="flex items-center gap-2">
                 <button onClick={() => navigate(`/admin/player-overview/edit/${i}`)} className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                    Edit
                 </button>
                 <button className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors">
                    Delete
                 </button>
               </div>
             </td>
                </tr>
            )))}
          </tbody>
         </table>
       </div>

    </div>
)
}



EOF_UDEx_414b0f0b
echo "  wrote src/routes/admin/player-overview/index.tsx"

mkdir -p "src/routes/admin/add-player"
cat > "src/routes/admin/add-player/index.tsx" << 'EOF_UDEx_690300bc'
// import React from 'react'
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useState } from "react";
import { useGetPlayers } from "@/hooks/useApi";
import countries from "world-countries";

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
      <div className="h-9 w-full rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
    </div>
  );
}

function AddPlayerSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6 space-y-2">
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="h-7 w-40 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="h-3 w-64 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
      </div>
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
        <div className="mt-5">
          <div className="h-3 w-32 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-1.5" />
          <div className="h-24 w-full rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

const AddPlayer = () => {
  const { data: players, isLoading, isError } = useGetPlayers();
  const navigate = useNavigate();
  const { index } = useParams();
  const player = index !== undefined ? players?.[Number(index)] ?? null : null;
  const [name, setName] = useState(player?.playerFullName);
  const [position, setPosition] = useState(player?.position);
  const [group, setGroup] = useState(player?.ageGroup);
  const [dob, setDob] = useState(player?.DOB);
  const [nationality, setNationality] = useState(player?.nationality);
  const [foot, setFoot] = useState(player?.preferredFoot);
  const [height, setHeight] = useState(player?.height);
  const [status, setStatus] = useState(player?.status || "Free");
  const [goals, setGoals] = useState(player?.goals);
  const [assists, setAssists] = useState(player?.assists);
  const [ratings, setRatings] = useState(player?.rating?.toString() || "");
  const [background, setBackground] = useState(player?.playerHistory);

  const [error, setError] = useState<Record<string, string>>({});

  if (isLoading) {
    return <AddPlayerSkeleton />
  }
  if (isError) {
    return <div className="p-6 text-gray-900 dark:text-white">Something went wrong</div>
  }

  function validate() {
    const newError: Record<string, string> = {};
    if (!name?.trim()) {
      newError.name = "Player name is required";
    }

    const dobRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dob?.trim()) {
      newError.dob = "Date of birth is required";
    } else if (!dobRegex.test(dob)) {
      newError.dob = "Use MM/DD/YYYY format (e.g. 08/25/2006)";
    }

    // const heightRegex = /^\d{2,3}\s?cm$/i;
    // if (!height?.trim()) {
    //   newError.height = "Height is required";
    // } else if (!heightRegex.test(height.trim())) {
    //   newError.height = "Height must be in cm (e.g. 187 cm)";
    // }

    if (!background?.trim())
      newError.background = "Player Background is required";

    return newError;
  }

  function handleSubmit() {
    const newError = validate();
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }
    navigate("/admin/player-overview");
  }
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-green-500 mb-1">Overview</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {player ? "EDIT PLAYER" : "ADD PLAYER"}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Add, edit, and manage player profiles and status
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Player's name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Player Name
            </label>
            <input
              type="text"
              placeholder="Input Player Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError({ ...error, name: "" });
              }}
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.name ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.name && <p className="text-xs text-red-500">{error.name}</p>}
          </div>

          {/* Position */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>LW</option>
              <option>RW</option>
              <option>ST</option>
              <option>CM</option>
              <option>RB</option>
              <option>LB</option>
              <option>GK</option>
            </select>
          </div>

          {/* Age Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Age Group
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as "U-17" | "U-21" | "U-23")}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>U-17</option>
              <option>U-21</option>
              <option>U-23</option>
            </select>
          </div>

          {/* Date of birth */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="text"
              placeholder="DD/MM/YY"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setError({ ...error, dob: "" });
              }}
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.dob ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.dob && <p className="text-xs text-red-500">{error.dob}</p>}
          </div>

          {/* Nationality */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Nationality
            </label>

            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option value="">Select nationality</option>

              {countries.map((country) => (
                <option key={country.cca3} value={country.demonyms?.eng?.m ?? country.name.common}>
                  {country.demonyms?.eng?.m ?? country.name.common}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred foot */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Preferred Foot
            </label>
            <select
              value={foot}
              onChange={(e) => setFoot(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>Both</option>
              <option>Left</option>
              <option>Right</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-5 ">
          {/* Height */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Height (CM)</label>
            <input
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value));
                setError({ ...error, height: "" });
              }}
              type="number"
              placeholder="e.g. 187 cm"
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.height ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.height && (
              <p className="text-xs text-red-500">{error.height}</p>
            )}
          </div>

          {/* Current status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Free" | "Transferred" | "Negotiation")}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>Free</option>
              <option>Transferred</option>
              <option>Negotiation</option>
            </select>
          </div>

          {/* Goals */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Goals</label>
            <input
              value={goals}
              onChange={(e) => setGoals(Number(e.target.value))}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Assists */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Assists</label>
            <input
              value={assists}
              onChange={(e) => setAssists(Number(e.target.value))}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Ratings */}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Ratings</label>
            <input
              value={ratings}
              onChange={(e) => setRatings(e.target.value)}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Player background */}
        <div className="flex flex-col gap-1.5 mt-5">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Player Background
          </label>
          <textarea
            value={background}
            onChange={(e) => {
              setBackground(e.target.value);
              setError({ ...error, background: "" });
            }}
            placeholder="Input Player history"
            rows={10}
            className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.background ? "border-red-400" : "border-gray-200 dark:border-white/15"
              }`}
          />
          {error.background && (
            <p className="text-xs text-red-500">{error.background}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-6 flex-wrap">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {player ? "Save Changes" : "+ Add Player"}
          </button>
          <button
            onClick={() => navigate("/admin/player-overview")}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/15 px-6 py-2 rounded-lg transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => navigate("/admin/player-overview")}
            className="text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlayer;



EOF_UDEx_690300bc
echo "  wrote src/routes/admin/add-player/index.tsx"

mkdir -p "src/layouts"
cat > "src/layouts/AdminLayout.tsx" << 'EOF_UDEx_8a4a478a'
import { NavLink, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Images,
  Bell,
  Settings,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import udeLogo from "../assets/udeLogo.png";
import { adminUser } from "@/lib/adminUser";
import { useTheme } from "@/contexts/ThemeContext";

const navItems = [
  {
    section: "Dashboard",
    links: [
      { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "",
    links: [
      { label: "Players", path: "/admin/player-overview", icon: Users },
      { label: "News", path: "/admin/news", icon: Newspaper },
      { label: "Gallery", path: "/admin/gallery", icon: Images },
    ],
  },
  {
    section: "System",
    links: [
      { label: "Notification", path: "/admin/notifications", icon: Bell },
      { label: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

function getInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="h-20 bg-white dark:bg-black flex items-center justify-between gap-4 px-6 sticky top-0 z-10 border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}

        className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Right side */}
      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {/* Theme Toggle — compact icon button, fits without crowding the topbar on small screens */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 rounded-lg border border-gray-200 dark:border-white/15 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button className="flex items-center gap-1.5 text-xs lg:text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-2 lg:px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
          onClick={() => navigate("/")}>
          Visit Sites
          <ArrowUpRight size={15} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-black text-[14px] font-medium">
            {getInitials(adminUser.name)}
          </div>
          <div className="leading-tight">
            <p className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">
              {adminUser.name}
            </p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold">
              {adminUser.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  handleLogout,
  isOpen,
  onClose,
}: {
  handleLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate()
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-56 bg-white dark:bg-black border-r border-gray-100 dark:border-white/10 flex flex-col z-40
        transition-colors transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="h-16 px-4 flex items-center gap-1"
        onClick={()=>navigate("/")}>
          <img
            src={udeLogo}
            alt="UDESport Logo"
            className="w-8 h-8 object-contain"
          />
          <div className="leading-tight">
            <p className="text-l font-semibold text-gray-600 dark:text-gray-300">UDESport</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Management Ltd</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navItems.map((group, index) => (
            <div key={index}>
              {group.section && (
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500 px-2 mb-1">
                  {group.section}
                </p>
              )}
              <div className="space-y-0.5">
                {group.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-m font-medium transition-colors ${
                        isActive
                          ? "bg-green-400 text-black"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      }`
                    }
                  >
                    <link.icon size={16} />
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white w-full transition-colors"
          >
            <LogOut size={20} />
            LogOut
          </button>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    navigate("/admin/login");
  }

  const authPages = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/verification",
    "/admin/new-password",
  ];

  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-white dark:bg-black transition-colors duration-300 max-w-screen-2xl mx-auto w-full">
      {!isAuthPage && (
        <Sidebar
          handleLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`flex-1 min-w-0 ${!isAuthPage ? "lg:ml-56" : ""}`}
      >
        {!isAuthPage && <Topbar onMenuClick={() => setSidebarOpen(true)} />}
        <div className="overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}



EOF_UDEx_8a4a478a
echo "  wrote src/layouts/AdminLayout.tsx"

echo "Done. Run: npx tsc --noEmit -p tsconfig.app.json && npx eslint . && npm run build"
