import { useNavigate } from "react-router";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useGetGalleryAdmin, useDeleteGalleryItem } from "@/hooks/useApi";
import type { GalleryImages } from "@/types/dataTypes";

function PhotoSkeleton() {
  return <div className="rounded-xl bg-gray-200 dark:bg-white/10 h-72 animate-pulse" />;
}

export default function Gallery() {
  const navigate = useNavigate();
  const { data: photos, isLoading, isError } = useGetGalleryAdmin();
  const deleteMutation = useDeleteGalleryItem();

  const [viewPhoto, setViewPhoto] = useState<GalleryImages | null>(null);
  const [deletePhoto, setDeletePhoto] = useState<GalleryImages | null>(null);

  function confirmDelete() {
    if (!deletePhoto) return;
    deleteMutation.mutate(deletePhoto.id, {
      onSuccess: () => toast.success("Photo deleted"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't delete this photo"),
    });
    setDeletePhoto(null);
  }

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
            className="flex items-center gap-0.5 bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-[14px] px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            <Plus size={10} />
            Upload Content
          </button>
        </div>

        {isError && (
          <p className="text-sm text-red-500 mb-4">Couldn't load the gallery. Please refresh the page.</p>
        )}

        {/* Photo section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <PhotoSkeleton key={i} />)
          ) : photos && photos.length > 0 ? (
            photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group rounded-xl overflow-hidden shadow-sm"
              >
                <img
                  src={photo.coverImage ?? ""}
                  alt={photo.description ?? ""}
                  className="w-full h-72 object-cover bg-gray-100 dark:bg-white/10"
                />

                {!photo.published && (
                  <span className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                    Draft
                  </span>
                )}

                {/* Caption section*/}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-green-500 via-green-500/70 to-transparent px-3 py-5">
                  <p className="text-white text-sm font-semibold">
                    {photo.headline || "Untitled"}
                  </p>
                  <p className="text-white text-xs font-light opacity-90 line-clamp-1">
                    {photo.description}
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
                    onClick={() => navigate(`/admin/gallery/edit/${photo.id}`)}
                    className="bg-white hover:bg-green-500 hover:text-white text-gray-700 text-xs font-medium px-12 py-1.5 rounded-lg shadow transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletePhoto(photo)}
                    className="bg-white hover:bg-red-500 hover:text-white text-red-500 text-xs font-light px-12 py-1.5 rounded-lg shadow transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 col-span-full">
              No photos yet — click "Upload Content" to add the first one.
            </p>
          )}
        </div>
      </div>

      {/* View Section */}
      {viewPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-white/15">
            <img
              src={viewPhoto.coverImage ?? ""}
              alt={viewPhoto.headline ?? ""}
              className="w-full h-64 object-cover bg-gray-100 dark:bg-white/10"
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {viewPhoto.headline || "Untitled"}
                </h3>
                <button onClick={() => setViewPhoto(null)}>
                  <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-2">{viewPhoto.description}</p>
              {viewPhoto.instaUrl && (
                <a
                  href={viewPhoto.instaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-green-600 dark:text-green-400 hover:underline mb-4 block"
                >
                  View on Instagram →
                </a>
              )}
              <button
                onClick={() => setViewPhoto(null)}
                className="bg-white dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-200 dark:border-white/15 text-sm font-medium px-6 py-2 rounded-lg transition-colors mt-2"
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
              src={deletePhoto.coverImage ?? ""}
              alt={deletePhoto.headline ?? ""}
              className="w-full h-64 object-cover bg-gray-100 dark:bg-white/10"
            />
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {deletePhoto.headline || "Untitled"}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {deletePhoto.description}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">delete</span> this
                photo?
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
