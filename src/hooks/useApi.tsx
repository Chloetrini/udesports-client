import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllPlayers, fetchSinglePlayer, createPlayer, updatePlayer, deletePlayer } from '../services/Players'
import { login as loginRequest, logout as logoutRequest, getMe } from '@/services/Auth'
import { fetchAllTestimonials  } from '../services/Testimonials'
import { fetchNewsArticles } from '@/services/Articles'
import { fetchAllHeadlines } from '@/services/Headlines'
import { fetchGalleryImages } from '@/services/GalleryImages'
import { fetchQuickUpdates } from '@/services/QuickUpdates'
import { fetchStaff } from '@/services/Staff'
import { fetchAwards } from '@/services/Awards'
import type { Player } from '@/types/dataTypes'
// import type { Player } from '../components/FetchPlayers'

export const useGetPlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: fetchAllPlayers,
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

export const useGetGalleryImages = () => {
  return useQuery({
    queryKey: ["images"],
    queryFn: fetchGalleryImages
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

