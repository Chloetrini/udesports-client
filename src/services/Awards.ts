import type { Award } from "@/types/dataTypes"

const awards: Award[] = [
  { id: 1, name: "CAC Certified", subtitle: "2022" },
  { id: 2, name: "FIFA Licensed Agent", subtitle: "Active License" },
  { id: 3, name: "NFF Certified", subtitle: "2023" },
  { id: 4, name: "CAF Certified", subtitle: "2022" },
]

export const fetchAwards = async (): Promise<Award[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(awards)
    }, 1000)
  })
}
