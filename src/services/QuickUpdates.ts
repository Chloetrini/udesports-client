import type { QuickUpdate } from "@/types/dataTypes"
import { api } from "@/lib/api"

// Public — published quick updates only, powers the News page sidebar.
export const fetchQuickUpdates = async (): Promise<QuickUpdate[]> => {
  const res = await api.get<{ count: number; updates: QuickUpdate[] }>("/quick-updates")
  return res.body?.updates ?? []
}

// Admin-only — every update, including unpublished drafts.
export const fetchQuickUpdatesAdmin = async (): Promise<QuickUpdate[]> => {
  const res = await api.get<{ count: number; updates: QuickUpdate[] }>("/quick-updates/admin/all")
  return res.body?.updates ?? []
}

// `isDraft: true` saves unpublished; the backend flips it to `published`.
export const createQuickUpdate = async (data: Record<string, unknown>): Promise<QuickUpdate> => {
  const res = await api.post<{ update: QuickUpdate }>("/quick-updates", data)
  return res.body!.update
}

export const updateQuickUpdate = async (id: string, data: Record<string, unknown>): Promise<QuickUpdate> => {
  const res = await api.put<{ update: QuickUpdate }>(`/quick-updates/${id}`, data)
  return res.body!.update
}

export const deleteQuickUpdate = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/quick-updates/${id}`)
}
