import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetGalleryImages } from "@/hooks/useApi";

const positions = [
  { top: "5%", left: "0%", width: "18%", height: "28%", rotate: "-3deg" },
  { top: "0%", left: "20%", width: "15%", height: "22%", rotate: "2deg" },
  { top: "2%", left: "37%", width: "20%", height: "26%", rotate: "-1deg" },
  { top: "0%", right: "18%", width: "16%", height: "24%", rotate: "2deg" },
  { top: "0%", right: "0%", width: "16%", height: "22%", rotate: "-2deg" },
  { top: "35%", left: "0%", width: "16%", height: "26%", rotate: "2deg" },
  { top: "30%", left: "18%", width: "18%", height: "28%", rotate: "-2deg" },
  { top: "32%", right: "16%", width: "16%", height: "24%", rotate: "1deg" },
  { top: "28%", right: "0%", width: "14%", height: "22%", rotate: "-1deg" },
  { top: "60%", left: "2%", width: "14%", height: "22%", rotate: "-2deg" },
  { top: "58%", left: "18%", width: "16%", height: "24%", rotate: "2deg" },
  { top: "62%", right: "0%", width: "14%", height: "20%", rotate: "-1deg" },
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data: galleryImages = [],
    isLoading,
    isError,
  } = useGetGalleryImages();

  if (isLoading) {
    return <div>Loading gallery...</div>;
  }

  if (isError) {
    return <div>Failed to load gallery.</div>;
  }

  if (galleryImages.length === 0) {
    return <div>No gallery images available.</div>;
  }


  function handlePrevious() {
    setActiveIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  }

  function handleNext() {
    setActiveIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  }

  function getCollagePhotos() {
    const total = galleryImages.length;
    const collagePhotos = [];
    for (let i = 0; i < 12; i++) {
      const index = (activeIndex + i) % total;
      collagePhotos.push({ ...galleryImages[index], originalIndex: index });
    }
    return collagePhotos;
  }

  const collagePhotos = getCollagePhotos();

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden flex justify-center">
      <div className="max-w-full px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-10 relative z-20">
          <span className="inline-flex items-center gap-1.5 border bg-[#00A553] border-green-500 text-green-300 text-xs px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Visual Archive
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase mb-2">
            Gallery
          </h1>
          <p className="text-gray-400 text-sm max-w-sm">
            Moments from training, transfers, and tournaments.
            <br />
            Capturing the journey from Lagos to the world.
          </p>
        </div>

        {/*gallery */}
        <div className="relative h-[280px] sm:h-[380px] md:h-[480px] mb-8 md:mb-10">
          {collagePhotos.map((photo, i) => {
            const isActive = i === 0;
            const pos = positions[i];

            return (
              <div
                key={`${photo.id}-${i}`}
                onClick={() => setActiveIndex(photo.originalIndex)}
                className="absolute cursor-pointer overflow-hidden transition-all duration-500 rounded-lg"
                style={
                  isActive
                    ? {
                      top: "50%",
                      left: "50%",
                      width: "50%",
                      height: "55%",
                      transform: "translate(-50%, -50%) rotate(0deg)",
                      zIndex: 10,
                    }
                    : {
                      top: pos.top,
                      left: pos.left,
                      right: pos.right,
                      width: pos.width,
                      height: pos.height,
                      transform: `rotate(${pos.rotate})`,
                      zIndex: 1,
                      opacity: 0.7,
                    }
                }
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* description and Arrows */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mb-6 md:mb-8">
          <button
            onClick={handlePrevious}
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="text-center">
            <p className="text-white text-xs md:text-sm font-semibold">
              {galleryImages[activeIndex].title}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {galleryImages[activeIndex].description}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div
          className="flex gap-2 md:gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {galleryImages.map((photo, i) => (
            <div
              key={photo.id}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-14 h-10 md:w-20 md:h-14 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${i === activeIndex
                  ? "border-2 border-white opacity-100"
                  : "border-2 border-transparent opacity-50 hover:opacity-80"
                }`}
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
