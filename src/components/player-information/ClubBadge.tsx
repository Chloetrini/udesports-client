import arrowDownIcon from "@/assets/arrow.png"

interface ClubBadgeProps {
  previousClubName?: string | null
  previousClubLogo?: string | null
  currentClubName?: string | null
  currentClubLogo?: string | null
  /** "sm" = compact icon-only stack for the player grid card badge.
   *  "md" = same icon-only stack, scaled up for the larger featured-players
   *  carousel badge. "lg" = icon + club name, used on the player detail page. */
  size?: "sm" | "md" | "lg"
}

/**
 * Renders a player's club crest — just the current club by default, or a
 * previous → current transfer stack (small logo, down arrow, bigger logo)
 * whenever a previous club is actually on record. A fresh signing has no
 * previous club, so it only ever shows the single current-club logo, same
 * as before this component existed.
 *
 * No placeholder logo is substituted when an image is missing — if there's
 * no current club logo on file, nothing renders rather than showing a
 * generic/fallback mark.
 */
export default function ClubBadge({
  previousClubName,
  previousClubLogo,
  currentClubName,
  currentClubLogo,
  size = "sm",
}: ClubBadgeProps) {
  const hasTransfer = !!previousClubName

  if (size === "lg") {
    if (!currentClubLogo && !hasTransfer) return null
    return (
      <div className="flex flex-col gap-3">
        {hasTransfer && previousClubLogo && (
          <>
            <div className="flex items-center gap-4">
              <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0 opacity-70">
                <img
                  src={previousClubLogo}
                  alt=""
                  className="max-w-[40px] max-h-[40px] object-contain"
                />
              </div>
              <div>
                <p className="font-manrope text-xs text-[#68717D] dark:text-gray-400">Previous Club</p>
                <p className="font-manrope text-[15px] text-[#060A0F] dark:text-white">{previousClubName}</p>
              </div>
            </div>
            <img src={arrowDownIcon} alt="Arrow Down" className="w-4 h-4 text-[#00D46A] ml-3" />
          </>
        )}
        {currentClubLogo && (
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
              <img
                src={currentClubLogo}
                alt=""
                className="max-w-[40px] max-h-[40px] object-contain"
              />
            </div>
            <div>
              <p className="font-manrope font-medium text-lg text-[#060A0F] dark:text-white">
                {hasTransfer ? "Current Club" : "Club Name"}
              </p>
              <p className="font-manrope text-[16px] text-[#060A0F] dark:text-white">{currentClubName}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // size === "sm" | "md" — compact icon-only stack for the card badge
  const dims =
    size === "md"
      ? { current: "w-[66px] h-[66px]", previous: "w-[66px] h-[66px]", arrow: "w-[20px] h-[20px]", gap: "gap-2" }
      : { current: "w-[34px] h-[34px] lg:w-[40px] lg:h-[40px]", previous: "w-[30px] h-[30px] lg:w-[35px] lg:h-[35px]", arrow: "w-[12px] h-[12px]", gap: "gap-1" }

  if (!hasTransfer) {
    if (!currentClubLogo) return null
    return <img src={currentClubLogo} alt="" className={size === "md" ? "w-[78px] h-[78px]" : "w-[44px] h-[44px]"} />
  }

  return (
    <div className={`flex flex-col items-center ${dims.gap}`}>
      {previousClubLogo && (
        <img
          src={previousClubLogo}
          alt=""
          className={`${dims.previous} object-contain opacity-60`}
        />
      )}
      <img src={arrowDownIcon} alt="Arrow Down" className={dims.arrow} />
      {currentClubLogo && (
        <img
          src={currentClubLogo}
          alt=""
          className={`${dims.current} object-contain`}
        />
      )}
    </div>
  )
}
