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