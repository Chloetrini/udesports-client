import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetHeadlinesAdmin,
  useCreateHeadline,
  useUpdateHeadline,
  useDeleteHeadline,
} from "@/hooks/useApi";
import type { Headlines, HeadlineCategory } from "@/types/dataTypes";
import { formatDate } from "@/lib/utils";

const CATEGORY_LABEL: Record<HeadlineCategory, string> = {
  transfer: "Transfer",
  negotiation: "Negotiation",
  academy: "Academy",
  announcement: "Announcement",
};

const CATEGORY_STYLE: Record<HeadlineCategory, string> = {
  transfer: "bg-amber-100 text-amber-700",
  negotiation: "bg-blue-100 text-blue-700",
  academy: "bg-purple-100 text-purple-700",
  announcement: "bg-[#00D46A4D] text-[#00A553]",
};

const CATEGORIES = Object.keys(CATEGORY_LABEL) as HeadlineCategory[];

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-3 w-64 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-6 w-24 rounded bg-gray-200 dark:bg-white/10" /></td>
    </tr>
  );
}

export default function HeadlinesAdmin() {
  const { data: headlines, isLoading, isError } = useGetHeadlinesAdmin();
  const createMutation = useCreateHeadline();
  const updateMutation = useUpdateHeadline();
  const deleteMutation = useDeleteHeadline();

  const [editingItem, setEditingItem] = useState<Headlines | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [headlineText, setHeadlineText] = useState("");
  const [category, setCategory] = useState<HeadlineCategory>("transfer");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Headlines | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openCreateForm() {
    setEditingItem(null);
    setHeadlineText("");
    setCategory("transfer");
    setError("");
    setShowForm(true);
  }

  function openEditForm(item: Headlines) {
    setEditingItem(item);
    setHeadlineText(item.headline);
    setCategory(item.category);
    setError("");
    setShowForm(true);
  }

  async function handleSave(publishTarget: boolean) {
    if (!headlineText.trim()) {
      setError("Headline is required");
      return;
    }

    const payload = {
      headline: headlineText.trim(),
      category,
      isDraft: !publishTarget,
    };

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
        toast.success("Headline saved");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(publishTarget ? "Headline published" : "Saved as draft");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => toast.success("Headline deleted"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't delete this headline"),
    });
    setDeleteTarget(null);
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-500 mb-1">Content Management</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TICKER HEADLINES</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            The scrolling bar under the navbar (Transfer / Negotiations / Academy)
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-0.5 bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-[14px] px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          <Plus size={10} />
          New Headline
        </button>
      </div>

      {isError && (
        <p className="text-sm text-red-500 mb-4">Couldn't load headlines. Please refresh the page.</p>
      )}

      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Headline</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
            ) : !headlines || headlines.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                  No ticker headlines yet — click "New Headline" to add the first one.
                </td>
              </tr>
            ) : (
              headlines.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-gray-900 dark:text-white font-medium">{item.headline}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_STYLE[item.category]}`}>
                      {CATEGORY_LABEL[item.category]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        item.published
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{formatDate(item.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(item)}
                        className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
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

      {/* Create/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-white/15">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {editingItem ? "Edit Headline" : "New Headline"}
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. K. Omeruo transfer confirmed — Leganés"
                    value={headlineText}
                    onChange={(e) => { setHeadlineText(e.target.value); setError(""); }}
                    className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error ? "border-red-400" : "border-gray-200 dark:border-white/15 hover:border-green-400"}`}
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HeadlineCategory)}
                    className="border border-gray-200 dark:border-white/15 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 py-2 px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap mt-6">
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving…" : editingItem ? "Save Changes" : "+ Publish"}
                </button>
                {!editingItem && (
                  <button
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                    className="bg-gray-200 dark:bg-white/10 hover:bg-green-500 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 dark:bg-white/10 hover:bg-green-500 hover:text-white text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-md overflow-hidden border-2 border-red-500">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {deleteTarget.headline}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">delete</span> this
                headline?
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
                  onClick={() => setDeleteTarget(null)}
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

