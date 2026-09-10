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
            <span className="text-gray-900">››</span>{" "}
            <strong>{article ? "EDIT ARTICLE" : "NEWS ARTICLE"}</strong>
          </h1>
          <p className="text-[15px] text-gray-400 mt-0.5">
            Publish and manage transfer updates, academy news, and announcements
          </p>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/admin/news")}
        className="flex items-center gap-1.5 text-[18px] text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={26} color="gray" />
        Back
      </button>

      {/* Form section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/*  Headline, Category, Featured Player */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
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
              className={`border-2 px-3 py-2 text-sm focus:outline-none focus:border-green-500 ${
                error.headline
                  ? "border-red-400"
                  : "border-gray-100 hover:border-green-500"
              }`}
            />
            {error.headline && (
              <p className="text-xs text-red-500">{error.headline}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border bg-gray-100 border-gray-200 px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-green-500"
            >
              <option>Transfer</option>
              <option>Academy</option>
              <option>Negotiation</option>
              <option>International</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              Featured Player
            </label>
            <input
              type="text"
              placeholder="Player Name"
              value={featuredPlayer}
              onChange={(e) => setFeaturedPlayer(e.target.value)}
              className="border bg-gray-100 border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Article Summary, Cover Image  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
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
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 resize-none ${
                error.summary ? "border-red-400" : "border-gray-200"
              }`}
            />
            {error.summary && (
              <p className="text-xs text-red-500">{error.summary}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              Cover Image
            </label>
            <label className="border-2 border-gray-300 h-34 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
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
          <label className="text-xs font-medium text-gray-600">
            Article Body
          </label>

          {/* Toolbar */}
          <div className="border border-gray-200 rounded-t-lg px-3 py-2 flex items-center gap-2 bg-gray-50">
            {/*Heading 1 */}
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1 px-2 rounded text-xs font-bold transition-colors ${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
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
              className={`p-1 px-2 rounded text-xs font-bold transition-colors ${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              }`}
            >
              T2
            </button>

            {/*Paragraph */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors ${
                editor?.isActive("paragraph") && !editor?.isActive("heading")
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              }`}
            >
              P
            </button>

            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/*Bold */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors ${
                editor?.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
            >
              B
            </button>

            {/* I - Italic */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 px-2 rounded text-xs font-bold transition-colors ${
                editor?.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
            >
              I
            </button>

            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("bulletList")
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              }`}
            >
              <List size={14} className="text-gray-600" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("orderedList")
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              }`}
            >
              <ListOrdered size={14} className="text-gray-600" />
            </button>
            {/* Blockquote */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-1 rounded transition-colors ${
                editor?.isActive("blockquote")
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              }`}
            >
              <Quote size={14} className="text-gray-600" />
            </button>
          </div>

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            className={`border border-t-0 rounded-b-lg px-3 py-2 text-sm min-h-50 ${
              error.body ? "border-red-400" : "border-gray-200"
            }`}
          />
          {error.body && <p className="text-xs text-red-500">{error.body}</p>}
        </div>

        {/* buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePublish}
            className="bg-white hover:bg-green-500 text-gray-500 hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 transition-colors"
          >
            {article ? "Save Changes" : "+ Publish"}
          </button>
          <button className="bg-white hover:bg-green-500 text-gray-500 hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 transition-colors">
            Save as Draft
          </button>
          <button
            onClick={() => navigate("/admin/news")}
            className="bg-white hover:bg-green-500 text-gray-500 hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Publish modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border-2 border-green-500">
            <div className="p-8 pb-0 pt-0">
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover image"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="pb-8">
                <h3 className="text-sm font-semibold text-gray-900 mt-3 mb-1">
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
                      <p className="text-xs font-medium text-gray-700">
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
                      <p className="text-xs font-medium text-gray-700">1.6K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Share2 size={11} />
                        Shares
                      </p>
                      <p className="text-xs font-medium text-gray-700">14K</p>
                    </div>
                  </div>
                </div>

                {/* Featured Player */}
                {featuredPlayer && (
                  <p className="text-xs text-gray-500 mb-4">
                    Featured Player:{" "}
                    <span className="font-medium text-gray-700">
                      {featuredPlayer}
                    </span>
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-5">
                  Are you sure you want to{" "}
                  <span className="font-semibold text-gray-900">
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
                    className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
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
