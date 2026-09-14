import type { NewsArticle } from '@/types/dataTypes'
import { api } from '@/lib/api'

export const fetchNewsArticles = async (): Promise<NewsArticle[]> => {
  const res = await api.get<{ count: number; news: NewsArticle[] }>('/news')
  return res.body?.news ?? []
}

// Admin-only — includes drafts.
export const fetchNewsArticlesAdmin = async (): Promise<NewsArticle[]> => {
  const res = await api.get<{ count: number; news: NewsArticle[] }>('/news/admin/all')
  return res.body?.news ?? []
}

export const fetchSingleNewsArticle = async (id: string): Promise<NewsArticle> => {
  const res = await api.get<{ news: NewsArticle }>(`/news/${id}`)
  return res.body!.news
}

export const createNewsArticle = async (data: Record<string, unknown>): Promise<NewsArticle> => {
  const res = await api.post<{ news: NewsArticle }>('/news', toRequestBody(data))
  return res.body!.news
}

export const updateNewsArticle = async (id: string, data: Record<string, unknown>): Promise<NewsArticle> => {
  const res = await api.put<{ news: NewsArticle }>(`/news/${id}`, toRequestBody(data))
  return res.body!.news
}

export const deleteNewsArticle = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/news/${id}`)
}

function toRequestBody(data: Record<string, unknown>): FormData | Record<string, unknown> {
  if (!(data.coverImage instanceof File)) return data
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    formData.append(key, value instanceof File ? value : String(value))
  }
  return formData
}
