import { useState } from "react";
import { Plus, X, ImagePlus, Award as AwardIcon } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetAwardsAdmin,
  useCreateAward,
  useUpdateAward,
  useDeleteAward,
} from "@/hooks/useApi";
import type { Award } from "@/types/dataTypes";

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-3 w-40 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
      <td className="px-5 py-4"><div className="h-6 w-24 rounded bg-gray-200 dark:bg-white/10" /></td>
    </tr>
  );
}

export default function AwardsAdmin() {
  const { data: awards, isLoading, isError } = useGetAwardsAdmin();
  const createMutation = useCreateAward();
  const updateMutation = useUpdateAward();
  const deleteMutation = useDeleteAward();

  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [order, setOrder] = useState("0");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Award | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openCreateForm() {
    setEditingAward(null);
    setName("");
    setSubtitle("");
    setOrder(String((awards?.length ?? 0)));
    setImage(null);
    setImageFile(null);
    setError("");
    setShowForm(true);
  }

  function openEditForm(award: Award) {
    setEditingAward(award);
    setName(award.name);
    setSubtitle(award.subtitle);
    setOrder(String(award.order));
    setImage(award.image);
    setImageFile(null);
    setError("");
    setShowForm(true);
  }

  async function handleSave(publishTarget: boolean) {
    if (!name.trim() || !subtitle.trim()) {
      setError("Name and subtitle are both required");
      return;
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      subtitle: subtitle.trim(),
      order: order.trim() === "" ? 0 : Number(order),
      isDraft: !publishTarget,
    };
    if (imageFile) {
      payload.image = imageFile;
    }

    try {
      if (editingAward) {
        await updateMutation.mutateAsync({ id: editingAward.id, data: payload });
        toast.success("Certification saved");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(publishTarget ? "Certification published" : "Saved as draft");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => toast.success("Certification deleted"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't delete this certification"),
    });
    setDeleteTarget(null);
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-500 mb-1">Content Management</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AWARD &amp; CERTIFICATION</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            The recognitions shown on the About page — image, name, and subtitle
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-0.5 bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-[14px] px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          <Plus size={10} />
          New Certification
        </button>
      </div>

      {isError && (
        <p className="text-sm text-red-500 mb-4">Couldn't load certifications. Please refresh the page.</p>
      )}

      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Image</th>
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Subtitle</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
            ) : !awards || awards.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                  No certifications yet — click "New Certification" to add the first one.
                </td>
              </tr>
            ) : (
              awards.map((award) => (
                <tr key={award.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    {award.image ? (
                      <img
                        src={award.image}
                        alt={award.name}
                        className="w-10 h-10 rounded-full object-cover bg-gray-100 dark:bg-white/10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-white/10 flex items-center justify-center">
                        <AwardIcon className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-900 dark:text-white font-medium">{award.name}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{award.subtitle}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        award.published
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {award.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(award)}
                        className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(award)}
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
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-white/15 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {editingAward ? "Edit Certification" : "New Certification"}
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Image</label>
                  <label className="border border-gray-200 dark:border-white/15 rounded-lg h-32 w-32 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors overflow-hidden mx-auto">
                    {image ? (
                      <img src={image} className="h-full w-full object-cover" alt="" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <ImagePlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        <p className="text-[10px] text-gray-400">Upload Image</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          setImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. CAC Certified"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error ? "border-red-400" : "border-gray-200 dark:border-white/15 hover:border-green-400"}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. RC 788922 · 2022"
                    value={subtitle}
                    onChange={(e) => { setSubtitle(e.target.value); setError(""); }}
                    className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error ? "border-red-400" : "border-gray-200 dark:border-white/15 hover:border-green-400"}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="border border-gray-200 dark:border-white/15 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 py-2 px-3 text-sm"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              <div className="flex items-center gap-3 flex-wrap mt-6">
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving…" : editingAward ? "Save Changes" : "+ Publish"}
                </button>
                {!editingAward && (
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
                {deleteTarget.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">delete</span> this
                certification?
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
