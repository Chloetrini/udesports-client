// import { useState } from 'react'
// import FetchPlayers from '../components/FetchPlayers'
// import FilterPlayers from '../components/FilterPlayers'
// import PlayerFullDetails from '../components/PlayerFullDetails'
// import ScrollToTopButton from '../components/ui/ScrollToTopButton'

// type AgeGroup = "All" | 17 | 20 | 23
// type Status = "All" | "Free" | "Transferred" | "Negotiation"


// const PlayerInformation = () => {
//   const [ageFilter, setAgeFilter] = useState<AgeGroup>("All")
//   const [statusFilter, setStatusFilter] = useState<Status>("All") 
//   // holds the id of the player whose modal is open; null = modal closed
//   const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
//   const [searchInput, setSearchInput] = useState("");
//   return (
//     <div className='relative w-full h-screen md:h-fit px-5 lg:px-10 mx-auto container'>
//       <div className='flex flex-col gap-[8px] mt-20 mb-5 relative'>
//         <div className='w-[100px] h-[37px] flex gap-[8px] items-center justify-center bg-[#00D46A4D] rounded-full font-manrope text-[#00A553] font-bold'>
//           <span className='w-[8px] h-[8px] bg-[#00D46A] rounded-lg'></span>
//           Roster
//         </div>
//         <p className='font-normal text-[64px] leading-[69px] font-bebas'>
//           <span className='block'>PLAYER</span>
//           INFORMATION
//         </p>
//       </div>
//       {
//         !selectedPlayerId && (
//       <section className='sticky top-0 z-9999 bg-white mx-[-20px] lg:mx-[-40px]'>
//       <FilterPlayers
//         ageFilter={ageFilter}
//         setAgeFilter={setAgeFilter}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//         searchInput={searchInput}
//         setSearchInput={setSearchInput}
//       />
      
//       </section>
//         )
//       }
//         <div className='flex justify-center h-full'>
//           <FetchPlayers
//             ageFilter={ageFilter}
//             statusFilter={statusFilter}
//             searchInput={searchInput}
//             onPlayerClick={setSelectedPlayerId}
//           />
//         </div>
//       {/* render modal only when a player is selected */}
//       {selectedPlayerId && (
//         <PlayerFullDetails
//           id={selectedPlayerId}
//           onClose={() => setSelectedPlayerId(null)}
//         />
//       )}
//       <ScrollToTopButton />
//     </div>
//   )
// }
// export default PlayerInformation