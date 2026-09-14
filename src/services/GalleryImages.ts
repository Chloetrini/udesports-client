import type { GalleryImages } from "@/types/dataTypes";
import { api } from "@/lib/api";

// Public — published gallery items only, powers /gallery and the home page
// Instagram carousel.
export const fetchGalleryImages = async (): Promise<GalleryImages[]> => {
  const res = await api.get<{ count: number; items: GalleryImages[] }>("/gallery");
  return res.body?.items ?? [];
};

// Admin-only — every item, including unpublished drafts. There's no
// single-item GET route on the backend, so the edit form finds its item
// in this same list instead of fetching it individually.
export const fetchGalleryImagesAdmin = async (): Promise<GalleryImages[]> => {
  const res = await api.get<{ count: number; items: GalleryImages[] }>("/gallery/admin/all");
  return res.body?.items ?? [];
};

// `isDraft: true` saves unpublished; the backend flips it to `published`.
export const createGalleryItem = async (data: Record<string, unknown>): Promise<GalleryImages> => {
  const res = await api.post<{ item: GalleryImages }>("/gallery", toRequestBody(data));
  return res.body!.item;
};

export const updateGalleryItem = async (id: string, data: Record<string, unknown>): Promise<GalleryImages> => {
  const res = await api.put<{ item: GalleryImages }>(`/gallery/${id}`, toRequestBody(data));
  return res.body!.item;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/gallery/${id}`);
};

// Builds a FormData body when a coverImage File is present, otherwise plain JSON.
function toRequestBody(data: Record<string, unknown>): FormData | Record<string, unknown> {
  if (!(data.coverImage instanceof File)) return data;

  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    formData.append(key, value instanceof File ? value : String(value));
  }
  return formData;
}
