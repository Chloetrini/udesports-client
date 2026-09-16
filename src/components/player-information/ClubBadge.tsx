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
 * Renders a player's club crest — just one club logo by default, or a
 * previous → current transfer stack (small logo, down arrow, bigger logo)
 * only when there's an actual before-and-after on record (both a previous
 * AND a current club). A fresh signing has no previous club, so it shows
 * just the current-club logo. A free agent with no current club but a
 * last-known previous club also gets a plain single logo — labeled "Last
 * Club" — instead of a transfer arrow pointing at nothing, which is what
 * used to render when only previousClubName was set.
 *
 * No placeholder logo is substituted when an image is missing — if there's
 * no logo on file for the club being shown, nothing renders rather than
 * showing a generic/fallback mark.
 */
export default function ClubBadge({
  previousClubName,
  previousClubLogo,
  currentClubName,
  currentClubLogo,
  size = "sm",
}: ClubBadgeProps) {
  // A transfer arrow only makes sense with a genuine before-and-after —
  // both a previous and a current club actually on record.
  const hasTransfer = !!previousClubName && !!currentClubName
  // No current club, but a last-known previous club is on file (e.g. a
  // free agent) — show that club plainly, not as half of a transfer stack.
  const showLastClubOnly = !hasTransfer && !!previousClubName && !currentClubName

  const soleLogo = showLastClubOnly ? previousClubLogo : currentClubLogo
  const soleName = showLastClubOnly ? previousClubName : currentClubName
  const soleLabel = showLastClubOnly ? "Last Club" : "Club Name"

  if (size === "lg") {
    if (hasTransfer) {
      if (!currentClubLogo && !previousClubLogo) return null
      return (
        <div className="flex flex-col gap-3">
          {previousClubLogo && (
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
                <p className="font-manrope font-medium text-lg text-[#060A0F] dark:text-white">Current Club</p>
                <p className="font-manrope text-[16px] text-[#060A0F] dark:text-white">{currentClubName}</p>
              </div>
            </div>
          )}
        </div>
      )
    }

    // Not a transfer — plain single-club display, either the current club
    // (normal case) or the last-known previous club (free agent case).
    if (!soleLogo) return null
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
            <img
              src={soleLogo}
              alt=""
              className="max-w-[40px] max-h-[40px] object-contain"
            />
          </div>
          <div>
            <p className="font-manrope font-medium text-lg text-[#060A0F] dark:text-white">{soleLabel}</p>
            <p className="font-manrope text-[16px] text-[#060A0F] dark:text-white">{soleName}</p>
          </div>
        </div>
      </div>
    )
  }

  // size === "sm" | "md" — compact icon-only stack for the card badge
  const dims =
    size === "md"
      ? { current: "w-[34px] h-[34px] lg:w-[66px] lg:h-[66px]", previous: "w-[34px] h-[34px] lg:w-[66px] lg:h-[66px]", arrow: "w-[20px] h-[20px]", gap: "gap-2" }
      : { current: "w-[34px] h-[34px] lg:w-[40px] lg:h-[40px]", previous: "w-[30px] h-[30px] lg:w-[35px] lg:h-[35px]", arrow: "w-[12px] h-[12px]", gap: "gap-1" }

  if (!hasTransfer) {
    if (!soleLogo) return null
    return <img src={soleLogo} alt="" className={size === "md" ? "w-[78px] h-[78px]" : "w-[44px] h-[44px]"} />
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
