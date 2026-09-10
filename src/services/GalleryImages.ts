import type { GalleryImages } from "@/types/dataTypes";

export const galleryImages: GalleryImages[] = [
  {
    id: "1",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766657/gallerytest1_xnstpy.png",
    title: "Day Out With the Agents",
    description: "Capturing memorable moments with the team.",
  },
  {
    id: "2",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766656/galleryTest3_rwtf2s.png",
    title: "Training Session",
    description: "Preparing for the upcoming fixtures.",
  },
  {
    id: "3",
    type: "video",
    // NOTE: this is a YouTube watch URL, not a direct video file.
    // The gallery's <video><source src=.../></video> tag needs a direct
    // .mp4 (or similar) URL to actually play — swap this for a hosted
    // video file, or handle "video" items with a YouTube embed instead.
    // link: "https://www.youtube.com/watch?t=216&v=9ZESq6SRQtg",
    // link: "https://placeholdervideo.dev/1280x720",
    link: "https://lorem.video/720p",
    title: "League Match",
    description: "Competing with passion and determination.",
  },
  {
    id: "4",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766656/galleryTest3_rwtf2s.png",
    title: "Victory Celebration",
    description: "Celebrating another successful performance.",
  },
  {
    id: "5",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766657/gallerytest1_xnstpy.png",
    title: "Youth Development",
    description: "Building the future of football.",
  },
  {
    id: "6",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766664/galleryTest2_zsnszn.png",
    title: "Fitness Camp",
    description: "Improving endurance and strength.",
  },
  {
    id: "7",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766657/gallerytest1_xnstpy.png",
    title: "Community Outreach",
    description: "Giving back through sports.",
  },
  {
    id: "8",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766664/galleryTest2_zsnszn.png",
    title: "Media Day",
    description: "Behind-the-scenes content creation.",
  },
  {
    id: "9",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766656/galleryTest3_rwtf2s.png",
    title: "Academy Showcase",
    description: "Young talents displaying their skills.",
  },
  {
    id: "10",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766657/gallerytest1_xnstpy.png",
    title: "Championship Finals",
    description: "Competing at the highest level.",
  },
  {
    id: "11",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766664/galleryTest2_zsnszn.png",
    title: "Awards Ceremony",
    description: "Recognizing outstanding performances.",
  },
  {
    id: "12",
    type: "image",
    link: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766656/galleryTest3_rwtf2s.png",
    title: "Season Highlights",
    description: "Looking back at unforgettable moments.",
  },
]


// export const fetchGalleryImages = async (): Promise<GalleryImages[]> => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(galleryImages)
//         }, 1000)
//     })
// }

export const fetchGalleryImages = async (): Promise<GalleryImages[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = false;

      if (shouldFail) {
        reject(new Error("Failed to fetch Images"));
        return;
      }

      resolve(galleryImages);
    }, 1000);
  });
};