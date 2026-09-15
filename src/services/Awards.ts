import type { Award } from "@/types/dataTypes"
import { api } from "@/lib/api"

// Public — published awards only, powers the About page Award & Certification section.
export const fetchAwards = async (): Promise<Award[]> => {
  const res = await api.get<{ count: number; awards: Award[] }>("/awards")
  return res.body?.awards ?? []
}

// Admin-only — every award, including unpublished drafts.
export const fetchAwardsAdmin = async (): Promise<Award[]> => {
  const res = await api.get<{ count: number; awards: Award[] }>("/awards/admin/all")
  return res.body?.awards ?? []
}

// `isDraft: true` saves unpublished; the backend flips it to `published`.
export const createAward = async (data: Record<string, unknown>): Promise<Award> => {
  const res = await api.post<{ award: Award }>("/awards", toRequestBody(data))
  return res.body!.award
}

export const updateAward = async (id: string, data: Record<string, unknown>): Promise<Award> => {
  const res = await api.put<{ award: Award }>(`/awards/${id}`, toRequestBody(data))
  return res.body!.award
}

export const deleteAward = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/awards/${id}`)
}

// Builds a FormData body when an image File is present, otherwise plain JSON.
function toRequestBody(data: Record<string, unknown>): FormData | Record<string, unknown> {
  if (!(data.image instanceof File)) return data

  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    formData.append(key, value instanceof File ? value : String(value))
  }
  return formData
}

