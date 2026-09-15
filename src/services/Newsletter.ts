import { api } from "@/lib/api"

// Footer "Join our newsletter" form.
export const subscribeToNewsletter = async (email: string): Promise<string> => {
  const res = await api.post<Record<string, never>>("/newsletter/subscribe", { email })
  return res.message
}

// One-click unsubscribe link included in every notification email.
export const unsubscribeFromNewsletter = async (token: string): Promise<string> => {
  const res = await api.get<Record<string, never>>(`/newsletter/unsubscribe/${token}`)
  return res.message
}

