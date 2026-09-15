import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllPlayers, fetchAllPlayersAdmin, fetchSinglePlayer, createPlayer, updatePlayer, deletePlayer } from '../services/Players'
import { login as loginRequest, logout as logoutRequest, getMe, setPassword as setPasswordRequest } from '@/services/Auth'
import {
  fetchAllTestimonials,
  fetchTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../services/Testimonials'
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '@/services/Newsletter'
import {
  fetchNewsArticles,
  fetchNewsArticlesAdmin,
  fetchSingleNewsArticle,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
} from '@/services/Articles'
import {
  fetchAllHeadlines,
  fetchHeadlinesAdmin,
  createHeadlineItem,
  updateHeadlineItem,
  deleteHeadlineItem,
} from '@/services/Headlines'
import {
  fetchGalleryImages,
  fetchGalleryImagesAdmin,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '@/services/GalleryImages'
import {
  fetchQuickUpdates,
  fetchQuickUpdatesAdmin,
  createQuickUpdate,
  updateQuickUpdate,
  deleteQuickUpdate,
} from '@/services/QuickUpdates'
import {
  fetchStaff,
  fetchStaffAdmin,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from '@/services/Staff'
import {
  fetchAwards,
  fetchAwardsAdmin,
  createAward,
  updateAward,
  deleteAward,
} from '@/services/Awards'
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

// Activates an invited admin's account (sets their password from the
// emailed invite link's token).
export const useSetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      password,
      confirmPassword,
    }: {
      token: string
      password: string
      confirmPassword: string
    }) => setPasswordRequest(token, password, confirmPassword),
  })
}

export const useGetTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchAllTestimonials
  })
}

export const useGetTestimonialsAdmin = () => {
  return useQuery({
    queryKey: ['testimonials', 'admin'],
    queryFn: fetchTestimonialsAdmin
  })
}

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}

export const useSubscribeToNewsletter = () => {
  return useMutation({
    mutationFn: (email: string) => subscribeToNewsletter(email),
  })
}

export const useUnsubscribeFromNewsletter = () => {
  return useMutation({
    mutationFn: (token: string) => unsubscribeFromNewsletter(token),
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

export const useGetHeadlinesAdmin = () => {
  return useQuery({
    queryKey: ['headlines', 'admin'],
    queryFn: fetchHeadlinesAdmin
  })
}

export const useCreateHeadline = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createHeadlineItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headlines'] })
    },
  })
}

export const useUpdateHeadline = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateHeadlineItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headlines'] })
    },
  })
}

export const useDeleteHeadline = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteHeadlineItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headlines'] })
    },
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

// Admin-only — includes drafts.
export const useGetQuickUpdatesAdmin = () => {
  return useQuery({
    queryKey: ["quickUpdates", "admin"],
    queryFn: fetchQuickUpdatesAdmin
  })
}

export const useCreateQuickUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createQuickUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickUpdates'] })
    },
  })
}

export const useUpdateQuickUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateQuickUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickUpdates'] })
    },
  })
}

export const useDeleteQuickUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteQuickUpdate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickUpdates'] })
    },
  })
}

export const useGetStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff
  })
}

export const useGetStaffAdmin = () => {
  return useQuery({
    queryKey: ["staff", "admin"],
    queryFn: fetchStaffAdmin
  })
}

export const useCreateStaffMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createStaffMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

export const useUpdateStaffMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateStaffMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

export const useDeleteStaffMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteStaffMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

export const useGetAwards = () => {
  return useQuery({
    queryKey: ["awards"],
    queryFn: fetchAwards
  })
}

export const useGetAwardsAdmin = () => {
  return useQuery({
    queryKey: ["awards", "admin"],
    queryFn: fetchAwardsAdmin
  })
}

export const useCreateAward = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createAward(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] })
    },
  })
}

export const useUpdateAward = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateAward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] })
    },
  })
}

export const useDeleteAward = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] })
    },
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


