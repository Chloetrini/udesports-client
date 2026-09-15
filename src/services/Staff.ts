import type { StaffMember } from "@/types/dataTypes"
import { api } from "@/lib/api"

// Public — published staff only, powers the About page "Our Staff" section.
export const fetchStaff = async (): Promise<StaffMember[]> => {
  const res = await api.get<{ count: number; staff: StaffMember[] }>("/staff")
  return res.body?.staff ?? []
}

// Admin-only — every staff member, including unpublished drafts.
export const fetchStaffAdmin = async (): Promise<StaffMember[]> => {
  const res = await api.get<{ count: number; staff: StaffMember[] }>("/staff/admin/all")
  return res.body?.staff ?? []
}

// `isDraft: true` saves unpublished; the backend flips it to `published`.
export const createStaffMember = async (data: Record<string, unknown>): Promise<StaffMember> => {
  const res = await api.post<{ member: StaffMember }>("/staff", toRequestBody(data))
  return res.body!.member
}

export const updateStaffMember = async (id: string, data: Record<string, unknown>): Promise<StaffMember> => {
  const res = await api.put<{ member: StaffMember }>(`/staff/${id}`, toRequestBody(data))
  return res.body!.member
}

export const deleteStaffMember = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/staff/${id}`)
}

// Builds a FormData body when a photo File is present, otherwise plain JSON.
function toRequestBody(data: Record<string, unknown>): FormData | Record<string, unknown> {
  if (!(data.photo instanceof File)) return data

  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    formData.append(key, value instanceof File ? value : String(value))
  }
  return formData
}

