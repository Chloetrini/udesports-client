import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { QueryClient} from '@tanstack/react-query'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      refetchOnWindowFocus: true,
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export const calculateReadTime = (html: string, wordsPerMinute = 200): number => {
  const text = html.replace(/<[^>]*>/g, ' '); // strip HTML tags
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = words / wordsPerMinute;
  return Math.max(1, Math.round(minutes)); // never show "0 min read"
}

export const formatCount = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function estimateReadTime(text: string) {
  const WORDS_PER_MINUTE = 200; // average adult read time

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const totalMinutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} min`;
}

// Rewrites a Cloudinary URL to ask Cloudinary for a resized, auto-format,
// auto-quality version instead of the original upload. Some player photos
// (and other images) were uploaded before every upload path applied a
// transformation, so a handful of them are still full-resolution originals —
// several MB each — which is what made those images so slow to load the
// first time. Doing the resize on the URL, not at upload time, fixes it
// retroactively for every image already stored, not just new uploads.
// Non-Cloudinary URLs (local assets, empty/undefined src) pass through
// unchanged.
export function optimizeImageUrl(url: string | null | undefined, width: number): string {
  if (!url) return ""
  const marker = "/upload/"
  const i = url.indexOf(marker)
  if (!url.includes("res.cloudinary.com") || i === -1) return url
  const insertAt = i + marker.length
  return `${url.slice(0, insertAt)}w_${width},q_auto,f_auto,c_limit/${url.slice(insertAt)}`
}

// "10 mins ago" / "3 hours ago" / "5 days ago" style relative timestamp,
// falling back to a plain date once it's more than a week old.
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return formatDate(iso);
}
