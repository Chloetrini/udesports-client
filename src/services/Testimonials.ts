import type { Testimonial } from "@/types/dataTypes"
import { api } from "@/lib/api"

// Public — published testimonials only, powers the home page carousel.
export const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  const res = await api.get<{ count: number; testimonials: Testimonial[] }>("/testimonials")
  return res.body?.testimonials ?? []
}

// Admin-only — every testimonial, including unpublished drafts.
export const fetchTestimonialsAdmin = async (): Promise<Testimonial[]> => {
  const res = await api.get<{ count: number; testimonials: Testimonial[] }>("/testimonials/admin/all")
  return res.body?.testimonials ?? []
}

// `isDraft: true` saves unpublished; the backend flips it to `published`.
export const createTestimonial = async (data: Record<string, unknown>): Promise<Testimonial> => {
  const res = await api.post<{ testimonial: Testimonial }>("/testimonials", data)
  return res.body!.testimonial
}

export const updateTestimonial = async (id: string, data: Record<string, unknown>): Promise<Testimonial> => {
  const res = await api.put<{ testimonial: Testimonial }>(`/testimonials/${id}`, data)
  return res.body!.testimonial
}

export const deleteTestimonial = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/testimonials/${id}`)
}

