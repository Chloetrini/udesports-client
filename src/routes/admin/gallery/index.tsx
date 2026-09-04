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
            <h1 className="text-2xl font-bold text-gray-900">GALLERY</h1>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200">
            <img
              src={viewPhoto.image}
              alt={viewPhoto.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {viewPhoto.title}
                </h3>
                <button onClick={() => setViewPhoto(null)}>
                  <X size={18} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-6">{viewPhoto.caption}</p>
              <button
                onClick={() => setViewPhoto(null)}
                className="bg-white hover:bg-gray-200 text-gray-600 hover:text-gray-800 border border-gray-200 text-sm font-medium px-6 py-2 rounded-lg transition-colors"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border-2 border-red-500">
            <img
              src={deletePhoto.image}
              alt={deletePhoto.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {deletePhoto.title}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {deletePhoto.caption}
              </p>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold text-gray-900">delete</span> this
                photo?
              </p>
              <div className="flex items-center gap-3">
                <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-10 py-1.5 rounded-lg transition-colors">
                  Delete
                </button>
                <button
                  onClick={() => setDeletePhoto(null)}
                  className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium px-10 py-1.5 rounded-lg transition-colors"
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
