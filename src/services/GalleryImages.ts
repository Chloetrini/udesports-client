import type { GalleryImages } from "@/types/dataTypes";

export const galleryImages: GalleryImages[] = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766657/gallerytest1_xnstpy.png",
    title: "Day Out With the Agents",
    description: "Capturing memorable moments with the team.",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766656/galleryTest3_rwtf2s.png",
    title: "Training Session",
    description: "Preparing for the upcoming fixtures.",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766664/galleryTest2_zsnszn.png",
    title: "League Match",
    description: "Competing with passion and determination.",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766656/galleryTest3_rwtf2s.png",
    title: "Victory Celebration",
    description: "Celebrating another successful performance.",
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766657/gallerytest1_xnstpy.png",
    title: "Youth Development",
    description: "Building the future of football.",
  },
  {
    id: 6,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766664/galleryTest2_zsnszn.png",
    title: "Fitness Camp",
    description: "Improving endurance and strength.",
  },
  {
    id: 7,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766657/gallerytest1_xnstpy.png",
    title: "Community Outreach",
    description: "Giving back through sports.",
  },
  {
    id: 8,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766664/galleryTest2_zsnszn.png",
    title: "Media Day",
    description: "Behind-the-scenes content creation.",
  },
  {
    id: 9,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766656/galleryTest3_rwtf2s.png",
    title: "Academy Showcase",
    description: "Young talents displaying their skills.",
  },
  {
    id: 10,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766657/gallerytest1_xnstpy.png",
    title: "Championship Finals",
    description: "Competing at the highest level.",
  },
  {
    id: 11,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766664/galleryTest2_zsnszn.png",
    title: "Awards Ceremony",
    description: "Recognizing outstanding performances.",
  },
  {
    id: 12,
    image: "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1785766656/galleryTest3_rwtf2s.png",
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