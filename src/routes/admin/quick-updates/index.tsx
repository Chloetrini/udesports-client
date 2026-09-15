import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetQuickUpdatesAdmin,
  useCreateQuickUpdate,
  useUpdateQuickUpdate,
  useDeleteQuickUpdate,
} from "@/hooks/useApi";
import type { QuickUpdate, QuickUpdateCategory } from "@/types/dataTypes";
import { formatDate } from "@/lib/utils";

const CATEGORY_LABEL: Record<QuickUpdateCategory, string> = {
  TRANSFER: "Transfer",
  ACADEMY: "Academy",
  ANNOUNCEMENT: "Announcement",
  MILESTONE: "Milestone",
  INTERNATIONAL: "International",
};

const CATEGORY_STYLE: Record<QuickUpdateCategory, string> = {
  TRANSFER: "bg-amber-100 text-amber-700",
  ACADEMY: "bg-blue-100 text-blue-700",
  ANNOUNCEMENT: "bg-emerald-100 text-emerald-700",
  MILESTONE: "bg-[#00D46A4D] text-[#00A553]",
  INTERNATIONAL: "bg-purple-100 text-purple-700",
};

const CATEGORIES = Object.keys(CATEGORY_LABEL) as QuickUpdateCategory[];

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-3 w-56 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-6 w-24 rounded bg-gray-200 dark:bg-white/10" /></td>
    </tr>
  );
}

export default function QuickUpdatesAdmin() {
  const { data: updates, isLoading, isError } = useGetQuickUpdatesAdmin();
  const createMutation = useCreateQuickUpdate();
  const updateMutation = useUpdateQuickUpdate();
  const deleteMutation = useDeleteQuickUpdate();

  const [editingUpdate, setEditingUpdate] = useState<QuickUpdate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState<QuickUpdateCategory>("TRANSFER");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<QuickUpdate | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openCreateForm() {
    setEditingUpdate(null);
    setHeadline("");
    setCategory("TRANSFER");
    setError("");
    setShowForm(true);
  }

  function openEditForm(update: QuickUpdate) {
    setEditingUpdate(update);
    setHeadline(update.headline);
    setCategory(update.category);
    setError("");
    setShowForm(true);
  }

  async function handleSave(publishTarget: boolean) {
    if (!headline.trim()) {
      setError("Headline is required");
      return;
    }

    const payload = {
      headline: headline.trim(),
      category,
      isDraft: !publishTarget,
    };

    try {
      if (editingUpdate) {
        await updateMutation.mutateAsync({ id: editingUpdate.id, data: payload });
        toast.success("Quick update saved");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(publishTarget ? "Quick update published" : "Saved as draft");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => toast.success("Quick update deleted"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't delete this update"),
    });
    setDeleteTarget(null);
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-500 mb-1">Content Management</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QUICK UPDATES</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Short, dated blurbs shown in the News page sidebar
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-0.5 bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-[14px] px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          <Plus size={10} />
          New Update
        </button>
      </div>

      {isError && (
        <p className="text-sm text-red-500 mb-4">Couldn't load quick updates. Please refresh the page.</p>
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
            ) : !updates || updates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                  No quick updates yet — click "New Update" to add the first one.
                </td>
              </tr>
            ) : (
              updates.map((update) => (
                <tr key={update.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-gray-900 dark:text-white font-medium">{update.headline}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_STYLE[update.category]}`}>
                      {CATEGORY_LABEL[update.category]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        update.published
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {update.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{formatDate(update.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(update)}
                        className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(update)}
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
                  {editingUpdate ? "Edit Quick Update" : "New Quick Update"}
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
                    placeholder="Input headline"
                    value={headline}
                    onChange={(e) => { setHeadline(e.target.value); setError(""); }}
                    className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error ? "border-red-400" : "border-gray-200 dark:border-white/15 hover:border-green-400"}`}
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as QuickUpdateCategory)}
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
                  {isSaving ? "Saving…" : editingUpdate ? "Save Changes" : "+ Publish"}
                </button>
                {!editingUpdate && (
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
                quick update?
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

