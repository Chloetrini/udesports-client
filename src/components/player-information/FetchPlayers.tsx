import { useGetPlayers } from '@/hooks/useApi';
import Skeleton from '@mui/material/Skeleton';
import noPlayers from '@/assets/noPlayers.png'
import { getAge } from '@/hooks/getAge';
import silhouette from '@/assets/silhouette.png'
import type { AgeGroup, Status } from './FilterPlayers';
import { STATUS_LABEL } from '@/lib/playerStatus';
import PlayerImage from './PlayerImage';
import { Award } from 'lucide-react';
import ClubBadge from './ClubBadge';


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
    <div className='w-[280px] md:w-[240px] lg:w-[306px] h-[226px] md:h-[211px] lg:h-[272px] flex gap-2 relative'>
      {/* left: main card area with silhouette — a fixed, centered width on
          mobile (matching md/lg) rather than stretching edge-to-edge. */}
      <div className='h-full flex-1 rounded-[10px] bg-[#f0f0f0] flex items-end justify-center overflow-hidden'>
        {/* silhouette shape — a rounded block standing in for the player image */}
        <img
          src={silhouette}
          alt=""
          className='w-[174px] h-[187px] lg:w-[200px] lg:h-[224px] opacity-20 animate-pulse'
        />
      </div>

      {/* right: the G/A · APP · club strip */}
      <div className='h-full w-[69.1px] shrink-0 rounded-r-3xl flex flex-col justify-between gap-1'>
        <Skeleton variant="rounded" width='100%' height={63} />
        <Skeleton variant="rounded" width='100%' height={40} />
        <Skeleton variant="rounded" width={48} height={108} sx={{ borderBottomRightRadius: 16 }} />
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gridAdjust gap-11 w-full justify-items-center'>
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
    // "Professional" isn't a numeric age bracket like 17/21/23 — it matches
    // the player's ageGroup field directly instead of a computed-age threshold.
    const ageMatch =
      ageFilter === "All" ||
      (ageFilter === "Professional" ? player.ageGroup === "Professional" : currentAge <= ageFilter)

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
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-15 justify-items-center gridAdjust content-start self-start'>
      {
        filteredData.map((result) => {
          return (
            <div key={result.id}
              onClick={() => onPlayerClick(result.id)}
              className=' w-[280px] md:w-[240px] lg:w-[306px] h-[226px] md:h-[211px] lg:h-[272px] flex gap-2 cursor-pointer relative rounded-[10px] transition-transform duration-300 hover:scale-105'>

              <div className={`flex flex-row-reverse items-center gap-[8px] px-[9px] py-[4.5px] rounded-[99px] font-manrope text-[10px] font-bold absolute top-3 left-3 md:top-2 md:left-2 lg:top-3 lg:left-3 bg-[#155535] text-[#00D46A]`}>
                {result?.status && STATUS_LABEL[result.status]}
                <div className={`w-[8px] h-[8px] rounded-full bg-[#00D46A]`}>
                </div>
              </div>

              <div className='h-full flex-1 rounded-[10px] bg-[url(./assets/playerCard.png)] bg-cover relative overflow-hidden'>

                {/* photo - fills the whole card, anchored to the top
                    (object-top) so the head sits high on the card instead
                    of being pushed down toward the name/stats panel. */}
                <PlayerImage
                  src={result.playerPhoto ? result.playerPhoto : silhouette}
                  alt=""
                  className='absolute inset-0 z-10 w-full h-full object-cover object-top'
                  skeletonClassName='absolute inset-0 z-10 w-full h-full'
                  width={600}
                />

                {/* gradient - overlays only the lower portion of the photo (shoulder height) */}
                <div className='absolute bottom-0 left-0 z-20 w-full h-[126px] bg-gradient-to-b from-transparent to-[#00D46A] rounded-b-[10px]' />

                {/* text content - sits on top of the gradient, over the shoulders rather than the face */}
                <div className='absolute bottom-0 left-0 z-30 w-full h-[126px] flex flex-col items-center justify-center gap-1 lg:gap-2'>
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
              <div className='h-full w-[69.1px] shrink-0 rounded-r-3xl overflow-hidden flex flex-col justify-between'>

                {/* G/A (outfield) or Saves/Clean Sheets (goalkeeper) — optional
                    stat, only shown once an admin has actually recorded one */}
                {result.position === "GK" ? (
                  (result.saves + result.cleanSheets) > 0 && (
                    <div className='bg-[#00D46A] w-full h-[63px] lg:h-[75.9px] flex flex-col justify-center items-center'>
                      <span className='font-manrope font-bold text-[11px] leading-[100%]'>SV/CS</span>
                      <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{result.saves + result.cleanSheets}</span>
                    </div>
                  )
                ) : (
                  (result.goals + result.assists) > 0 && (
                    <div className='bg-[#00D46A] w-full h-[63px] lg:h-[75.9px] flex flex-col justify-center items-center'>
                      <span className='font-manrope font-bold text-[11px] leading-[100%]'>G/A</span>
                      <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{result.goals + result.assists}</span>
                    </div>
                  )
                )}

                {/* APP. — optional, only shown once an admin has recorded an appearance count.
                    Free-text field (can hold "382+"), so check against "0"/blank rather than a numeric > 0. */}
                {result.playerAppearance && result.playerAppearance !== "0" && (
                  <div className='w-full justify-center items-center flex flex-col'>
                    <span className='font-manrope font-bold text-[11px] leading-[100%]'>APP.</span>
                    <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{result.playerAppearance}</span>
                  </div>
                )}

                {/* current club — always rendered so every card is the same
                    height; shows a "Retired" badge for a retired player, a
                    previous → current transfer stack when a previous club is
                    on record, or just the current club logo otherwise. */}
                <div
                  className='bg-[url(./assets/bgEffect.png)] bg-contain bg-[#00D46A] w-[48px] h-[108px] lg:w-[57px] lg:h-[130px] flex justify-center items-end pb-3'>
                  {result.status === "RETIRED" ? (
                    <div className='flex flex-col items-center gap-1'>
                      <div className='w-[22px] h-[22px] lg:w-[26px] lg:h-[26px] rounded-full bg-white/15 border border-white/30 flex items-center justify-center'>
                        <Award className='w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] text-white' strokeWidth={2} />
                      </div>
                      <span className='font-manrope font-bold text-[7px] lg:text-[8px] text-white text-center leading-none tracking-wide'>
                        RETIRED
                      </span>
                    </div>
                  ) : (
                    <ClubBadge
                      previousClubName={result.previousClubName}
                      previousClubLogo={result.previousClubLogo}
                      currentClubName={result.currentClubName}
                      currentClubLogo={result.currentClubLogo}
                    />
                  )}
                </div>

              </div>

            </div>
          )
        })
      }
    </div>
  )
}

export default FetchPlayers





