import { BadgeCheck, Award as AwardIcon } from "lucide-react"
import noProfilePhoto from "@/assets/no profile photo.jpg"
import PageWrapper from "@/components/page-wrapper"
import { useGetStaff, useGetAwards } from "@/hooks/useApi"
import udeSportLogo from "@/assets/udess.png"

const About = () => {
  const { data: staff, isLoading: staffLoading } = useGetStaff()
  const { data: awards, isLoading: awardsLoading } = useGetAwards()

  return (
    <PageWrapper className="w-full px-5 lg:px-10 py-14 bg-white dark:bg-black transition-colors duration-300">
      {/* Hero */}
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-20">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-[#00D46A4D] flex flex-row justify-center items-center gap-2 rounded-3xl py-2 px-3 w-fit">
            <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
            <p className="font-manrope font-bold text-[#00A553] text-[16px] leading-[1.3]">
              Est. 1998
            </p>
          </div>

          <h1 className="font-bebas text-[#060A0F] dark:text-white text-[clamp(44px,6vw,64px)] leading-[1.08]">
            ABOUT UDESPORT
          </h1>

          <p className="font-manrope font-medium text-[#8E8E8E] dark:text-gray-400 text-[18px] leading-[27px] max-w-lg">
            Nigeria's most prolific football management and development academy.
            From grassroots to global stages. Uche Dominic Egbukwu Soccer Sports
            Management Ltd is registered with the Corporate Affairs Commission,
            Federal Republic of Nigeria (CAC) RC 788922.
          </p>
        </div>

        <div className="flex-1 w-full">
          <div className="bg-[#060A0F] rounded-2xl border-b-4 border-l-4 border-[#00D46A] w-full aspect-video flex items-center justify-center">
            <img src={udeSportLogo} alt="UdeSport crest" className="w-24 h-24 lg:w-32 lg:h-32" />
          </div>
        </div>
      </div>

      {/* Who are we / What we do */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
        <div className="flex flex-col gap-4">
          <h2 className="font-bebas text-[#060A0F] dark:text-white text-[32px] leading-none">
            WHO ARE WE?
          </h2>
          <p className="font-manrope text-[#68717D] dark:text-gray-400 text-[16px] leading-[24px]">
            UdeSport Management Limited is a licensed football scouting and player
            placement organisation founded by Dominic Egbukwu. Headquartered in
            Nigeria, we have operated for over 25 years identifying, assessing, and
            placing West African talent at professional clubs across Europe, Asia,
            and Africa.
          </p>
          <p className="font-manrope text-[#68717D] dark:text-gray-400 text-[16px] leading-[24px]">
            Our scouting methodology is built on systematic player evaluation —
            technical ability, physical profile, positional intelligence, mental
            resilience, and long-term development potential. Every player in our
            database has been assessed against professional standards before any
            club recommendation is made.
          </p>
          <p className="font-manrope text-[#68717D] dark:text-gray-400 text-[16px] leading-[24px]">
            Our placement record speaks directly to the quality of our scouting
            process. 38+ verified placements at the highest levels of the game,
            including Vincent Enyeama, Kelechi Iheanacho, Victor Osimhen, Ogenyi
            Onazi, and Kenneth Omeruo. These are not discoveries by chance — they
            are the result of a structured, repeatable scouting system refined
            over two decades.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-bebas text-[#060A0F] dark:text-white text-[32px] leading-none">
            WHAT WE DO
          </h2>
          <p className="font-manrope text-[#68717D] dark:text-gray-400 text-[16px] leading-[24px]">
            UdeSport operates across three scouting divisions: Talent
            Identification (ages 15–23), Player Assessment and Recommendation,
            and International Club Placement.
          </p>
          <p className="font-manrope text-[#68717D] dark:text-gray-400 text-[16px] leading-[24px]">
            Our scouting coverage spans three active centres — Lagos, Abuja, and
            Port Harcourt — running structured observation programmes across the
            U-17, U-20, and U-23 age categories.
          </p>
          <p className="font-manrope text-[#68717D] dark:text-gray-400 text-[16px] leading-[24px]">
            Each player in our system carries an individual scouting profile,
            updated on a rolling basis to reflect current form, physical
            development, and positional progress.
          </p>
          <p className="font-manrope text-[#68717D] dark:text-gray-400 text-[16px] leading-[24px]">
            We maintain established working relationships with club scouts,
            technical directors, and recruitment departments across the Premier
            League, La Liga, Serie A, Bundesliga, Ligue 1, and leagues across Asia
            and the Middle East. When a club comes to UdeSport, they are not
            browsing — they are accessing a pre-screened, professionally
            documented roster of verified talent.
          </p>
        </div>
      </div>

      {/* Our Staff */}
      <div className="mb-20">
        <div className="bg-[#00D46A4D] flex flex-row justify-center items-center gap-2 rounded-3xl py-2 px-3 w-fit mb-6">
          <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
          <p className="font-manrope font-bold text-[#00A553] text-[16px] leading-[1.3]">
            The Team
          </p>
        </div>

        <h2 className="font-bebas text-[#060A0F] dark:text-white text-[32px] leading-none mb-3">
          OUR STAFF
        </h2>
        <p className="font-manrope text-[#68717D] dark:text-gray-400 text-[16px] leading-[24px] max-w-xl mb-8">
          25 years of combined expertise in player development, contract
          negotiation, and international placement. This is the team that makes
          it happen.
        </p>

        {staffLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[220px] sm:w-[258px] h-[300px] rounded-[40px] bg-gray-100 dark:bg-white/5 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : !staff || staff.length === 0 ? (
          <p className="font-manrope text-[#8E8E8E] dark:text-gray-400 text-sm">Staff details coming soon.</p>
        ) : (
          // Matches the Figma team-card design: green card, white hairline
          // border, a square photo (real Cloudinary upload, falling back to
          // the generic silhouette when a member has none yet), and the
          // name/role stacked underneath with a verified checkmark.
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 lg:mx-0 lg:px-0">
            {staff.map((member) => (
              <div
                key={member.id}
                className="w-[220px] sm:w-[258px] flex-shrink-0 bg-[#00D46A] border-[1.5px] border-white rounded-[40px] p-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-start"
              >
                <div className="w-full aspect-square rounded-[32px] border border-white overflow-hidden bg-[#060A0F]/20">
                  <img
                    src={member.photo || noProfilePhoto}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 p-4 w-full">
                  <div className="flex items-center gap-1">
                    <p className="font-manrope font-medium text-white text-[16px] sm:text-[18px] leading-[1.5] truncate">
                      {member.name}
                    </p>
                    {member.verified && (
                      <BadgeCheck className="w-4 h-4 text-white flex-shrink-0" fill="#00A553" />
                    )}
                  </div>
                  <p className="font-manrope text-[#EBEBEB] text-[14px] sm:text-[16px] leading-[1.5]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Awards & Certification */}
      <div>
        <div className="bg-[#00D46A4D] flex flex-row justify-center items-center gap-2 rounded-3xl py-2 px-3 w-fit mb-6">
          <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
          <p className="font-manrope font-bold text-[#00A553] text-[16px] leading-[1.3]">
            Recognition
          </p>
        </div>

        <h2 className="font-bebas text-[#060A0F] dark:text-white text-[32px] leading-none mb-8">
          AWARD &amp; CERTIFICATION
        </h2>

        {awardsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : !awards || awards.length === 0 ? (
          <p className="font-manrope text-[#8E8E8E] dark:text-gray-400 text-sm">Certifications coming soon.</p>
        ) : (
          // Full-bleed certificate/logo image with a dark gradient scrim at
          // the bottom holding the name + subtitle, matching the Figma card
          // (not a small icon with a caption underneath).
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {awards.map((award) => (
              <div
                key={award.id}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#060A0F]"
              >
                {award.image ? (
                  <img
                    src={award.image}
                    alt={award.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#00D46A4D] flex items-center justify-center">
                      <AwardIcon className="w-5 h-5 text-[#00D46A]" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-manrope font-bold text-white text-[14px] sm:text-[16px] leading-[1.3]">{award.name}</p>
                  <p className="font-manrope text-[#D7D7D7] text-[12px] sm:text-[13px] leading-[1.3]">{award.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default About


