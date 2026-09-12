import { useGetSinglePlayer } from "@/hooks/useApi"
import leftFootHighlight from "@/assets/leftFootHighlight.png"
import leftFootDim from "@/assets/leftFootDim.png"
import rightFootHighlight from "@/assets/rightFootHighlight.png"
import rightFootDim from "@/assets/rightFootDim.png"
import noClubLogo from "@/assets/currentClubLogo.png"
import closeIcon from "@/assets/closeIcon.png"
import silhouette from '@/assets/silhouette.png'
import { Skeleton } from "@mui/material"
import { useEffect } from "react"
import { STATUS_LABEL } from "@/lib/playerStatus"


interface PlayerFullDetailsProps {
  id: string;
  onClose: () => void;
}

const PlayerFullDetails = ({ id, onClose }: PlayerFullDetailsProps) => {
  const { data: player, isLoading, isError } = useGetSinglePlayer(id);

  // lock background scroll while the modal is mounted; restore on unmount
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  if (isLoading) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-none md:backdrop-blur-sm md:bg-black/40 p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen h-screen md:h-fit md:w-fit md:max-w-[90vw] md:max-h-[90vh] md:px-7 md:py-8 bg-white dark:bg-[#0d1117] rounded-2xl flex flex-col gap-5 overflow-y-auto relative"
        >
          {/* close icon stays real so the user can bail out mid-load */}
          <img
            src={closeIcon}
            alt="close"
            onClick={onClose}
            className="w-[27px] h-[27px] absolute md:top-6 md:right-6 top-3 right-2 cursor-pointer z-10"
          />

          <div className="flex flex-col md:flex-row md:gap-10 gap-15 mt-4 pt-10 md:pt-0">
            {/* image panel + silhouette */}
            <div className="relative w-[360px] h-[300px] rounded-[10px] bg-[#f0f0f0] flex items-end justify-center overflow-hidden self-center">
              <img
                src={silhouette}
                alt=""
                className="w-[280px] h-[290px] opacity-20 animate-pulse"
              />
            </div>

            <div className="flex flex-col gap-6">
              <Skeleton variant="text" width={220} height={60} />       {/* name */}
              <div className="flex items-center gap-10">
                <Skeleton variant="rounded" width={120} height={38} />  {/* status pill */}
                <Skeleton variant="text" width={80} />                  {/* position */}
              </div>
              <div className="flex gap-2 lg:gap-3">
                <Skeleton variant="rounded" width={100} height={100} />
                <Skeleton variant="rounded" width={100} height={100} />
                <Skeleton variant="rounded" width={100} height={100} />
                <Skeleton variant="rounded" width={110} height={90} sx={{ ml: 3 }} />
              </div>
              <div className="flex gap-4 items-center">
                <Skeleton variant="circular" width={50} height={50} />
                <div className="flex flex-col gap-1">
                  <Skeleton variant="text" width={90} />
                  <Skeleton variant="text" width={120} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-15 md:gap-40 mt-10 md:mt-0">
            {/* bio data column — 6 rows */}
            <div className="w-[320px] flex flex-col gap-3">
              <Skeleton variant="text" width={120} height={30} />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="text" width='100%' height={28} />
              ))}
            </div>

            {/* brief history — a paragraph of lines */}
            <div className="w-[400px] flex flex-col gap-2">
              <Skeleton variant="text" width={160} height={30} />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="text" width='90%' height={20} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !player) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-none md:backdrop-blur-sm md:bg-black/40 p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen h-screen md:h-fit md:w-fit md:min-w-[320px] md:max-w-[90vw] md:max-h-[90vh] md:px-7 md:py-10 bg-white dark:bg-[#0d1117] rounded-2xl flex flex-col items-center justify-center text-center gap-4 relative px-6"
        >
          {/* close icon so the user can dismiss the failed modal */}
          <img
            src={closeIcon}
            alt="close"
            onClick={onClose}
            className="w-[27px] h-[27px] absolute md:top-6 md:right-6 top-3 right-2 cursor-pointer z-10"
          />

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
            <p className="font-manrope font-bold text-[#060A0F] dark:text-white text-lg mb-1">
              We couldn't load this player
            </p>
            <p className="font-manrope font-normal text-[#68717D] dark:text-gray-400 text-sm max-w-xs">
              Something went wrong fetching this player's details. Please try again.
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-manrope font-bold text-white text-sm bg-[#00A553] hover:bg-[#00934a] transition-colors rounded-xl py-2.5 px-5 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClose}
      className="backdrop-blur-none fixed inset-0 z-[999] flex items-center justify-center md:backdrop-blur-sm md:bg-black/40 p-4"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-screen h-screen pt-10 py-5 md:h-fit md:w-fit md:max-w-[90vw] md:max-h-[90vh] md:px-7 md:py-8 bg-white dark:bg-[#0d1117] text-[#060A0F] dark:text-white md:rounded-2xl flex flex-col gap-10 md:gap-5 overflow-y-auto relative"
      >
        {/* close icon - sits in the top-right corner, above the name; calls onClose */}
        <img
          src={closeIcon}
          alt="close"
          onClick={onClose}
          className="w-[27px] h-[27px] absolute top-3 right-1 md:top-6 md:right-6 cursor-pointer z-10"
        />

        <div className='flex flex-col gap-[8px] relative md:hidden'>
          <div className='w-[100px] h-[37px] flex gap-[8px] items-center justify-center bg-[#00D46A4D] rounded-full font-manrope text-[#00A553] font-bold'>
            <span className='w-[8px] h-[8px] bg-[#00D46A] rounded-lg'></span>
            Roster
          </div>
          <p className='font-normal text-[64px] leading-[69px] font-bebas text-[#060A0F] dark:text-white'>
            <span className='block'>PLAYER</span>
            INFORMATION
          </p>
        </div>

        <div className="flex flex-col items-center md:flex-row gap-15 lg:gap-20 md:mt-4 mb-10 md:mb-0">
          <div className="relative w-[330px] h-[290px]  md:w-[360px] md:h-[300px] rounded-[10px] bg-[url(./assets/PlayerFullDetailsBG.png)] bg-cover">
            <div className='absolute inset-0 z-10 flex items-end justify-center '>
              <img src={player?.playerPhoto ? player?.playerPhoto : silhouette} alt="" className='w-[270px] h-[280px] md:w-[280px] md:h-[290px] rounded-b-[10px]' />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-[48px] leading-7">{player?.playerFullName}</h1>

            {/* Player Status */}

            <div className="flex items-center gap-10">
              {
                player?.status && (
                  <div className={`flex items-center gap-[8px] px-[16px] py-[8px] rounded-[99px] font-manrope text-[16px] font-bold
                ${player?.status === "TRANSFERRED" ? "bg-[#00D46A4D] text-[#00A553]" : player?.status === "NEGOTIATION" ? "bg-[#D47F0033] text-[#D47F00]" : "bg-[#1778FB33] text-[#045BD0]"}`}>
                    {STATUS_LABEL[player.status]}
                    <div className={`w-[8px] h-[8px] rounded-full
                  ${player?.status === "TRANSFERRED" ? "bg-[#00D46A]" : player?.status === "NEGOTIATION" ? "bg-[#D47F00]" : "bg-[#045BD0]"}`}>
                    </div>
                  </div>
                )}
              <p className="font-manrope text-[20px]">{player?.position}</p>
            </div>

            <div className="flex gap-2 lg:gap-3">
              <div className="w-[78px] h-[78px] lg:w-[100px] lg:h-[100px] bg-[#1FC16B1A] rounded-2xl flex flex-col items-center justify-center">
                <p className="font-wdxl-lubrifont-sc text-[37px] lg:text-[48px] leading-[130%]">{player?.goals}</p>
                <p className="font-manrope text-[9px] text-[#8E8E8E] leading-[130%] font-bold">GOALS</p>
              </div>

              <div className="w-[78px] h-[78px] lg:w-[100px] lg:h-[100px] bg-[#1FC16B1A] rounded-2xl flex flex-col items-center justify-center">
                <p className="font-wdxl-lubrifont-sc text-[37px] lg:text-[48px] leading-[130%]">{player?.assists}</p>
                <p className="font-manrope text-[9px] text-[#8E8E8E] leading-[130%] font-bold">ASSISTS</p>
              </div>

              <div className="w-[78px] h-[78px] lg:w-[100px] lg:h-[100px] bg-[#1FC16B1A] rounded-2xl flex flex-col items-center justify-center">
                <p className="font-wdxl-lubrifont-sc text-[37px] lg:text-[48px] leading-[130%]">{player?.rating}</p>
                <p className="font-manrope text-[9px] text-[#8E8E8E] leading-[130%] font-bold">RATINGS</p>
              </div>

              {/* Preferred Foot */}
              {
                player?.preferredFoot && (

                  <div className="flex ml-4 lg:ml-6 gap-3">
                    <div className="relative">
                      <img src={player?.preferredFoot === "Left" ? leftFootHighlight : leftFootDim} alt="" className="w-[35px] h-[70px] lg:w-[50px] lg:h-[90px]" />
                      <p className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${player?.preferredFoot === "Left" ? "text-white" : "text-[#676768]"}`}>L</p>
                    </div>
                    <div className="relative">
                      <img src={player?.preferredFoot === "Right" ? rightFootHighlight : rightFootDim} alt="" className="w-[35px] h-[70px] lg:w-[50px] lg:h-[90px]" />
                      <p className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${player?.preferredFoot === "Right" ? "text-white" : "text-[#676768]"}`}>R</p>
                    </div>
                  </div>

                )
              }
            </div>

            <div className="flex gap-4">
              <div>
                <img src={player?.currentClubLogo ? player.currentClubLogo : noClubLogo} alt="" className="w-[50px]" />
              </div>
              <div>
                <p className="font-manrope font-medium text-lg text-[#060A0F] dark:text-white">Club Name</p>
                <p className="font-manrope text-[16px] text-[#060A0F] dark:text-white">{player?.currentClubName ? player?.currentClubName : "Unknown"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio-data and History */}
        <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-15 lg:gap-40">
          <div className="w-full md:w-[320px]">
            <p className="pb-2 font-bebas text-[26px] text-[#00D46A]">BIO DATA</p>
            <div>
              <div className="flex justify-between pb-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Full Name:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.playerFullName ? player?.playerFullName : "Unknown"}</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Date of Birth:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.DOB ? player?.DOB : "Unknown"}</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Nationality:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.nationality ? player?.nationality : "Unknown"}</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Height:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.height ? player?.height : "Unknown"}cm</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Preferred foot:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.preferredFoot ? player?.preferredFoot : "Unknown"}</p>
              </div>
              <div className="flex justify-between pb-2 pt-2 border-b border-b-[#CACACA] dark:border-b-white/15 font-manrope">
                <p className="text-[18px] text-[#8E8E8E] dark:text-gray-400">Age Group:</p>
                <p className="text-end text-[20px] text-[#060A0F] dark:text-white">{player?.ageGroup ? player?.ageGroup : "Unknown"}</p>
              </div>
            </div>
          </div>


          <div className=" md:w-[300px] lg:w-[400px]">
            <p className="font-bebas text-[#00D46A] text-[26px]">BRIEF HISTORY</p>
            <div className="font-manrope font-medium text-[#8E8E8E] dark:text-gray-400 leading-[24px] lg:text-[16px] w-[90%]">
              <p>
                {player?.playerHistory ? player.playerHistory : "No Player History"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerFullDetails

