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

// Reframes a Cloudinary image so the subject's face is centered and safely
// inside the frame *before* it's cropped to whatever aspect ratio a given
// bento tile ends up needing. This is what actually fixes clipped
// heads/faces: instead of letting CSS object-cover crop a face-agnostic
// rectangle (which cuts top/bottom on tall images and can slice through a
// face), Cloudinary detects the face and delivers an image already framed
// around it, at a portrait aspect ratio. Because the source is already
// taller than it is wide, any further object-cover cropping in a wider
// grid tile only trims the sides — which almost never touches a face —
// instead of the top or bottom.
// Falls back to the original URL untouched for non-Cloudinary sources
// (e.g. the test video URL), where MediaItemType.focal can be used instead.
function withFaceCrop(url: string, aspect = "4:5") {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", `/upload/c_fill,g_auto:face,ar_${aspect}/`);
}

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
    url: withFaceCrop(photo.coverImage ?? ""),
    // Full, uncropped image — used only by the modal so clicking a photo
    // always shows the whole thing regardless of the face-focused crop
    // used for the grid thumbnail.
    fullUrl: photo.coverImage ?? "",
    span: SPAN_PATTERNS[index % SPAN_PATTERNS.length],
    // Manual override for the rare photo the auto face-crop gets wrong —
    // e.g. photo.focal: "50% 10%". Leave unset to use the component's
    // top-biased default.
    focal: photo.focal,
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