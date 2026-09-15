import type { Headlines } from "@/types/dataTypes"
import { api } from "@/lib/api"

// Public — published headlines only, powers the scrolling ticker bar.
export const fetchAllHeadlines = async (): Promise<Headlines[]> => {
  const res = await api.get<{ count: number; headlines: Headlines[] }>("/headlines")
  return res.body?.headlines ?? []
}

// Admin-only — every headline, including unpublished drafts.
export const fetchHeadlinesAdmin = async (): Promise<Headlines[]> => {
  const res = await api.get<{ count: number; headlines: Headlines[] }>("/headlines/admin/all")
  return res.body?.headlines ?? []
}

// `isDraft: true` saves unpublished; the backend flips it to `published`.
export const createHeadlineItem = async (data: Record<string, unknown>): Promise<Headlines> => {
  const res = await api.post<{ headline: Headlines }>("/headlines", data)
  return res.body!.headline
}

export const updateHeadlineItem = async (id: string, data: Record<string, unknown>): Promise<Headlines> => {
  const res = await api.put<{ headline: Headlines }>(`/headlines/${id}`, data)
  return res.body!.headline
}

export const deleteHeadlineItem = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/headlines/${id}`)
}
