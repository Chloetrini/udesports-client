

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
  // previousClubName/Logo: the club a player left — set only when a
  // transfer actually happened, left blank for a fresh signing.
  // currentClubName/Logo: the club a player is at right now — always the
  // primary field, shown on every player card/detail page.
  previousClubName: string | null,
  previousClubLogo: string | null,
  currentClubName: string | null,
  currentClubLogo: string | null,
  playerHistory: string | null,
  playerAppearance: number
  isFeatured:boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "SUB_ADMIN";

export type NewsCategory = 'TRANSFER' | 'ACADEMY' | 'ANNOUNCEMENT';

// Matches the backend News model exactly. There's no excerpt/subtitle/date/
// authorPhoto on the backend — summary stands in for excerpt, the category
// badge stands in for subtitle, createdAt stands in for date, and there's no
// per-article author photo (just the admin's name).
export interface NewsArticle {
  id: string;
  category: NewsCategory;
  headline: string;
  summary: string | null;
  body: string;
  coverImage: string | null;
  published: boolean;
  featuredPlayerId: string | null;
  featuredPlayer: { id: string; playerName: string } | null;
  author: { name: string };
  createdAt: string;
  updatedAt: string;
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

// Matches the backend `Testimonial` model — "author" here is a free-text
// label (e.g. "Scout Director"), not an internal admin.
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  club: string;
  country: string;
  published: boolean;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  verified: boolean;
  order: number;
  published: boolean;
  createdAt: string;
}

export interface Award {
  id: string;
  name: string;
  subtitle: string;
  image: string | null;
  order: number;
  published: boolean;
  createdAt: string;
}

export type HeadlineCategory = "transfer" | "negotiation" | "academy" | "announcement";

export interface Headlines {
  id: string;
  category: HeadlineCategory;
  headline: string;
  published: boolean;
  createdAt: string;
}

// Matches the backend GalleryItem model exactly. A gallery item is a single
// photo — no video type on the backend — usually with a link to the
// Instagram post it came from (instaUrl), which is what "The Archives"
// carousel on the home page links out to.
export interface GalleryImages {
  id: string;
  headline: string | null;
  instaUrl: string | null;
  description: string | null;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
export type QuickUpdateCategory = 'TRANSFER' | 'ACADEMY' | 'ANNOUNCEMENT' | 'MILESTONE' | 'INTERNATIONAL';

// Matches the backend `QuickUpdate` model — no per-item author photo (same
// convention as News), so the UI always shows the generic placeholder.
export interface QuickUpdate {
  id: string;
  headline: string;
  category: QuickUpdateCategory;
  published: boolean;
  createdAt: string;
  author: {
    name: string;
  };
}

// Matches the backend `Notification` model exactly (src/config: Prisma
// schema on udesports-server) — created publicly from the Contact page's
// form, read/managed only from the admin inbox.
export interface AppNotification {
  id: string;
  senderName: string;
  email: string | null;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}


