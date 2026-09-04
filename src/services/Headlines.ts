import type { Headlines } from "@/types/dataTypes";

const headlines: Headlines[] = [
  {
    id: "q1",
    category: "announcement",
    headline: "UdeSport Announces New Player Partnership",
  },
  {
    id: "q2",
    category: "academy",
    headline: "UdeSport Academy Welcomes New Young Talents",
  },
  {
    id: "q3",
    category: "negotiation",
    headline: "Club Opens Talks for UdeSport Midfielder",
  },
  {
    id: "q4",
    category: "announcement",
    headline: "UdeSport Confirms Player Transfer Agreement",
  },
  {
    id: "q5",
    category: "negotiation",
    headline: "European Club Enters Talks for Rising Forward",
  },
];

// export const fetchAllHeadlines = async (): Promise<Headlines[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(headlines);
//     }, 1000);
//   });
// };

export const fetchAllHeadlines = async (): Promise<Headlines[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = false;

      if (shouldFail) {
        reject(new Error("Failed to fetch headlines"));
        return;
      }

      resolve(headlines);
    }, 1000);
  });
};