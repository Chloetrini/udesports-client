// import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import imageIcon from "@/assets/imageicon.svg"

export default function GalleryUpload() {
  const navigate = useNavigate()
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [headline, setHeadline] = useState('')
  const [instaUrl, setInstaUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<Record<string, string>>({})

  function validate(){
       const newError: Record<string, string> = {}
    if (!headline.trim() && !instaUrl.trim()) {
      newError.headline = 'Either Photo Headline or Insta URL is required'
    }
    if (!description.trim()) newError.description = 'Photo description is required'
    return newError
  }

  function handlePublish(){
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors)
      return
    }
    navigate("/admin/gallery")
  }

  return (
    <div className='p-6'>
       <p className="text-sm font-medium text-green-500 mb-1"> Content Management</p>
       <h1 className="text-2xl font-bold text-gray-900 mb-1">
        <span className="text-gray-400">GALLERY</span> › UPLOAD CONTENT
       </h1>
       <p className="text-sm text-gray-400 mb-4">Upload and manage photos shown on the public gallery page</p>

       {/* Back button */}
      <button onClick={() =>("/gallery")} className='flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-6 transition-colors'>
        <ArrowLeft size={18}/>
        Back
      </button>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
           <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Photo Headline <span className="text-gray-400 font-medium">(Optional on Insta URL paste)</span>
                </label>
                <input type="text" placeholder='Input Headline' value={headline} onChange={(e) => {setHeadline(e.target.value); setError({...error, headline: ""})}} 
                className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-500 ${error.headline ? 'border-red-400' : 'border-gray-200 hover:border-green-400'}`} />
                {error.headline && <p className='text-xs text-red-500'>{error.headline}</p>}
              </div>

              <div  className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Insta URL</label>
                <input type="text" placeholder='Input Headline' value={instaUrl} onChange={(e) => setInstaUrl(e.target.value)}
                 className='border border-gray-200 focus:outline-none focus:border-green-500 py-2 px-3 text-sm'/>
              
              </div>
           </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">
            Photo Description <span className="text-gray-400 font-normal">(Optional on Insta URL paste)</span>
          </label>
          <textarea placeholder="Input Description" rows={5} value={description} onChange={(e) => {setDescription(e.target.value); setError({...error, description: ""})}}
               className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 resize-none rounded-lg ${error.description ? 'border-red-400' : 'border-gray-200 hover:border-green-400'}`} />
               {error.description && <p className='text-xs text-red-500'>{error.description}</p>}
        </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-6 md:w-1/2">
          <label className="text-xs font-medium text-gray-600">
            Cover Image <span className="text-gray-400 font-normal">(Optional on Insta URL paste)</span>
          </label>
          <label className="border border-gray-200 h-36 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
            {coverImage ? (
              <img src={coverImage} className="h-full w-full object-cover rounded-lg" />
        ) : (
           <div className="flex items-center gap-2">
             <img src={imageIcon} alt="Upload" className="w-5 h-5"/>
             <p className="text-xs text-gray-400">Upload Photo</p>
           </div>
            )}

            <input type="file" accept='image/*' className='hidden' onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setCoverImage(URL.createObjectURL(file))
            }} />
          </label>
        </div>

{/* Buttons */}
        <div className="flex items-center gap-3">
          <button onClick={handlePublish} className="bg-gray-200 hover:bg-green-600 text-black hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
            + Publish
          </button>
          <button className="bg-gray-200 hover:bg-green-500 text-gray-600 border border-gray-200 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
             Save as Draft
          </button>
          <button onClick={() => navigate("/admin/gallery")} className='bg-gray-200 hover:bg-green-500 hover:text-white text-gray-600 border border-gray-200 text-sm font-medium px-6 py-2 rounded-lg transition-colors'>
            Cancel
          </button>
        </div>
      </div> 
    </div>
  )
}

