import { useState } from "react";
import { Plus, X, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetStaffAdmin,
  useCreateStaffMember,
  useUpdateStaffMember,
  useDeleteStaffMember,
} from "@/hooks/useApi";
import type { StaffMember } from "@/types/dataTypes";
import noProfilePhoto from "@/assets/no profile photo.jpg";

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

export default function StaffAdmin() {
  const { data: staff, isLoading, isError } = useGetStaffAdmin();
  const createMutation = useCreateStaffMember();
  const updateMutation = useUpdateStaffMember();
  const deleteMutation = useDeleteStaffMember();

  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [order, setOrder] = useState("0");
  const [verified, setVerified] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openCreateForm() {
    setEditingMember(null);
    setName("");
    setRole("");
    setOrder(String((staff?.length ?? 0)));
    setVerified(true);
    setPhoto(null);
    setPhotoFile(null);
    setError("");
    setShowForm(true);
  }

  function openEditForm(member: StaffMember) {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setOrder(String(member.order));
    setVerified(member.verified);
    setPhoto(member.photo);
    setPhotoFile(null);
    setError("");
    setShowForm(true);
  }

  async function handleSave(publishTarget: boolean) {
    if (!name.trim() || !role.trim()) {
      setError("Name and role are both required");
      return;
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      role: role.trim(),
      verified,
      order: order.trim() === "" ? 0 : Number(order),
      isDraft: !publishTarget,
    };
    if (photoFile) {
      payload.photo = photoFile;
    }

    try {
      if (editingMember) {
        await updateMutation.mutateAsync({ id: editingMember.id, data: payload });
        toast.success("Staff member saved");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(publishTarget ? "Staff member published" : "Saved as draft");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => toast.success("Staff member deleted"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't delete this staff member"),
    });
    setDeleteTarget(null);
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-500 mb-1">Content Management</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">OUR STAFF</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            The team shown on the About page — photo, name, and role
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-0.5 bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-[14px] px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          <Plus size={10} />
          New Staff Member
        </button>
      </div>

      {isError && (
        <p className="text-sm text-red-500 mb-4">Couldn't load staff. Please refresh the page.</p>
      )}

      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Photo</th>
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Role</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
            ) : !staff || staff.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                  No staff members yet — click "New Staff Member" to add the first one.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <img
                      src={member.photo || noProfilePhoto}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover bg-gray-100 dark:bg-white/10"
                    />
                  </td>
                  <td className="px-5 py-4 text-gray-900 dark:text-white font-medium">{member.name}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{member.role}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        member.published
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {member.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(member)}
                        className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(member)}
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
                  {editingMember ? "Edit Staff Member" : "New Staff Member"}
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Photo</label>
                  <label className="border border-gray-200 dark:border-white/15 rounded-lg h-32 w-32 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors overflow-hidden mx-auto">
                    {photo ? (
                      <img src={photo} className="h-full w-full object-cover" alt="" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <ImagePlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        <p className="text-[10px] text-gray-400">Upload Photo</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotoFile(file);
                          setPhoto(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dominic Egbukwu"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error ? "border-red-400" : "border-gray-200 dark:border-white/15 hover:border-green-400"}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Role</label>
                  <input
                    type="text"
                    placeholder="e.g. C.E.O/Chairman"
                    value={role}
                    onChange={(e) => { setRole(e.target.value); setError(""); }}
                    className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error ? "border-red-400" : "border-gray-200 dark:border-white/15 hover:border-green-400"}`}
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Display Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="border border-gray-200 dark:border-white/15 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 py-2 px-3 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 justify-end">
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 py-2 px-3 border border-gray-200 dark:border-white/15 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={verified}
                        onChange={(e) => setVerified(e.target.checked)}
                        className="accent-green-500"
                      />
                      Verified badge
                    </label>
                  </div>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              <div className="flex items-center gap-3 flex-wrap mt-6">
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving…" : editingMember ? "Save Changes" : "+ Publish"}
                </button>
                {!editingMember && (
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
                staff member?
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
