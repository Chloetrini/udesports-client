import { useNavigate, useParams } from "react-router";
import { ArrowLeft, List, ListOrdered, Quote, ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  useGetSingleNewsArticle,
  useGetPlayersAdmin,
  useCreateNewsArticle,
  useUpdateNewsArticle,
} from "@/hooks/useApi";
import type { NewsArticle, NewsCategory } from "@/types/dataTypes";

const CATEGORY_OPTIONS: { value: NewsCategory; label: string }[] = [
  { value: "TRANSFER", label: "Transfer" },
  { value: "ACADEMY", label: "Academy" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
];

export default function NewsArticleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { data: article, isLoading: articleLoading } = useGetSingleNewsArticle(id);
  const { data: players } = useGetPlayersAdmin();
  const createMutation = useCreateNewsArticle();
  const updateMutation = useUpdateNewsArticle();

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState<NewsCategory>("TRANSFER");
  const [featuredPlayerId, setFeaturedPlayerId] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // Sync the form once the article arrives — adjusted during render (same
  // pattern used on the gallery/player edit forms) rather than in an effect,
  // so it happens in the same commit instead of an extra render pass.
  const [syncedArticle, setSyncedArticle] = useState<NewsArticle | undefined>(undefined);
  if (article && article !== syncedArticle) {
    setSyncedArticle(article);
    setHeadline(article.headline);
    setCategory(article.category);
    setSummary(article.summary ?? "");
    setFeaturedPlayerId(article.featuredPlayerId ?? "");
    setCoverImage(article.coverImage ?? null);
  }

  // The editor instance isn't ready on the very first render, and setting
  // its content isn't a React state update, so this is a plain effect (not
  // the render-time pattern above) keyed on the article and the editor.
  useEffect(() => {
    if (article && editor) {
      editor.commands.setContent(article.body ?? "");
    }
  }, [article, editor]);

  function validate() {
    const newError: Record<string, string> = {};
    if (!headline.trim()) newError.headline = "Headline is required";
    if (!summary.trim()) newError.summary = "Article summary is required";
    const bodyText = editor?.getText().trim();
    if (!bodyText) newError.body = "Article body is required";

    return newError;
  }

  async function handleSave(publishTarget: boolean) {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    const payload: Record<string, unknown> = {
      headline: headline.trim(),
      category,
      summary: summary.trim(),
      body: editor?.getHTML() ?? "",
      featuredPlayerId: featuredPlayerId || undefined,
      isDraft: !publishTarget,
    };
    if (coverImageFile) payload.coverImage = coverImageFile;

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      toast.success(publishTarget ? "Article published" : "Saved as draft");
      navigate("/admin/news");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && articleLoading) {
    return <div className="p-6 text-sm text-gray-400">Loading…</div>;
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
            <span className="text-gray-900 dark:text-white">›</span>{" "}
            <strong className="text-gray-900 dark:text-white">{isEditMode ? "EDIT ARTICLE" : "NEWS ARTICLE"}</strong>
            {isEditMode && article && !article.published && (
              <span className="ml-3 align-middle text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                Draft — not visible on the public site
              </span>
            )}
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
              className={`border-2 px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${
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
              onChange={(e) => setCategory(e.target.value as NewsCategory)}
              className="border bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:border-green-500"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Featured Player <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <select
              value={featuredPlayerId}
              onChange={(e) => setFeaturedPlayerId(e.target.value)}
              className="border bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/15 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-500"
            >
              <option value="">None</option>
              {players?.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.playerFullName || player.playerName}
                </option>
              ))}
            </select>
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
              className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 resize-none ${
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
                  if (file) {
                    setCoverImageFile(file);
                    setCoverImage(URL.createObjectURL(file));
                  }
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
          <div className="border border-gray-200 dark:border-white/15 rounded-t-lg px-3 py-2 rounded-lg flex items-center gap-2 flex-wrap bg-gray-50 dark:bg-white/5">
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
            className={`border border-t-0 rounded-b-lg px-3 py-2 rounded-lg text-sm min-h-50 bg-white dark:bg-white/5 text-gray-900 dark:text-white [&_.tiptap]:outline-none ${
              error.body ? "border-red-400" : "border-gray-200 dark:border-white/15"
            }`}
          />
          {error.body && <p className="text-xs text-red-500">{error.body}</p>}
        </div>

        {/* buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving…" : isEditMode ? "Save Changes" : "+ Publish"}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="bg-white dark:bg-white/5 hover:bg-green-500 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-black text-sm font-medium px-6 py-2 rounded-lg border border-gray-300 dark:border-white/15 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
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
    </div>
  );
}
