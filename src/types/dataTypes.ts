

export type Player = {
  _id: string;
  playerPhoto: string,
  playerName: string,
  playerFullName: string,
  DOB: string,
  nationality: string,
  height: number,
  preferredFoot: string,
  ageGroup: "U-17" | "U-21" | "U-23",
  status: "Free" | "Transferred" | "Negotiation",
  position: string,
  goals: number,
  assists: number,
  rating: number,
  currentClubName: string,
  currentClubLogo: any,
  playerHistory: string,
  playerAppearance: number
  isFeatured:boolean
  isDraft:boolean
}

export type NewsCategory = 'TRANSFER' | 'ACADEMY' | 'ANNOUNCEMENT';

// export interface Admin {
//   id: string;
//   name: string;
//   avatarUrl?: string;
// }

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  headline: string;
  excerpt:string;
  subtitle: string | null;
  body: string;
  coverImage: string;
  author: string;
  date: string;
  published:boolean
  authorPhoto: string
  createdAt: string
}

// export interface Article {
//   id: number;
//   title: string;
//   subtitle: string;
//   excerpt: string;
//   author: string;
//   date: string;
//   readTime: string;
//   link: string;
//   authorPhoto: string;
//   articlePhoto: string;
// }

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  club: string;
  country: string;
}

export interface Headlines {
  id: string;
  category: string;
  headline: string;
}

export interface GalleryImages {
 id: number;
 image: string;
 title: string;
 description: string;
}
export type QuickUpdateCategory = 'TRANSFER' | 'ACADEMY' | 'ANNOUNCEMENT' | 'MILESTONE' | 'INTERNATIONAL';

export interface QuickUpdate {
  id: string;
  headline: string;
  category: QuickUpdateCategory;
  createdAt: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}
