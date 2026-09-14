

// Wire-format status, matching the backend's PlayerStatus enum exactly.
// Display labels ("Free" / "Transferred" / "Negotiation") live in
// STATUS_LABEL / STATUS_STYLE (src/lib/playerStatus.ts) — same pattern
// already used for NewsCategory below.
export type PlayerStatus = "FREE" | "TRANSFERRED" | "NEGOTIATION" | "RETIRED";

export type Player = {
  id: string;
  playerPhoto: string | null,
  playerName: string,
  playerFullName: string | null,
  DOB: string,
  nationality: string,
  height: number | null,
  preferredFoot: string,
  ageGroup: "U-17" | "U-21" | "U-23" | "Professional",
  status: PlayerStatus,
  position: string,
  goals: number,
  assists: number,
  // Goalkeeper-specific stats — shown instead of goals/assists on the card
  // when position === "GK". Every player has these columns (default 0),
  // the frontend just decides which pair to display.
  saves: number,
  cleanSheets: number,
  rating: number | null,
  currentClubName: string | null,
  currentClubLogo: string | null,
  newClubName: string | null,
  newClubLogo: string | null,
  playerHistory: string | null,
  playerAppearance: number
  isFeatured:boolean
}

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "SUB_ADMIN";

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

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  verified: boolean;
}

export interface Award {
  id: number;
  name: string;
  subtitle: string;
}

export interface Headlines {
  id: string;
  category: string;
  headline: string;
}

export interface GalleryImages {
 id: string;
 type: "image" | "video";
 link: string;
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


