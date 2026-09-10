import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FetchPlayers from '@/components/player-information/FetchPlayers'
import FilterPlayers, { type AgeGroup, type Status } from '@/components/player-information/FilterPlayers'
import PlayerFullDetails from '@/components/player-information/PlayerFullDetails'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import PageWrapper from '@/components/page-wrapper'

const PlayerInformation = () => {
  const location = useLocation()

  const [ageFilter, setAgeFilter] = useState<AgeGroup>("All")
  const [statusFilter, setStatusFilter] = useState<Status>("All")
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState("")

  const playerId = location.state?.playerId

  useEffect(() => {
    if (playerId) {
      setSelectedPlayerId(playerId)
    }
  }, [playerId])

  // resets every filter back to its default — passed to FetchPlayers' empty state
  const handleClearFilters = () => {
    setAgeFilter("All")
    setStatusFilter("All")
    setSearchInput("")
  }

  return (
    <PageWrapper className='relative w-full min-h-screen p-[20px] monitorAdjust '>

      <div className='flex flex-col gap-[8px] mt-20 mb-5 relative'>
        <div className='w-[100px] h-[37px] flex gap-[8px] items-center justify-center bg-[#00D46A4D] rounded-full font-manrope text-[#00A553] font-bold'>
          <span className='w-[8px] h-[8px] bg-[#00D46A] rounded-lg'></span>
          Roster
        </div>

        <p className='font-normal text-[64px] leading-[69px] font-bebas'>
          <span className='block'>PLAYER</span>
          INFORMATION
        </p>
      </div>

      {!selectedPlayerId && (
        <section className='md:sticky top-0 z-9999 bg-white mx-[-20px] lg:mx-[-40px]'>
          <FilterPlayers
            ageFilter={ageFilter}
            setAgeFilter={setAgeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
          />
        </section>
      )}

      <div className='flex justify-center mb-20 md:mb-30 lg:mb-50'>
        <FetchPlayers
          ageFilter={ageFilter}
          statusFilter={statusFilter}
          searchInput={searchInput}
          onPlayerClick={setSelectedPlayerId}
          onClearFilters={handleClearFilters}
        />
      </div>

      {selectedPlayerId && (
        <PlayerFullDetails
          id={selectedPlayerId}
          onClose={() => setSelectedPlayerId(null)}
        />
      )}

      <ScrollToTopButton />
    </PageWrapper>
  )
}

export default PlayerInformation
