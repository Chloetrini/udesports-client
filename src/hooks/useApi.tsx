import { useQuery } from '@tanstack/react-query'
import { fetchAllPlayers, fetchSinglePlayer } from '../services/Players'
import { fetchAllTestimonials  } from '../services/Testimonials'
import { fetchNewsArticles } from '@/services/Articles'
import { fetchAllHeadlines } from '@/services/Headlines'
import { fetchGalleryImages } from '@/services/galleryImages'
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