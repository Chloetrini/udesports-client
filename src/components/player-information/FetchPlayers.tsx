import { useGetPlayers } from '@/hooks/useApi';
import Skeleton from '@mui/material/Skeleton';
import noPlayers from '@/assets/noPlayers.png'
import udeSportLogo from '@/assets/udeSportLogo.png'
import { getAge } from '@/hooks/getAge';
import silhouette from '@/assets/silhouette.png'
import type { AgeGroup, Status } from './FilterPlayers';
import { STATUS_LABEL } from '@/lib/playerStatus';


type FetchPlayersProps = {
  ageFilter: AgeGroup
  statusFilter: Status
  searchInput: string
  onPlayerClick: (id: string) => void   // called with the player's id when a card is clicked
  onClearFilters: () => void            // resets age/status/search back to defaults in the parent
}

const FetchPlayers = ({ ageFilter, statusFilter, searchInput, onPlayerClick, onClearFilters }: FetchPlayersProps) => {
  const { data, isLoading, isError } = useGetPlayers();

  // true when any filter is narrowing the list — decides which empty state to show
  const hasActiveFilters =
    ageFilter !== "All" || statusFilter !== "All" || searchInput.trim() !== ""

  // A single skeleton card — mirrors the real card's outer dimensions and split layout
  const PlayerCardSkeleton = () => (
    <div className='w-[255px] h-[226px] md:w-[240px] md:h-[211px] lg:w-[306px] lg:h-[272px] flex gap-2 relative'>
      {/* left: main card area with silhouette */}
      <div className='h-full w-[226px] rounded-[10px] bg-[#f0f0f0] flex items-end justify-center overflow-hidden'>
        {/* silhouette shape — a rounded block standing in for the player image */}
        <img
          src={silhouette}
          alt=""
          className='w-[174px] h-[187px] lg:w-[200px] lg:h-[224px] opacity-20 animate-pulse'
        />
      </div>

      {/* right: the G/A · APP · club strip */}
      <div className='h-full w-[69.1px] rounded-r-3xl flex flex-col justify-between gap-1'>
        <Skeleton variant="rounded" width='100%' height={63} />
        <Skeleton variant="rounded" width='100%' height={40} />
        <Skeleton variant="rounded" width={48} height={108} sx={{ borderBottomRightRadius: 16 }} />
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gridAdjust gap-11 w-full justify-items-center'>
        {Array.from({ length: 8 }).map((_, i) => (
          <PlayerCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center text-center gap-4 w-full py-20 px-6'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <p className='font-manrope font-bold text-[#060A0F] dark:text-white text-lg mb-1'>
            We couldn't load the players
          </p>
          <p className='font-manrope font-normal text-[#68717D] text-sm max-w-sm'>
            Something went wrong fetching the roster. Check your connection and try again.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className='font-manrope font-bold text-white text-sm bg-[#00A553] hover:bg-[#00934a] transition-colors rounded-xl py-2.5 px-5 cursor-pointer'
        >
          Retry
        </button>
      </div>
    )
  }

  // No players in the system at all (empty roster, not a filter mismatch)
  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center text-center gap-4 w-full h-90 px-6'>
        <img src={noPlayers} alt="" className='w-20 h-20 opacity-80' />
        <p className='font-manrope font-bold text-[#060A0F] dark:text-white text-lg'>No players yet</p>
        <p className='font-manrope font-normal text-[#68717D] text-sm max-w-sm'>
          There are no players on the roster at the moment. Check back soon.
        </p>
      </div>
    )
  }

  const filteredData = data.filter((player) => {
    const currentAge = getAge(player.DOB)
    const ageMatch =
      ageFilter === "All" || currentAge <= ageFilter

    const statusMatch =
      statusFilter === "All" || STATUS_LABEL[player.status] === statusFilter

    const q = searchInput.toLowerCase()

    const searchMatch =
      (player.playerName?.toLowerCase().includes(q)) ||
      (player.playerFullName?.toLowerCase().includes(q)) ||
      (player.currentClubName?.toLowerCase().includes(q)) ||
      (player.position?.toLowerCase().includes(q)) ||
      getAge(player.DOB).toString().includes(searchInput)

    return ageMatch && statusMatch && searchMatch

  })

  // Players exist, but none match the current filters — let the user clear them
  if (filteredData.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center text-center gap-4 w-full h-90 px-6'>
        <img src={noPlayers} alt="" className='w-20 h-20 opacity-80' />
        <div>
          <p className='font-manrope font-bold text-[#060A0F] dark:text-white text-lg mb-1'>
            No players match your filters
          </p>
          <p className='font-manrope font-normal text-[#68717D] text-sm max-w-sm'>
            Try adjusting your search or filters to see more of the roster.
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className='font-manrope font-bold text-white text-sm bg-[#00A553] hover:bg-[#00934a] transition-colors rounded-xl py-2.5 px-5 cursor-pointer'
          >
            Clear filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-11 w-full justify-items-center gridAdjust'>
      {
        filteredData.map((result) => {
          return (
            <div key={result.id}
              onClick={() => onPlayerClick(result.id)}
              className=' w-[255px] h-[226px] md:w-[240px] md:h-[211px] lg:w-[306px] lg:h-[272px] flex gap-2 cursor-pointer relative rounded-[10px] transition-transform duration-300 hover:scale-105'>

              <div className={`flex flex-row-reverse items-center gap-[8px] px-[9px] py-[4.5px] rounded-[99px] font-manrope text-[10px] font-bold absolute top-3 left-3 md:top-2 md:left-2 lg:top-3 lg:left-3 bg-[#155535] text-[#00D46A]`}>
                {result?.status}
                <div className={`w-[8px] h-[8px] rounded-full bg-[#00D46A]`}>
                </div>
              </div>

              <div className='h-full w-[226px] rounded-[10px] bg-[url(./assets/playerCard.png)] bg-cover flex items-end'>

                {/* gradient panel: three stacked layers (silhouette / gradient / text) */}
                <div className='w-full h-[126px] relative rounded-b-[10px] '>

                  {/* silhouette - bottom layer */}
                  <div className='absolute inset-0 z-10 flex items-end justify-center '>
                    <img src={result.playerPhoto ? result.playerPhoto : silhouette} alt="" className='w-[174px] h-[187px] md:w-[165px] md:h-[175px] lg:w-[200px] lg:h-[224px] object-contain object-bottom' />
                  </div>

                  {/* gradient - middle layer, sits above the silhouette */}
                  <div className='absolute inset-0 z-20 bg-gradient-to-b from-transparent to-[#00D46A] rounded-b-[10px]' />

                  {/* text content - top layer */}
                  <div className='relative z-30 h-full flex flex-col items-center justify-center gap-1 lg:gap-2 '>
                    <div className='px-[7.9px] bg-[#00D46A] mt-9 lg:mt-6'>
                      <p className='font-bebas font-normal text-[17px] lg:text-[20px]'>{result.playerName}</p>
                    </div>

                    <div className='flex gap-4 text-center'>
                      <div className='flex flex-col items-center justify-center'>
                        <p className=' text-[10px] lg:text-[12px] font-medium text-[#FFFFFF]'>Age</p>
                        <p className='lg:text-[20px] font-bold text-[#FFFFFF]'>{getAge(result.DOB)}</p>
                      </div>

                      <div className=' flex flex-col items-center justify-center'>
                        <p className='text-[10px] lg:text-[12px] font-medium text-[#FFFFFF]'>Position</p>
                        <p className='lg:text-[20px] font-bold text-[#FFFFFF]'>{result.position}</p>
                      </div>

                      <div className='flex flex-col items-center justify-center'>
                        <p className='text-[10px] lg:text-[12px] font-medium text-[#FFFFFF]'> {'Height (cm)'}</p>
                        <p className='lg:text-[20px] font-bold text-[#FFFFFF]'>{result.height}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              <div className='h-full w-[69.1px] rounded-r-3xl flex flex-col justify-between'>

                {/* G/A */}
                <div className='bg-[#00D46A] w-full h-[63px] lg:h-[75.9px] rounded-tr-2xl flex flex-col justify-center items-center'>
                  <span className='font-manrope font-bold text-[11px] leading-[100%]'>G/A</span>
                  <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{(result.goals + result.assists) ? (result.goals + result.assists) : "?"}</span>
                </div>

                {/* APP. */}
                <div className='w-full justify-center items-center flex flex-col'>
                  <span className='font-manrope font-bold text-[11px] leading-[100%]'>APP.</span>
                  <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{result.playerAppearance ? result.playerAppearance : "?"}</span>
                </div>

                {/* current club — optional field, only shown once an admin actually sets it */}
                {result.currentClubName && (
                  <div
                    className='bg-[url(./assets/bgEffect.png)] bg-contain bg-[#00D46A] w-[48px] h-[108px] lg:w-[57px] lg:h-[130px] rounded-br-2xl flex justify-center items-end pb-3'>
                    <img src={result.currentClubLogo ? result.currentClubLogo : udeSportLogo} alt="" className='w-[30px] h-[30px]' />
                  </div>
                )}

              </div>

            </div>
          )
        })
      }
    </div>
  )
}

export default FetchPlayers





