import { ArrowDown } from "lucide-react"
import udeSportLogo from "@/assets/udeSportLogo.png"

interface ClubBadgeProps {
  previousClubName?: string | null
  previousClubLogo?: string | null
  currentClubName?: string | null
  currentClubLogo?: string | null
  /** "sm" = compact icon-only stack for the player grid card badge.
   *  "md" = same icon-only stack, scaled up for the larger featured-players
   *  carousel badge. "lg" = icon + club name, used on the player detail page. */
  size?: "sm" | "md" | "lg"
  /** Placeholder image shown when a logo is missing — defaults to the
   *  UdeSport mark, but callers with their own existing placeholder
   *  (e.g. the player detail page) can pass it through here instead. */
  fallbackLogo?: string
}

/**
 * Renders a player's club crest — just the current club by default, or a
 * previous → current transfer stack (small logo, down arrow, bigger logo)
 * whenever a previous club is actually on record. A fresh signing has no
 * previous club, so it only ever shows the single current-club logo, same
 * as before this component existed.
 */
export default function ClubBadge({
  previousClubName,
  previousClubLogo,
  currentClubName,
  currentClubLogo,
  size = "sm",
  fallbackLogo = udeSportLogo,
}: ClubBadgeProps) {
  const hasTransfer = !!previousClubName

  if (size === "lg") {
    return (
      <div className="flex flex-col gap-3">
        {hasTransfer && (
          <>
            <div className="flex items-center gap-4">
              <div className="w-[38px] h-[38px] flex items-center justify-center shrink-0 opacity-70">
                <img
                  src={previousClubLogo || fallbackLogo}
                  alt=""
                  className="max-w-[38px] max-h-[38px] object-contain"
                />
              </div>
              <div>
                <p className="font-manrope text-xs text-[#68717D] dark:text-gray-400">Previous Club</p>
                <p className="font-manrope text-[15px] text-[#060A0F] dark:text-white">{previousClubName}</p>
              </div>
            </div>
            <ArrowDown className="w-4 h-4 text-[#00D46A] ml-4" />
          </>
        )}
        <div className="flex items-center gap-4">
          <div className="w-[50px] h-[50px] flex items-center justify-center shrink-0">
            <img
              src={currentClubLogo || fallbackLogo}
              alt=""
              className="max-w-[50px] max-h-[50px] object-contain"
            />
          </div>
          <div>
            <p className="font-manrope font-medium text-lg text-[#060A0F] dark:text-white">
              {hasTransfer ? "Current Club" : "Club Name"}
            </p>
            <p className="font-manrope text-[16px] text-[#060A0F] dark:text-white">{currentClubName}</p>
          </div>
        </div>
      </div>
    )
  }

  // size === "sm" | "md" — compact icon-only stack for the card badge
  const dims =
    size === "md"
      ? { current: "w-[45px] h-[45px]", previous: "w-[26px] h-[26px]", arrow: "w-[14px] h-[14px]", gap: "gap-1" }
      : { current: "w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]", previous: "w-[16px] h-[16px] lg:w-[18px] lg:h-[18px]", arrow: "w-[10px] h-[10px]", gap: "gap-0.5" }

  if (!hasTransfer) {
    return <img src={currentClubLogo || fallbackLogo} alt="" className={size === "md" ? "w-[53px] h-[53px]" : "w-[30px] h-[30px]"} />
  }

  return (
    <div className={`flex flex-col items-center ${dims.gap}`}>
      <img
        src={previousClubLogo || fallbackLogo}
        alt=""
        className={`${dims.previous} object-contain opacity-60`}
      />
      <ArrowDown className={`${dims.arrow} text-white/80`} strokeWidth={3} />
      <img
        src={currentClubLogo || fallbackLogo}
        alt=""
        className={`${dims.current} object-contain`}
      />
    </div>
  )
}
