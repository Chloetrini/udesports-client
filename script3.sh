bash << 'OUTER_EOF'
set -e
echo "Applying UDESPORT dark-mode fix round 3 (admin gallery, gallery-upload, admin news, full-news)..."
mkdir -p "$(dirname "src/routes/admin/gallery/index.tsx")"
cat > src/routes/admin/gallery/index.tsx << 'EOF_UDE3_5b8fe6e5'
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

EOF_UDE3_5b8fe6e5
echo "  wrote src/routes/admin/gallery/index.tsx"
mkdir -p "$(dirname "src/routes/admin/gallery-upload/index.tsx")"
cat > src/routes/admin/gallery-upload/index.tsx << 'EOF_UDE3_4f6ebd90'
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
        <div className="flex items-center gap-3">
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


EOF_UDE3_4f6ebd90
echo "  wrote src/routes/admin/gallery-upload/index.tsx"
mkdir -p "$(dirname "src/routes/admin/news/index.tsx")"
cat > src/routes/admin/news/index.tsx << 'EOF_UDE3_32c56347'
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NEWS UPDATE</h1>
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
        <div className="flex items-center justify-between p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Article History
          </h2>
          <div className="flex gap-2">
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

EOF_UDE3_32c56347
echo "  wrote src/routes/admin/news/index.tsx"
mkdir -p "$(dirname "src/routes/main/articles/full-news/index.tsx")"
cat > src/routes/main/articles/full-news/index.tsx << 'EOF_UDE3_8eb24359'
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



EOF_UDE3_8eb24359
echo "  wrote src/routes/main/articles/full-news/index.tsx"
echo "Done. Now run: npx tsc --noEmit -p tsconfig.app.json && npx eslint . && npm run build"
OUTER_EOF
