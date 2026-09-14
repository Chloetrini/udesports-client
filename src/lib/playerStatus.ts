import type { PlayerStatus } from "@/types/dataTypes";

// Backend wire values (PlayerStatus enum) → display label, same pattern
// as CATEGORY_LABEL in main/articles/full-news for NewsCategory.
export const STATUS_LABEL: Record<PlayerStatus, string> = {
  FREE: "Free",
  TRANSFERRED: "Transferred",
  NEGOTIATION: "Negotiation",
  RETIRED: "Retired",
};

export const STATUS_STYLE: Record<PlayerStatus, string> = {
  TRANSFERRED: "bg-green-200 dark:bg-green-900/40 text-green-600 dark:text-green-400",
  NEGOTIATION: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
  FREE: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
  RETIRED: "bg-gray-200 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400",
};

export const STATUS_OPTIONS: PlayerStatus[] = ["FREE", "TRANSFERRED", "NEGOTIATION", "RETIRED"];

