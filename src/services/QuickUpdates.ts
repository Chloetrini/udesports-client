import type { QuickUpdate } from "@/types/dataTypes"

const quickUpdates: QuickUpdate[] = [
  {
    id: "1",
    headline: "Omeruo's move to Leganés confirmed by both clubs",
    category: "TRANSFER",
    createdAt: "2026-03-16T09:00:00.000Z",
    author: { name: "Anwar Pandaan", avatarUrl: "" },
  },
  {
    id: "2",
    headline: "U-17 trial intake reaches capacity across all three centres",
    category: "ACADEMY",
    createdAt: "2026-03-16T09:00:00.000Z",
    author: { name: "Anwar Pandaan", avatarUrl: "" },
  },
  {
    id: "3",
    headline: "UdeSport passes 50 professional placements since founding",
    category: "MILESTONE",
    createdAt: "2026-03-16T09:00:00.000Z",
    author: { name: "Anwar Pandaan", avatarUrl: "" },
  },
  {
    id: "4",
    headline: "Two U-20 midfielders in talks with Bundesliga clubs",
    category: "INTERNATIONAL",
    createdAt: "2026-03-16T09:00:00.000Z",
    author: { name: "Anwar Pandaan", avatarUrl: "" },
  },
]

export const fetchQuickUpdates = async (): Promise<QuickUpdate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(quickUpdates)
    }, 1000)
  })
}
