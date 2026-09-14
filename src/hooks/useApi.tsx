import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllPlayers, fetchAllPlayersAdmin, fetchSinglePlayer, createPlayer, updatePlayer, deletePlayer } from '../services/Players'
import { login as loginRequest, logout as logoutRequest, getMe } from '@/services/Auth'
import { fetchAllTestimonials  } from '../services/Testimonials'
import {
  fetchNewsArticles,
  fetchNewsArticlesAdmin,
  fetchSingleNewsArticle,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
} from '@/services/Articles'
import { fetchAllHeadlines } from '@/services/Headlines'
import {
  fetchGalleryImages,
  fetchGalleryImagesAdmin,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '@/services/GalleryImages'
import { fetchQuickUpdates } from '@/services/QuickUpdates'
import { fetchStaff } from '@/services/Staff'
import { fetchAwards } from '@/services/Awards'
import {
  submitContactMessage,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/services/Notifications'
import type { Player } from '@/types/dataTypes'
// import type { Player } from '../components/FetchPlayers'

export const useGetPlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: fetchAllPlayers,
  })
}

// Admin-only — includes drafts. Used by the admin player list/dashboard so
// a player saved as a draft doesn't just disappear (useGetPlayers, the
// public query, only ever returns published players).
export const useGetPlayersAdmin = () => {
  return useQuery({
    queryKey: ['players', 'admin'],
    queryFn: fetchAllPlayersAdmin,
  })
}

export const useGetSinglePlayer = (id: string) => {
  return useQuery({
    queryKey: ['player', id],
    queryFn: () => fetchSinglePlayer(id),
    enabled: !!id,
  })
}

export const useCreatePlayer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createPlayer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updatePlayer(id, data),
    onSuccess: (player: Player) => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      queryClient.invalidateQueries({ queryKey: ['player', player.id] })
    },
  })
}

export const useDeletePlayer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePlayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

// ['players'] as a prefix covers both the public list (['players']) and the
// admin list (['players', 'admin']) in one invalidation call.

// ---- Auth ----

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false, // a 401 here just means "not logged in" — don't retry
    staleTime: 5 * 60 * 1000,
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginRequest(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      queryClient.setQueryData(['me'], undefined)
      queryClient.clear()
    },
  })
}

export const useGetTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchAllTestimonials
  })
}

// export const useGetArticles = () => {
//   return useQuery({
//     queryKey: ['Articles'],
//     queryFn: fetchNewsArticles
//   })
// }

export const useGetHeadlines = () => {
  return useQuery({
    queryKey: ['headlines'],
    queryFn: fetchAllHeadlines
  })
}

export const useGetNewsArticles = () => {
  return useQuery({
    queryKey: ['news', 'articles'],
    queryFn: fetchNewsArticles
  })
}

// Admin-only — includes drafts. ['news', ...] invalidation below covers this
// too via React Query's prefix matching, same as players/gallery.
export const useGetNewsArticlesAdmin = () => {
  return useQuery({
    queryKey: ['news', 'admin'],
    queryFn: fetchNewsArticlesAdmin
  })
}

export const useGetSingleNewsArticle = (id?: string) => {
  return useQuery({
    queryKey: ['news', 'article', id],
    queryFn: () => fetchSingleNewsArticle(id as string),
    enabled: !!id,
  })
}

export const useCreateNewsArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createNewsArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })
}

export const useUpdateNewsArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateNewsArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })
}

export const useDeleteNewsArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNewsArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })
}

export const useGetGalleryImages = () => {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGalleryImages
  })
}

// Admin-only — includes drafts.
export const useGetGalleryAdmin = () => {
  return useQuery({
    queryKey: ["gallery", "admin"],
    queryFn: fetchGalleryImagesAdmin
  })
}

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createGalleryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] })
    },
  })
}

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateGalleryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] })
    },
  })
}

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] })
    },
  })
}

export const useGetQuickUpdates = () => {
  return useQuery({
    queryKey: ["quickUpdates"],
    queryFn: fetchQuickUpdates
  })
}

export const useGetStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff
  })
}

export const useGetAwards = () => {
  return useQuery({
    queryKey: ["awards"],
    queryFn: fetchAwards
  })
}

// ---- Notifications (contact form + admin inbox) ----

export const useSubmitContactMessage = () => {
  return useMutation({
    mutationFn: (data: { senderName: string; email?: string; subject: string; body: string }) =>
      submitContactMessage(data),
  })
}

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
