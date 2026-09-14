import { useGetGalleryImages } from "@/hooks/useApi";
import PageWrapper from "@/components/page-wrapper";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";

// Bento span patterns cycled across however many photos come back from the API
const SPAN_PATTERNS = [
  "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2",
  "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
];

const SKELETON_COUNT = 8;

// Mirrors InteractiveBentoGallery's own grid classes so the skeleton doesn't
// jump/reflow once real images swap in.
function GallerySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[60px] animate-pulse">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <div
            key={index}
            className={`rounded-xl bg-gray-200 dark:bg-gray-800 ${SPAN_PATTERNS[index % SPAN_PATTERNS.length]}`}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryHeader() {
  return (
    <div className="mb-8 md:mb-10 relative z-20">
      <span className="inline-flex items-center gap-1.5 border bg-[#00A553] border-green-500 text-green-100 dark:text-green-300 text-xs px-3 py-1 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Visual Archive
      </span>
      <h1 className="text-3xl md:text-5xl font-black text-[#060A0F] dark:text-white uppercase mb-2">
        Gallery
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
        Moments from training, transfers, and tournaments.
        <br />
        Capturing the journey from Lagos to the world.
      </p>
    </div>
  );
}

export default function Gallery() {
  const {
    data: galleryImages = [],
    isLoading,
    isError,
  } = useGetGalleryImages();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden flex justify-center">
        <PageWrapper className=" p-[20px]">
          <GalleryHeader />
          <GallerySkeleton />
        </PageWrapper>
      </main>
    );
  }

  if (isError) {
    return <div className="min-h-screen bg-white dark:bg-black text-[#060A0F] dark:text-white p-6">Failed to load gallery.</div>;
  }

  if (galleryImages.length === 0) {
    return <div className="min-h-screen bg-white dark:bg-black text-[#060A0F] dark:text-white p-6">No gallery images available.</div>;
  }

  const mediaItems = galleryImages.map((photo, index) => ({
    id: photo.id,
    type: "image",
    title: photo.headline ?? "",
    desc: photo.description ?? "",
    url: photo.coverImage ?? "",
    span: SPAN_PATTERNS[index % SPAN_PATTERNS.length],
  }));

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden flex justify-center">
      <PageWrapper className=" p-[20px]">
        <GalleryHeader />

        {/* Interactive image/video display */}
        <InteractiveBentoGallery mediaItems={mediaItems} />
      </PageWrapper>
    </main>
  );
}
