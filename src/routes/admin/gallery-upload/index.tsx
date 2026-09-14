import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, ImagePlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useGetGalleryAdmin, useCreateGalleryItem, useUpdateGalleryItem } from '@/hooks/useApi'
import type { GalleryImages } from '@/types/dataTypes'

export default function GalleryUpload() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  // No single-item GET route on the backend — the edit form finds its item
  // in the same admin list the Gallery page already fetches.
  const { data: items, isLoading: listLoading } = useGetGalleryAdmin()
  const item = isEditMode ? items?.find((i) => i.id === id) : undefined

  const createMutation = useCreateGalleryItem()
  const updateMutation = useUpdateGalleryItem()

  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [headline, setHeadline] = useState('')
  const [instaUrl, setInstaUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<Record<string, string>>({})

  // Sync the form once the item arrives — adjusted during render (React's
  // documented pattern for this) rather than in an effect, so it happens
  // in the same commit instead of triggering an extra render pass.
  const [syncedItem, setSyncedItem] = useState<GalleryImages | undefined>(undefined)
  if (item && item !== syncedItem) {
    setSyncedItem(item)
    setHeadline(item.headline ?? '')
    setInstaUrl(item.instaUrl ?? '')
    setDescription(item.description ?? '')
    setCoverImage(item.coverImage ?? null)
  }

  function validate() {
    const newError: Record<string, string> = {}
    if (!headline.trim() && !instaUrl.trim()) {
      newError.headline = 'Either Photo Headline or Insta URL is required'
    }
    if (!description.trim()) newError.description = 'Photo description is required'
    return newError
  }

  async function handleSave(publishTarget: boolean) {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors)
      return
    }

    const payload: Record<string, unknown> = {
      headline: headline.trim() || undefined,
      instaUrl: instaUrl.trim() || undefined,
      description: description.trim(),
      isDraft: !publishTarget,
    }
    if (coverImageFile) {
      payload.coverImage = coverImageFile
    }

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      toast.success(publishTarget ? 'Photo published' : 'Saved as draft')
      navigate('/admin/gallery')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isEditMode && listLoading) {
    return <div className="p-6 text-sm text-gray-400">Loading…</div>
  }

  return (
    <div className='p-6'>
      <p className="text-sm font-medium text-green-500 mb-1"> Content Management</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        <span className="text-gray-400">GALLERY</span> › {isEditMode ? 'EDIT CONTENT' : 'UPLOAD CONTENT'}
      </h1>
      <p className="text-sm text-gray-400 mb-4">Upload and manage photos shown on the public gallery page</p>

      {/* Back button */}
      <button onClick={() => navigate('/admin/gallery')} className='flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors'>
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Form */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Photo Headline <span className="text-gray-400 font-medium">(Optional on Insta URL paste)</span>
              </label>
              <input type="text" placeholder='Input Headline' value={headline} onChange={(e) => { setHeadline(e.target.value); setError({ ...error, headline: "" }) }}
                className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${error.headline ? 'border-red-400' : 'border-gray-200 dark:border-white/15 hover:border-green-400'}`} />
              {error.headline && <p className='text-xs text-red-500'>{error.headline}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Insta URL</label>
              <input type="text" placeholder='https://instagram.com/p/...' value={instaUrl} onChange={(e) => setInstaUrl(e.target.value)}
                className='border border-gray-200 dark:border-white/15 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 py-2 px-3 text-sm' />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Photo Description
            </label>
            <textarea placeholder="Input Description" rows={5} value={description} onChange={(e) => { setDescription(e.target.value); setError({ ...error, description: "" }) }}
              className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 resize-none rounded-lg ${error.description ? 'border-red-400' : 'border-gray-200 dark:border-white/15 hover:border-green-400'}`} />
            {error.description && <p className='text-xs text-red-500'>{error.description}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-6 md:w-1/2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Cover Image
          </label>
          <label className="border border-gray-200 dark:border-white/15 rounded-lg h-36 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors overflow-hidden">
            {coverImage ? (
              <img src={coverImage} className="h-full w-full object-cover" />
            ) : (
              <div className="flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <p className="text-xs text-gray-400">Upload Photo</p>
              </div>
            )}

            <input type="file" accept='image/*' className='hidden' onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setCoverImageFile(file)
                setCoverImage(URL.createObjectURL(file))
              }
            }} />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving…' : isEditMode ? 'Save Changes' : '+ Publish'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="bg-gray-200 dark:bg-white/10 hover:bg-green-500 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>
          <button onClick={() => navigate("/admin/gallery")} className='bg-gray-200 dark:bg-white/10 hover:bg-green-500 hover:text-white text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-6 py-2 rounded-lg transition-colors'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
