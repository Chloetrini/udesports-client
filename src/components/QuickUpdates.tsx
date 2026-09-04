// import { useEffect, useState } from 'react';
// import type { QuickUpdate } from '../types/dataTypes';

// const CATEGORY_PILL_LABEL: Record<QuickUpdate['category'], string> = {
//   TRANSFER: 'Transfer',
//   ACADEMY: 'Academy',
//   ANNOUNCEMENT: 'Announcement',
// };

// const CATEGORY_PILL_STYLE: Record<QuickUpdate['category'], string> = {
//   TRANSFER: 'bg-[#D47F0033] text-[#D47F00] rounded-full font-bold',
//   ACADEMY: 'bg-[#1778FB33] text-[#045BD0] rounded-full font-bold',
//   ANNOUNCEMENT: 'bg-emerald-100 text-emerald-700 rounded-full font-bold',
// };

// const QuickUpdates = () => {
//   const [updates, setUpdates] = useState<QuickUpdate[] | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     let cancelled = false

//     const fetchUpdates = async () => {
//       setIsLoading(true)
//       try {
//         const res = await fetch('/data/news.json')
//         const data: { quickUpdates: QuickUpdate[] } = await res.json()
//         if (cancelled) return
//         setUpdates(data.quickUpdates)
//       } catch (error) {
//         if (!cancelled) console.error("Failed to fetch quick updates:", error)
//       } finally {
//         if (!cancelled) setIsLoading(false)
//       }
//     }
//     fetchUpdates()

//     return () => {
//       cancelled = true
//     }
//   }, [])

//   if (isLoading) return <p>Loading updates…</p>;
//   if (!updates || updates.length === 0) return null;

//   return (
//     <section className="pt-12 font-[Roboto]">
//       <h2 className="font-bold text-[20px] text-[#292929] lg:text-end">Quick Updates</h2>
//       <div className="flex flex-col gap-5 mt-4">
//         {updates.map((update) => (
//           <div key={update.id} className="flex flex-col gap-3">
//             <div className='flex items-center gap-3'>
//                 <img src={update.author.avatarUrl} alt={update.author.name} className="h-6 w-8 rounded-full"/>
//                 <span className="text-[14px] text-[#292929] font-light font-[Roboto]">{update.author.name}</span>
//             </div>
//             <div className="flex flex-col">
//               <p className="text-[14px] text-[#191919] font-medium font-[Roboto]">{update.headline}</p>
//               <div className="flex items-center gap-2 text-[12px] text-gray-400 mt-1 font-[Manrope]">
//                 <time className='text-[#959595]' dateTime={update.createdAt}>
//                   {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
//                     new Date(update.createdAt)
//                   )}
//                 </time>
//                 <span>•</span>
//                 <span className={`px-2 py-0.5 text-[12px] ${CATEGORY_PILL_STYLE[update.category]}`}>
//                   • {CATEGORY_PILL_LABEL[update.category]}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default QuickUpdates