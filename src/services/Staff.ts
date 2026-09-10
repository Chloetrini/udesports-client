import type { StaffMember } from "@/types/dataTypes"

const staff: StaffMember[] = [
  { id: 1, name: "Dominic Egbukwu", role: "C.E.O/Chairman", verified: true },
  { id: 2, name: "Barr. Chisom Dominic", role: "Legal", verified: true },
  { id: 3, name: "Mrs Patricia Egbukwu", role: "Secretary", verified: true },
  { id: 4, name: "Fatih Yalcin Ikeh", role: "Turkey Partner", verified: true },
  { id: 5, name: "Mr. Olivier Guy Andre", role: "French Partner", verified: true },
]

export const fetchStaff = async (): Promise<StaffMember[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(staff)
    }, 1000)
  })
}
