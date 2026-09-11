bash << 'OUTER_EOF'
set -e
echo "Applying UDESPORT dark-mode fix round 2..."
mkdir -p "$(dirname "src/types/dataTypes.ts")"
cat > src/types/dataTypes.ts << 'EOF_UDE2_29691645'


export type Player = {
  _id: string;
  playerPhoto: string,
  playerName: string,
  playerFullName: string,
  DOB: string,
  nationality: string,
  height: number,
  preferredFoot: string,
  ageGroup: "U-17" | "U-21" | "U-23",
  status: "Free" | "Transferred" | "Negotiation",
  position: string,
  goals: number,
  assists: number,
  rating: number,
  currentClubName: string,
  currentClubLogo: string,
  playerHistory: string,
  playerAppearance: number
  isFeatured:boolean
  isDraft:boolean
}

export type NewsCategory = 'TRANSFER' | 'ACADEMY' | 'ANNOUNCEMENT';

// export interface Admin {
//   id: string;
//   name: string;
//   avatarUrl?: string;
// }

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  headline: string;
  excerpt:string;
  subtitle: string | null;
  body: string;
  coverImage: string;
  author: string;
  date: string;
  published:boolean
  authorPhoto: string
  createdAt: string
}

// export interface Article {
//   id: number;
//   title: string;
//   subtitle: string;
//   excerpt: string;
//   author: string;
//   date: string;
//   readTime: string;
//   link: string;
//   authorPhoto: string;
//   articlePhoto: string;
// }

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  club: string;
  country: string;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  verified: boolean;
}

export interface Award {
  id: number;
  name: string;
  subtitle: string;
}

export interface Headlines {
  id: string;
  category: string;
  headline: string;
}

export interface GalleryImages {
 id: string;
 type: "image" | "video";
 link: string;
 title: string;
 description: string;
}
export type QuickUpdateCategory = 'TRANSFER' | 'ACADEMY' | 'ANNOUNCEMENT' | 'MILESTONE' | 'INTERNATIONAL';

export interface QuickUpdate {
  id: string;
  headline: string;
  category: QuickUpdateCategory;
  createdAt: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}


EOF_UDE2_29691645
echo "  wrote src/types/dataTypes.ts"
mkdir -p "$(dirname "src/routes/main/layout.tsx")"
cat > src/routes/main/layout.tsx << 'EOF_UDE2_58519557'
import { Outlet } from 'react-router'
import NavBar from '@/components/universal/NavBar'
import Footer from '@/components/universal/Footer'
import UpdateBar from '@/components/universal/UpdateBar'

export default function MainLayout() {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <NavBar />
      <UpdateBar/>
      <Outlet />
      <Footer />
    </div>
  )
}


EOF_UDE2_58519557
echo "  wrote src/routes/main/layout.tsx"
mkdir -p "$(dirname "src/routes/main/home/index.tsx")"
cat > src/routes/main/home/index.tsx << 'EOF_UDE2_23928487'
import React from 'react';

import HeroSec from '@/components/home/HeroSec';
import SectionTwo from '@/components/home/SectionTwo';
import SectionThree from '@/components/home/SectionThree';
import SectionFive from '@/components/home/ArticleSection';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <HeroSec />
      <SectionTwo />
      <SectionThree />
      <SectionFive />
    </div>
  );
};

export default HomePage;


EOF_UDE2_23928487
echo "  wrote src/routes/main/home/index.tsx"
mkdir -p "$(dirname "src/components/player-information/FetchPlayers.tsx")"
cat > src/components/player-information/FetchPlayers.tsx << 'EOF_UDE2_85881928'
import { useGetPlayers } from '@/hooks/useApi';
import Skeleton from '@mui/material/Skeleton';
import noPlayers from '@/assets/noPlayers.png'
import udeSportLogo from '@/assets/udeSportLogo.png'
import { getAge } from '@/hooks/getAge';
import silhouette from '@/assets/silhouette.png'
import type { AgeGroup, Status } from './FilterPlayers';


type FetchPlayersProps = {
  ageFilter: AgeGroup
  statusFilter: Status
  searchInput: string
  onPlayerClick: (id: string) => void   // called with the player's _id when a card is clicked
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
      statusFilter === "All" || player.status === statusFilter

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
            <div key={result._id}
              onClick={() => onPlayerClick(result._id)}
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
                    <img src={result.playerPhoto ? result.playerPhoto : silhouette} alt="" className='w-[174px] h-[187px] md:w-[165px] md:h-[175px] lg:w-[200px] lg:h-[224px] rounded-b-[10px]' />
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

                {/* current club */}
                <div
                  className='bg-[url(./assets/bgEffect.png)] bg-contain bg-[#00D46A] w-[48px] h-[108px] lg:w-[57px] lg:h-[130px] rounded-br-2xl flex justify-center items-end pb-3'>
                  <img src={result.currentClubLogo ? result.currentClubLogo : udeSportLogo} alt="" className={result.currentClubLogo === "" ? 'w-[30px] h-[41px]' : 'w-[30px] h-[30px]'} />
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

EOF_UDE2_85881928
echo "  wrote src/components/player-information/FetchPlayers.tsx"
mkdir -p "$(dirname "src/components/player-information/FilterPlayers.tsx")"
cat > src/components/player-information/FilterPlayers.tsx << 'EOF_UDE2_80814284'
import filterIcon from '@/assets/filterIcon.png'
import searchIcon from '@/assets/Search.png'


export type AgeGroup = "All" | 17 | 21 | 23
export type Status = "All" | "Free" | "Transferred" | "Negotiation"


type FilterProps = {
  ageFilter: AgeGroup
  setAgeFilter: (value: AgeGroup) => void
  statusFilter: Status
  setStatusFilter: (value: Status) => void
  searchInput: string
  setSearchInput: (value: string) => void
}

const FilterPlayers = ({
  ageFilter,
  setAgeFilter,
  statusFilter,
  setStatusFilter,
  searchInput,
  setSearchInput
}: FilterProps) => {
  const ageOptions: AgeGroup[] = ["All", 17, 21, 23]
  const statusOptions: Status[] = ["All", "Free", "Transferred", "Negotiation"]

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setSearchInput((prev) => ({ ...prev, [name]: value }));
  // }

  return (
    <div className='flex flex-col md:flex-row-reverse flexRowAdjust lg:flex-row px-5 md:px-10 mb-5 py-5 shadow-[#0000001A] dark:shadow-black/40 shadow-md gap-5 md:gap-10 md:items-end md:justify-end lg:justify-start'>

      {/* SEARCH BAR */}
      <div className='border-b border-[#8E8E8E] dark:border-white/20 pb-3 md:w-[300px] h-fit lg:w-[400px]'>
        <div className='flex text-sm gap-3 lg:w-[400px] text-[#8E8E8E] font-medium font-manrope'>
          <img src={searchIcon} alt="" className='w-[17.5px] h-[17.5px]' />

          <input type="text"
            placeholder='Search: Name, Club...Age, Position'
            className='w-full h-full outline-0 bg-transparent text-[#060A0F] dark:text-white placeholder-[#8E8E8E] dark:placeholder-gray-500'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} />

        </div>
      </div>

      <div className='flex flex-col flexColAdjust lg:flex-row gap-[16px] md:gap-8 lg:gap-14'>

        {/* AGE FILTER */}
        <div className='flex flex-col md:flex-row gap-[16px] lg:gap-9'>
          <div className='flex items-center gap-4'>
            <img src={filterIcon} alt="" className='w-[20px] h-[18px] md:w-[17px] md:h-[15px] lg:w-[20px] lg:h-[18px]' />
            <p className='text-[18px] md:text-[15px] lg:text-[18px] text-[#8E8E8E] dark:text-gray-400 font-manrope'>Filter by:</p>
          </div>

          <div className='flex gap-[16px] flex-wrap'>
            {ageOptions.map((option) => (
              <button
                key={option}
                onClick={() => setAgeFilter(option)}
                className={`border rounded-[8px] font-medium text-[12px] md:text-[9px] lg:text-[12px] h-[32px] md:h-[29px] lg:h-[32px] px-4 md:px-[13px] lg:px-4 hover:bg-[#00D46A4D]
                  ${ageFilter === option
                    ? "bg-[#00D46A4D] text-[#00A553] border-0"
                    : "border-[#CAC4D0] dark:border-white/20 text-[#49454F] dark:text-gray-300"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* STATUS FILTER */}
        <div className='flex flex-col md:flex-row gap-[16px]'>
          <div>
            <p className='text-[18px] md:text-[15px] lg:text-[18px] text-[#8E8E8E] dark:text-gray-400 font-manrope'>Status</p>
          </div>

          <div className='flex gap-[16px] flex-wrap'>
            {statusOptions.map((option) => (
              <button
                key={option}
                onClick={() => setStatusFilter(option)}
                className={`border rounded-[8px] font-medium text-[12px] md:text-[9px] lg:text-[12px] h-[32px] md:h-[29px] lg:h-[32px] px-4 md:px-[13px] lg:px-4 hover:bg-[#00D46A4D]
                  ${statusFilter === option
                    ? "bg-[#00D46A4D] text-[#00A553] border-0"
                    : "border-[#CAC4D0] dark:border-white/20 text-[#49454F] dark:text-gray-300"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default FilterPlayers

EOF_UDE2_80814284
echo "  wrote src/components/player-information/FilterPlayers.tsx"
mkdir -p "$(dirname "src/components/universal/NavBar.tsx")"
cat > src/components/universal/NavBar.tsx << 'EOF_UDE2_12515608'
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import udeLogo from '@/assets/udeLogo.png';
import hamburgerLogo from '@/assets/hamburgerLogo.png';
import PageWrapper from '../page-wrapper';
import { useTheme } from '@/contexts/ThemeContext';

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const LinkClass = ({ isActive }: { isActive: boolean }) =>
        `font-manrope font-regular text-[14px] tracking-[1px] leading-0 flex justify-center items-center ${isActive ? 'text-[#00D46A]' : 'text-[#D2D2D2] hover:text-[#00D46A]'
        }`;

    const handleContactClick = () => {
        navigate('/contact');
        closeMenu();
    };

    return (
        <div className="navbar-wrapper bg-black/80 backdrop-blur-xl sticky top-0 z-50">
            <PageWrapper className="navbar-inner p-[20px]">
                <div className="navbar-content flex items-center justify-between px-4 sm:px-6 py-4">
                    {/* Logo */}
                    <div className="">
                        <Link to="/" className="flex justify-center items-center cursor-pointer">
                            <img
                                className="w-5 h-7 sm:w-5.75 sm:h-8"
                                src={udeLogo}
                                alt="udeLogo"
                            />
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-8">
                        <NavLink to="/" className={LinkClass}>Home</NavLink>
                        <NavLink to="/about" className={LinkClass}>About</NavLink>
                        <NavLink to="/players" className={LinkClass}>Players</NavLink>
                        <NavLink to="/gallery" className={LinkClass}>Gallery</NavLink>
                        <NavLink to="/news" className={LinkClass}>News</NavLink>
                    </div>

                    {/* Right side: theme toggle + Contact (desktop) + hamburger (mobile), grouped so they sit together on small screens */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="flex-shrink-0 w-9 h-9 rounded-md border border-white/15 flex items-center justify-center text-[#D2D2D2] hover:text-[#00D46A] hover:border-[#00D46A] transition-colors cursor-pointer"
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Desktop Contact Button */}
                        <button
                            className="
                                hidden md:flex
                                w-auto min-w-30 lg:w-41 h-11.25 px-4 lg:px-3
                                bg-[#00D46A]
                                rounded-md text-white font-manrope text-sm font-medium
                                items-center justify-center
                                cursor-pointer transition-all duration-200
                                shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C]
                                hover:bg-[#00c45e]
                                hover:shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C,0_4px_12px_rgba(0,212,106,0.3)]
                                active:scale-95
                            "
                            onClick={handleContactClick}
                        >
                            Contact Us
                        </button>

                        {/* Hamburger — mobile only, grouped with the toggle so they sit side by side on small screens */}
                        <div className='block md:hidden flex-shrink-0'>
                            <div
                                className="bg-[#00D46A] rounded-md w-9 h-9 flex items-center justify-center cursor-pointer"
                                onClick={toggleMenu}
                            >
                                <img
                                    className="w-3.75 h-2.5"
                                    src={hamburgerLogo}
                                    alt="hamburgerLogo"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`
        md:hidden overflow-hidden
        bg-[#000000] border-t border-[#00D46A]
        transition-all duration-300 ease-in-out
        ${isMenuOpen
                            ? 'max-h-[500px] opacity-100 translate-y-0 py-6 px-4'
                            : 'max-h-0 opacity-0 -translate-y-2 py-0 px-4'
                        }
    `}
                >
                    <div className="flex flex-col items-center gap-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `font-manrope font-regular text-[16px] tracking-[1px] ${isActive
                                    ? 'text-[#00D46A]'
                                    : 'text-[#D2D2D2] hover:text-[#00D46A]'
                                }`
                            }
                            onClick={closeMenu}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `font-manrope font-regular text-[16px] tracking-[1px] ${isActive
                                    ? 'text-[#00D46A]'
                                    : 'text-[#D2D2D2] hover:text-[#00D46A]'
                                }`
                            }
                            onClick={closeMenu}
                        >
                            About
                        </NavLink>

                        <NavLink
                            to="/players"
                            className={({ isActive }) =>
                                `font-manrope font-regular text-[16px] tracking-[1px] ${isActive
                                    ? 'text-[#00D46A]'
                                    : 'text-[#D2D2D2] hover:text-[#00D46A]'
                                }`
                            }
                            onClick={closeMenu}
                        >
                            Players
                        </NavLink>

                        <NavLink
                            to="/gallery"
                            className={({ isActive }) =>
                                `font-manrope font-regular text-[16px] tracking-[1px] ${isActive
                                    ? 'text-[#00D46A]'
                                    : 'text-[#D2D2D2] hover:text-[#00D46A]'
                                }`
                            }
                            onClick={closeMenu}
                        >
                            Gallery
                        </NavLink>

                        <NavLink
                            to="/news"
                            className={({ isActive }) =>
                                `font-manrope font-regular text-[16px] tracking-[1px] ${isActive
                                    ? 'text-[#00D46A]'
                                    : 'text-[#D2D2D2] hover:text-[#00D46A]'
                                }`
                            }
                            onClick={closeMenu}
                        >
                            News
                        </NavLink>

                        <button
                            className="
                w-full max-w-xs h-11.25 p-3
                bg-[#00D46A]
                rounded-md text-white font-manrope text-sm font-medium
                flex items-center justify-center
                cursor-pointer transition-all duration-200
                shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C]
                hover:bg-[#00c45e]
                hover:shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C,0_4px_12px_rgba(0,212,106,0.3)]
                active:scale-95
            "
                            onClick={handleContactClick}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
};

export default NavBar;

EOF_UDE2_12515608
echo "  wrote src/components/universal/NavBar.tsx"
mkdir -p "$(dirname "src/components/QuickUpdates.tsx")"
cat > src/components/QuickUpdates.tsx << 'EOF_UDE2_40179780'
import { useGetQuickUpdates } from '@/hooks/useApi';
import type { QuickUpdateCategory } from '@/types/dataTypes';
import noAuthorPhoto from '@/assets/no profile photo.jpg';

const CATEGORY_LABEL: Record<QuickUpdateCategory, string> = {
  TRANSFER: 'Transfer',
  ACADEMY: 'Academy',
  ANNOUNCEMENT: 'Announcement',
  MILESTONE: 'Milestone',
  INTERNATIONAL: 'International',
};

const CATEGORY_STYLE: Record<QuickUpdateCategory, string> = {
  TRANSFER: 'bg-amber-100 text-amber-700',
  ACADEMY: 'bg-blue-100 text-blue-700',
  ANNOUNCEMENT: 'bg-emerald-100 text-emerald-700',
  MILESTONE: 'bg-[#00D46A4D] text-[#00A553]',
  INTERNATIONAL: 'bg-purple-100 text-purple-700',
};

const QuickUpdates = () => {
  const { data: updates, isLoading, error } = useGetQuickUpdates();

  if (isLoading) {
    return (
      <section className="pt-12 font-manrope">
        <h2 className="font-bold text-[20px] text-[#292929] dark:text-white">Quick Updates</h2>
        <div className="flex flex-col gap-5 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#e9e9e9] animate-pulse" />
                <div className="h-3.5 w-24 rounded bg-[#e9e9e9] animate-pulse" />
              </div>
              <div className="h-3.5 w-full rounded bg-[#e9e9e9] animate-pulse" />
              <div className="h-3 w-32 rounded bg-[#e9e9e9] animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fails quietly — this is a secondary sidebar module, not worth a full error state
  if (error || !updates || updates.length === 0) return null;

  // Tag cloud below the list, built from whichever categories actually appear
  const recommendedTopics = Array.from(new Set(updates.map((update) => update.category)));

  return (
    <section className="pt-12 font-manrope">
      <h2 className="font-bold text-[20px] text-[#292929] dark:text-white">Quick Updates</h2>

      <div className="flex flex-col gap-5 mt-4">
        {updates.map((update) => (
          <div key={update.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src={update.author.avatarUrl || noAuthorPhoto}
                alt={update.author.name}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-[14px] text-[#292929] dark:text-white font-light">{update.author.name}</span>
            </div>

            <div className="flex flex-col">
              <p className="text-[14px] text-[#191919] dark:text-white font-medium">{update.headline}</p>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 mt-1">
                <time className="text-[#959595]" dateTime={update.createdAt}>
                  {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
                    new Date(update.createdAt)
                  )}
                </time>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[12px] ${CATEGORY_STYLE[update.category]}`}>
                  {CATEGORY_LABEL[update.category]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-[16px] text-[#292929] dark:text-white mb-3">Recommended Topic</h3>
        <div className="flex flex-wrap gap-2">
          {recommendedTopics.map((category) => (
            <span
              key={category}
              className={`px-3 py-1.5 rounded-full font-bold text-[12px] ${CATEGORY_STYLE[category]}`}
            >
              {CATEGORY_LABEL[category]}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickUpdates;


EOF_UDE2_40179780
echo "  wrote src/components/QuickUpdates.tsx"
mkdir -p "$(dirname "src/routes/main/player-information/index.tsx")"
cat > src/routes/main/player-information/index.tsx << 'EOF_UDE2_32311443'
import { useState } from 'react'
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

  // Adjust state during render instead of in an effect — avoids an extra
  // post-commit render pass when navigation carries a new playerId.
  const [prevPlayerId, setPrevPlayerId] = useState(playerId)
  if (playerId !== prevPlayerId) {
    setPrevPlayerId(playerId)
    if (playerId) {
      setSelectedPlayerId(playerId)
    }
  }

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

        <p className='font-normal text-[64px] leading-[69px] font-bebas text-[#060A0F] dark:text-white'>
          <span className='block'>PLAYER</span>
          INFORMATION
        </p>
      </div>

      {!selectedPlayerId && (
        <section className='md:sticky top-0 z-9999 bg-white dark:bg-black mx-[-20px] lg:mx-[-40px]'>
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


EOF_UDE2_32311443
echo "  wrote src/routes/main/player-information/index.tsx"
mkdir -p "$(dirname "src/components/player-information/PlayerFullDetails.tsx")"
cat > src/components/player-information/PlayerFullDetails.tsx << 'EOF_UDE2_29575262'
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
                ${player?.status === "Transferred" ? "bg-[#00D46A4D] text-[#00A553]" : player?.status === "Negotiation" ? "bg-[#D47F0033] text-[#D47F00]" : "bg-[#1778FB33] text-[#045BD0]"}`}>
                    {player?.status}
                    <div className={`w-[8px] h-[8px] rounded-full
                  ${player?.status === "Transferred" ? "bg-[#00D46A]" : player?.status === "Negotiation" ? "bg-[#D47F00]" : "bg-[#045BD0]"}`}>
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
EOF_UDE2_29575262
echo "  wrote src/components/player-information/PlayerFullDetails.tsx"
mkdir -p "$(dirname "src/routes/main/articles/news/index.tsx")"
cat > src/routes/main/articles/news/index.tsx << 'EOF_UDE2_54729918'
import type { NewsArticle, NewsCategory } from '@/types/dataTypes';
import Ellipse from "@/assets/Ellipse 44.png"
import QuickUpdates from '@/components/QuickUpdates';
// import FuturePlayer from "../../assets/FuturePlayer.png"
import { Link } from 'react-router';
import { useGetNewsArticles } from '@/hooks/useApi';
import news from '@/assets/news.jpeg'
import noAuthorPhoto from '@/assets/no profile photo.jpg'
import { estimateReadTime } from '@/lib/utils';
import PageWrapper from '@/components/page-wrapper';


const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TRANSFER: 'Transferred',
  ACADEMY: 'Academy News',
  ANNOUNCEMENT: 'Announcement',
};

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  TRANSFER: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full',
  ACADEMY: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full',
  ANNOUNCEMENT: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full',
};

// Add near ArticleCard, in the same file
function ArticleCardSkeleton({ variant }: { variant: 'featured' | 'grid' }) {
  return (
    <div className={`${variant === 'featured' ? 'article-card--featured' : 'article-card--grid'} font-manrope py-6 md:py-8 lg:py-10 flex flex-col gap-2`}>
      <div className={`w-full ${variant === 'featured' ? 'aspect-[16/7]' : 'aspect-[16/9]'} rounded-md bg-[#e9e9e9] dark:bg-white/10 animate-pulse`} />
      <div className="h-6 w-36 rounded-full bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
      <div className="h-5 w-4/5 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
      <div className="flex flex-col gap-1.5">
        <div className="h-3.5 w-full rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
        <div className="h-3.5 w-3/4 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 md:h-14 md:w-14 lg:h-15 lg:w-15 rounded-full bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-24 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
            <div className="h-3 w-32 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="h-3.5 w-20 rounded bg-[#e9e9e9] dark:bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

export function ArticleCard({ article, variant }: { article: NewsArticle; variant: 'featured' | 'grid' }) {
  return (
    <article className={`${variant === 'featured' ? 'article-card--featured' : 'article-card--grid'} font-manrope py-6 md:py-8 lg:py-10 flex flex-col gap-2 hover:scale-105 transition-transform`}>
      <div>
        <img className='h-full w-full' src={article.coverImage ? article.coverImage : news} alt={article.headline} loading="lazy" />
      </div>
      <span className={`pill ${CATEGORY_STYLE[article.category]} w-36 text-center font-bold py-1`}>
        • {CATEGORY_LABEL[article.category]}
      </span>
      <h3 className='font-bold text-[17px] md:text-[18px] lg:text-[20px] text-[#1A1A1A] dark:text-white'>{article.headline}</h3>
      <p className='text-[14px] md:text-[15px] lg:text-[15px] text-[#464646] dark:text-gray-400'>{article.excerpt}</p>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img src={article.authorPhoto ? article.authorPhoto : noAuthorPhoto} alt={article.author} className="h-12 w-12 md:h-14 md:w-14 lg:h-15 lg:w-15 rounded-full" />
          <div className='flex flex-col'>
            <span className='text-[14px] md:text-[15px] lg:text-[15px] text-[#1A1A1A] dark:text-white font-medium'>{article.author}</span>
            <time className='text-[13px] md:text-[14px] lg:text-[14px] text-[#959595] dark:text-gray-500' dateTime={article.createdAt}>
              {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
                new Date(article.createdAt)
              )} • {estimateReadTime(article.body)} read
            </time>
          </div>
        </div>
        <Link className='text-[#382E53] dark:text-gray-300 hover:text-[#00A553] dark:hover:text-[#00A553] hover:underline transition-all' to={`/news/${article.id}`}>Read more »</Link>
      </div>
    </article>
  );
}


const News = () => {
  const {
    data: articles,
    isLoading,
    isError,
  } = useGetNewsArticles();

  if (isError) return <p className="dark:text-white">Something went wrong loading news.</p>;

  const publishedArticles = (articles ?? []).filter((article) => article.published);

  if (!isLoading && publishedArticles.length === 0) return <p className="dark:text-white">No news yet.</p>;

  const sortedArticles = [...publishedArticles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [featured, ...rest] = sortedArticles;

  return (
    <PageWrapper className="p-[20px] bg-white dark:bg-black transition-colors duration-300">
      <section className=" flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className='w-full lg:w-8/12'>
          <div className='bg-[#00D46A4D] w-34 rounded-full flex justify-center items-center gap-2'>
            <img src={Ellipse} alt="Ellipse" />
            <p className='text-md text-[#00A553]'>Latest Updates</p>
          </div>
          <h1 className='font-bebas font-semibold leading-none text-[#060A0F] dark:text-white pt-2 text-[40px] md:text-[52px] lg:text-[64px]'>NEWS & TRANSFERS</h1>
          <p className='w-full lg:w-100 text-[#8E8E8E] dark:text-gray-400 font-medium'>Transfers. Trials. Academy updates. Everything moves fast, we keep you informed.</p>

          {isLoading ? (
            <>
              <ArticleCardSkeleton variant="featured" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} variant="grid" />
                ))}
              </div>
            </>
          ) : (
            <>
              <ArticleCard article={featured} variant="featured" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="grid" />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-full lg:w-3/12 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-4rem)] overflow-y-auto [scrollbar-none] [&::-webkit-scrollbar]:hidden">
          <QuickUpdates />
        </div>
      </section>
    </PageWrapper>
  );
}

export default News

EOF_UDE2_54729918
echo "  wrote src/routes/main/articles/news/index.tsx"
mkdir -p "$(dirname "src/routes/main/articles/full-news/index.tsx")"
cat > src/routes/main/articles/full-news/index.tsx << 'EOF_UDE2_21611878'
import type { NewsArticle, NewsCategory } from "@/types/dataTypes";
// import QuickUpdates from "@/components/QuickUpdates";
// PLACEHOLDER — engagementStats is not a real schema field yet, see the
// commented-out block below. Re-add these imports (views/shares/pinterest/
// facebook icons + formatCount) if that block is restored.
import { useParams } from "react-router";
import { calculateReadTime, estimateReadTime, formatDate } from "@/lib/utils";
import { Seo } from "@/components/seo";
import { useGetNewsArticles } from "@/hooks/useApi";
import news from '@/assets/news.jpeg'
import noAuthorPhoto from '@/assets/no profile photo.jpg'
import PageWrapper from "@/components/page-wrapper";

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TRANSFER: "Transferred",
  ACADEMY: "Academy News",
  ANNOUNCEMENT: "Announcement",
};

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  TRANSFER: "bg-amber-100 text-amber-700",
  ACADEMY: "bg-blue-100 text-blue-700",
  ANNOUNCEMENT: "bg-emerald-100 text-emerald-700",
};

// Recommended Topic — only the real categories that exist on NewsCategory.
// No "Milestone"/"International" here, those aren't real values yet.
const RECOMMENDED_TOPICS: NewsCategory[] = [
  "TRANSFER",
  "ACADEMY",
  "ANNOUNCEMENT",
];

function RelatedArticleCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-col gap-2 hover:scale-105 transition-transform">
      <img
        src={article.coverImage ? article.coverImage : news}
        alt={article.headline}
        className="h-48 w-full rounded-2xl object-cover"
      />
      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLE[article.category]}`}
      >
        • {CATEGORY_LABEL[article.category]}
      </span>
      <h3 className="text-lg font-bold leading-snug text-[#1A1A1A]">
        {article.headline}
      </h3>
      <p className="text-sm text-[#464646]">{article.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={article.authorPhoto ? article.authorPhoto : noAuthorPhoto}
            alt={article.author}
            className="h-9 w-9 rounded-full"
          />
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-medium text-[#1A1A1A]">
              {article.author}
            </span>
            <time dateTime={article.createdAt} className="text-[#959595]">
              {formatDate(article.createdAt)} • {estimateReadTime(article.body)} read
            </time>
          </div>
        </div>
        <a
          href={`/news/${article.id}`}
          className="text-sm font-medium text-[#382E53] hover:text-[#00A553] hover:underline transition-all"
        >
          Read more »
        </a>
      </div>
    </article>
  );
}

function SingleNewsSkeleton() {
  return (
    <PageWrapper className="p-[20px]">
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className="w-full lg:w-8/12">
          {/* cover image */}
          <div className="h-64 w-full rounded-2xl bg-[#e9e9e9] animate-pulse md:h-80 lg:h-96" />

          {/* headline */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="h-7 w-full rounded bg-[#e9e9e9] animate-pulse" />
            <div className="h-7 w-2/3 rounded bg-[#e9e9e9] animate-pulse" />
          </div>

          {/* author row */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#e9e9e9] animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-28 rounded bg-[#e9e9e9] animate-pulse" />
              <div className="h-3 w-40 rounded bg-[#e9e9e9] animate-pulse" />
            </div>
          </div>

          {/* body */}
          <div className="mt-8 flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-3.5 rounded bg-[#e9e9e9] animate-pulse ${i === 5 ? 'w-2/3' : 'w-full'}`}
              />
            ))}
          </div>

          {/* related articles */}
          <div className="mt-12">
            <div className="h-6 w-44 rounded bg-[#e9e9e9] animate-pulse" />
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-48 w-full rounded-2xl bg-[#e9e9e9] animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-[#e9e9e9] animate-pulse" />
                  <div className="h-5 w-4/5 rounded bg-[#e9e9e9] animate-pulse" />
                  <div className="h-3.5 w-full rounded bg-[#e9e9e9] animate-pulse" />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-9 w-9 rounded-full bg-[#e9e9e9] animate-pulse" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3 w-20 rounded bg-[#e9e9e9] animate-pulse" />
                      <div className="h-3 w-28 rounded bg-[#e9e9e9] animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-3/12 lg:sticky lg:top-6 lg:self-start">
          <div className="mt-8">
            <div className="h-5 w-32 rounded bg-[#e9e9e9] animate-pulse" />
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 w-24 rounded-full bg-[#e9e9e9] animate-pulse" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}

const SingleNews = () => {
  const { id: articleId } = useParams<{ id: string }>();

  const {
    data: articles,
    isLoading,
    isError,
  } = useGetNewsArticles();

  if (isLoading) return <SingleNewsSkeleton />;
  if (isError) return <p  className="min-h-screen text center">Something went wrong loading this article.</p>;

  const article = (articles ?? []).find(
    (a) => a.id === articleId && a.published,
  );

  if (!article) return <p>Article not found.</p>;

  const relatedArticles = (articles ?? [])
    .filter((a) => a.published && a.id !== article.id)
    .slice(0, 2);

  return (
    <PageWrapper className="p-[20px]">
      <Seo title={article.headline} description={article.excerpt ?? 'Full article — UdeSport News & Transfers.'} />
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className="w-full lg:w-8/12">
          <img
            src={article.coverImage ? article.coverImage : news}
            alt={article.headline}
            className="h-64 w-full rounded-2xl object-cover md:h-80 lg:h-96"
          />

          <h1 className="mt-6 text-2xl font-bold text-[#1A1A1A] md:text-3xl lg:text-3xl">
            {article.headline}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.authorPhoto ? article.authorPhoto : noAuthorPhoto}
                alt={article.author}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col text-sm leading-tight">
                <span className="font-medium text-[#1A1A1A]">
                  {article.author}
                </span>
                <time dateTime={article.createdAt} className="text-[#959595]">
                  {formatDate(article.createdAt)} •{" "}
                  {calculateReadTime(article.body)} min read
                </time>
              </div>
            </div>

            {/* PLACEHOLDER — engagementStats is not a real schema field yet. See types/news.ts. */}
            {/* <div className="flex items-center gap-6 text-sm text-[#1A1A1A]">
              <div className="flex flex-col items-center">
                <img src={views} alt="views" />
                <span className="text-[11px] text-[#959595]">views</span>
                <span className="font-semibold">
                  {formatCount(article.engagementStats.views)}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <img src={shares} alt="shares" />
                <span className="text-[11px] text-[#959595]">shares</span>
                <span className="font-semibold">
                  {formatCount(article.engagementStats.shares)}
                </span>
              </div>
              <span className="font-semibold">
                <img src={pinterest} alt="pinterest" />{" "}
                {formatCount(article.engagementStats.pinterestShares)}
              </span>
              <span className="font-semibold">
                <img src={facebook} alt="facebook" />{" "}
                {formatCount(article.engagementStats.facebookShares)}
              </span>
            </div> */}
          </div>

          <div
            className="prose prose-neutral mt-8 max-w-none text-[#464646]"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                You Might also like
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {relatedArticles.map((related) => (
                  <RelatedArticleCard key={related.id} article={related}/>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="w-full lg:w-3/12 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-4rem)] overflow-y-auto [scrollbar-none] [&::-webkit-scrollbar]:hidden">
          {/* <QuickUpdates /> */}

          <div className="mt-8">
            <h2 className="font-bold text-[#1A1A1A]">Recommended Topic</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {RECOMMENDED_TOPICS.map((topic) => (
                <span
                  key={topic}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLE[topic]}`}
                >
                  • {CATEGORY_LABEL[topic]}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
};

export default SingleNews;


EOF_UDE2_21611878
echo "  wrote src/routes/main/articles/full-news/index.tsx"
mkdir -p "$(dirname "src/routes/main/contact/index.tsx")"
cat > src/routes/main/contact/index.tsx << 'EOF_UDE2_48436112'
import { useState } from "react"
import { MapPin } from "lucide-react"
import ic_phone from "@/assets/ic_phone.png"
import ic_mail from "@/assets/ic_mail.png"
import icons_insta from "@/assets/icons_insta.png"

const contactDetails = [
  {
    icon: MapPin,
    lines: ["119, Jimoh Cliff Street, Lekki, Lagos Nigeria."],
  },
  {
    iconSrc: ic_phone,
    lines: ["+234 8187038043. +234 803916692, +234 805 534 0408, +447031885358"],
  },
  {
    iconSrc: ic_mail,
    lines: ["info@dominicegbukwusoccerafrica.com, soccerafrica2000@yahoo.com"],
  },
  {
    iconSrc: icons_insta,
    lines: ["udesportsmanagementltd"],
  },
]

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in your name, email, and message.")
      return
    }

    // TODO: wire to a real backend endpoint (send via Brevo, per EMAIL_OWNER env var)
    // once contact-form submission is added on the server. Mocked for now.
    console.log("Contact form submitted:", formData)
    setSubmitted(true)
    setFormData({ fullName: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="w-full px-5 lg:px-16 py-14 container mx-auto bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-5">
        {/* Left — Let's Talk */}
        <div className="flex flex-col gap-5 w-full lg:max-w-[662px]">
          <div className="flex flex-col gap-2 w-full lg:max-w-[379px]">
            <div className="bg-[#00D46A4D] flex items-center justify-center gap-2 rounded-full px-4 py-2 w-fit">
              <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
              <p className="font-manrope font-bold text-[16px] leading-[1.3] text-[#00A553]">
                Reach out to Us
              </p>
            </div>

            <h1 className="font-bebas text-[clamp(44px,6vw,64px)] leading-[1.08] text-[#060A0F] dark:text-white">
              let&rsquo;s talk
            </h1>
          </div>

          <p className="font-manrope font-medium text-[18px] leading-[27px] text-[#8E8E8E] dark:text-gray-400">
            Whether you're a scout, a parent, a player, or a club
            representative — we'd love to hear from you.
          </p>

          <div className="flex flex-col gap-4 mt-2">
            {contactDetails.map(({ icon: Icon, iconSrc, lines }, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-[55px] h-[53px] rounded-2xl bg-[#00D46A] flex items-center justify-center flex-shrink-0 p-2">
                  {Icon ? (
                    <Icon className="w-8 h-8 text-white" />
                  ) : (
                    <img src={iconSrc} alt="" className="w-8 h-8 object-contain" />
                  )}
                </div>
                <div>
                  {lines.map((line, j) => (
                    <p key={j} className="font-manrope font-medium text-[18px] leading-[27px] text-[#8E8E8E] dark:text-gray-400">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Send a Message */}
        <div className="flex flex-col gap-6 w-full lg:max-w-[623px]">
          <h2 className="font-bebas text-[clamp(44px,6vw,64px)] leading-[1.08] text-[#060A0F] dark:text-white">
            Send a message
          </h2>

          {submitted ? (
            <div className="border border-[#00D46A] bg-[#00D46A1A] p-6">
              <p className="font-manrope font-bold text-[#060A0F] dark:text-white mb-1">
                Message sent
              </p>
              <p className="font-manrope text-[14px] leading-[21px] text-[#68717D] dark:text-gray-400">
                Thanks for reaching out — we'll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="fullName" className="font-manrope text-[12px] leading-[1.4] text-[#1A1A1A] dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Input Full Name"
                    className="w-full border border-[rgba(0,0,0,0.29)] dark:border-white/20 bg-transparent dark:bg-white/5 px-4 py-2.5 font-manrope text-[13px] leading-[18px] text-[#060A0F] dark:text-white placeholder:text-[rgba(0,0,0,0.32)] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#00D46A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="email" className="font-manrope text-[12px] leading-[1.4] text-[#1A1A1A] dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="emailaddress@gmail.com"
                    className="w-full border border-[rgba(0,0,0,0.29)] dark:border-white/20 bg-transparent dark:bg-white/5 px-4 py-2.5 font-manrope text-[13px] leading-[18px] text-[#060A0F] dark:text-white placeholder:text-[rgba(0,0,0,0.32)] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#00D46A] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="font-manrope text-[12px] leading-[1.4] text-[#1A1A1A] dark:text-gray-300">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Transfer enquiry / Academy / General"
                  className="w-full border border-[rgba(0,0,0,0.29)] dark:border-white/20 bg-transparent dark:bg-white/5 px-4 py-3 font-manrope text-[13px] leading-[18px] text-[#060A0F] dark:text-white placeholder:text-[rgba(0,0,0,0.32)] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#00D46A] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-manrope text-[12px] leading-[1.4] text-[#1A1A1A] dark:text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your enquiry..."
                  className="w-full border border-[rgba(0,0,0,0.29)] dark:border-white/20 bg-transparent dark:bg-white/5 px-4 py-3 font-manrope text-[13px] leading-[18px] text-[#060A0F] dark:text-white placeholder:text-[rgba(0,0,0,0.32)] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#00D46A] transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-[#DC2626] text-[13px] font-manrope">{error}</p>
              )}

              <button
                type="submit"
                className="w-fit min-w-41 h-11.25 px-3 bg-[#00D46A] rounded-md text-white font-manrope font-medium text-[14px] leading-[21px] flex items-center justify-center transition-all duration-200 shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C] hover:bg-[#00c45e] hover:shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C,0_4px_12px_rgba(0,212,106,0.3)] active:scale-95 cursor-pointer"
              >
                Contact Us
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contact

EOF_UDE2_48436112
echo "  wrote src/routes/main/contact/index.tsx"
mkdir -p "$(dirname "src/routes/main/about/index.tsx")"
cat > src/routes/main/about/index.tsx << 'EOF_UDE2_75169423'
import { CircleUserRound, BadgeCheck, Award as AwardIcon } from "lucide-react"
import PageWrapper from "@/components/page-wrapper"
import { useGetStaff, useGetAwards } from "@/hooks/useApi"
import udeSportLogo from "@/assets/udeSportLogo.png"

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
          <div className="bg-[#060A0F] rounded-2xl border-b-4 border-r-4 border-[#00D46A] w-full aspect-video flex items-center justify-center">
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
              <div key={i} className="w-[220px] h-[130px] rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 lg:mx-0 lg:px-0">
            {staff?.map((member) => (
              <div
                key={member.id}
                className="w-[220px] flex-shrink-0 rounded-xl border border-[#00D46A] p-4 flex flex-col items-start gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-[#060A0F] flex items-center justify-center">
                  <CircleUserRound className="w-8 h-8 text-[#00D46A]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="font-manrope font-bold text-[#060A0F] dark:text-white text-[14px] leading-[21px]">
                    {member.name}
                  </p>
                  {member.verified && (
                    <BadgeCheck className="w-4 h-4 text-[#00A553] flex-shrink-0" />
                  )}
                </div>
                <p className="font-manrope text-[#8E8E8E] dark:text-gray-400 text-[12px] leading-[1.3]">{member.role}</p>
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
              <div key={i} className="h-[140px] rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {awards?.map((award) => (
              <div
                key={award.id}
                className="rounded-xl bg-[#060A0F] p-5 flex flex-col items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#00D46A4D] flex items-center justify-center">
                  <AwardIcon className="w-5 h-5 text-[#00D46A]" />
                </div>
                <div>
                  <p className="font-manrope font-bold text-white text-[14px] leading-[21px]">{award.name}</p>
                  <p className="font-manrope text-[#8E8E8E] text-[12px] leading-[1.3]">{award.subtitle}</p>
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

EOF_UDE2_75169423
echo "  wrote src/routes/main/about/index.tsx"
mkdir -p "$(dirname "src/routes/main/gallery/index.tsx")"
cat > src/routes/main/gallery/index.tsx << 'EOF_UDE2_52290968'
import { useGetGalleryImages } from "@/hooks/useApi";
import PageWrapper from "@/components/page-wrapper";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";

// Bento span patterns cycled across however many photos come back from the API
const SPAN_PATTERNS = [
  "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2",
  "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
];

const SKELETON_COUNT = 8;

// Mirrors InteractiveBentoGallery's own grid classes so the skeleton doesn't
// jump/reflow once real images swap in.
function GallerySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[60px] animate-pulse">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <div
            key={index}
            className={`rounded-xl bg-gray-200 dark:bg-gray-800 ${SPAN_PATTERNS[index % SPAN_PATTERNS.length]}`}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryHeader() {
  return (
    <div className="mb-8 md:mb-10 relative z-20">
      <span className="inline-flex items-center gap-1.5 border bg-[#00A553] border-green-500 text-green-100 dark:text-green-300 text-xs px-3 py-1 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Visual Archive
      </span>
      <h1 className="text-3xl md:text-5xl font-black text-[#060A0F] dark:text-white uppercase mb-2">
        Gallery
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
        Moments from training, transfers, and tournaments.
        <br />
        Capturing the journey from Lagos to the world.
      </p>
    </div>
  );
}

export default function Gallery() {
  const {
    data: galleryImages = [],
    isLoading,
    isError,
  } = useGetGalleryImages();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden flex justify-center">
        <PageWrapper className=" p-[20px]">
          <GalleryHeader />
          <GallerySkeleton />
        </PageWrapper>
      </main>
    );
  }

  if (isError) {
    return <div className="min-h-screen bg-white dark:bg-black text-[#060A0F] dark:text-white p-6">Failed to load gallery.</div>;
  }

  if (galleryImages.length === 0) {
    return <div className="min-h-screen bg-white dark:bg-black text-[#060A0F] dark:text-white p-6">No gallery images available.</div>;
  }

  const mediaItems = galleryImages.map((photo, index) => ({
    id: photo.id,
    type: photo.type ?? "image",
    title: photo.title,
    desc: photo.description,
    url: photo.link,
    span: SPAN_PATTERNS[index % SPAN_PATTERNS.length],
  }));

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden flex justify-center">
      <PageWrapper className=" p-[20px]">
        <GalleryHeader />

        {/* Interactive image/video display */}
        <InteractiveBentoGallery mediaItems={mediaItems} />
      </PageWrapper>
    </main>
  );
}
EOF_UDE2_52290968
echo "  wrote src/routes/main/gallery/index.tsx"
mkdir -p "$(dirname "src/components/ui/interactive-bento-gallery.tsx")"
cat > src/components/ui/interactive-bento-gallery.tsx << 'EOF_UDE2_47741980'
"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react';


interface MediaItemType {
    id: string;
    type: string;
    title: string;
    desc: string;
    url: string;
    span: string;
}

const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setIsInView(entry.isIntersecting);
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const handleVideoPlay = async () => {
            if (!videoRef.current || !isInView || !mounted) return;

            try {
                if (videoRef.current.readyState >= 3) {
                    setIsBuffering(false);
                    await videoRef.current.play();
                } else {
                    setIsBuffering(true);
                    await new Promise((resolve) => {
                        if (videoRef.current) {
                            videoRef.current.oncanplay = resolve;
                        }
                    });
                    if (mounted) {
                        setIsBuffering(false);
                        await videoRef.current.play();
                    }
                }
            } catch (error) {
                console.warn("Video playback failed:", error);
            }
        };

        if (isInView) {
            handleVideoPlay();
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

        return () => {
            mounted = false;
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        };
    }, [isInView]);

    if (item.type === 'video') {
        return (
            <div className={`${className} relative overflow-hidden`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onClick={onClick}
                    playsInline
                    muted
                    loop
                    preload="auto"
                    style={{
                        opacity: isBuffering ? 0.8 : 1,
                        transition: 'opacity 0.2s',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                    }}
                >
                    <source src={item.url} type="video/mp4" />
                </video>
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <img
            src={item.url}
            alt={item.title}
            className={`${className} object-cover cursor-pointer`}
            onClick={onClick}
            loading="lazy"
            decoding="async"
        />
    );
};

interface GalleryModalProps {
    selectedItem: MediaItemType;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: MediaItemType | null) => void;
    mediaItems: MediaItemType[];
}
const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
    const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="fixed inset-0 w-full min-h-screen sm:h-[90vh] md:h-[600px] backdrop-blur-lg 
                          rounded-none sm:rounded-lg md:rounded-xl overflow-hidden z-10"

            >
                <div className="h-full flex flex-col">
                    <div className="flex-1 p-2 sm:p-3 md:p-4 flex items-center justify-center bg-gray-50/50">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedItem.id}
                                className="relative w-full aspect-[16/9] max-w-[95%] sm:max-w-[85%] md:max-w-3xl 
                                         h-auto max-h-[70vh] rounded-lg overflow-hidden shadow-md"
                                initial={{ y: 20, scale: 0.97 }}
                                animate={{
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                        mass: 0.5
                                    }
                                }}
                                exit={{
                                    y: 20,
                                    scale: 0.97,
                                    transition: { duration: 0.15 }
                                }}
                                onClick={onClose}
                            >
                                <MediaItem item={selectedItem} className="w-full h-full object-contain bg-gray-900/20" onClick={onClose} />
                                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 
                                              bg-gradient-to-t from-black/50 to-transparent">
                                    <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold">
                                        {selectedItem.title}
                                    </h3>
                                    <p className="text-white/80 text-xs sm:text-sm mt-1">
                                        {selectedItem.desc}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <motion.button
                    className="absolute top-2 sm:top-2.5 md:top-3 right-2 sm:right-2.5 md:right-3 
                              p-2 rounded-full bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 
                              text-xs sm:text-sm backdrop-blur-sm "
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X className='w-3 h-3' />
                </motion.button>

            </motion.div>

            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                initial={false}
                animate={{ x: dockPosition.x, y: dockPosition.y }}
                onDragEnd={(_, info) => {
                    setDockPosition(prev => ({
                        x: prev.x + info.offset.x,
                        y: prev.y + info.offset.y
                    }));
                }}
                className="fixed z-50 left-1/2 bottom-4 -translate-x-1/2 touch-none"
            >
                <motion.div
                    className="relative rounded-xl bg-sky-400/20 backdrop-blur-xl 
                             border border-blue-400/30 shadow-lg
                             cursor-grab active:cursor-grabbing"
                >
                    <div className="flex items-center -space-x-2 px-3 py-2">
                        {mediaItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                }}
                                style={{
                                    zIndex: selectedItem.id === item.id ? 30 : mediaItems.length - index,
                                }}
                                className={`
                                    relative group
                                    w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 
                                    rounded-lg overflow-hidden 
                                    cursor-pointer hover:z-20
                                    ${selectedItem.id === item.id
                                        ? 'ring-2 ring-white/70 shadow-lg'
                                        : 'hover:ring-2 hover:ring-white/30'}
                                `}
                                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                                animate={{
                                    scale: selectedItem.id === item.id ? 1.2 : 1,
                                    rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                                    y: selectedItem.id === item.id ? -8 : 0,
                                }}
                                whileHover={{
                                    scale: 1.3,
                                    rotate: 0,
                                    y: -10,
                                    transition: { type: "spring", stiffness: 400, damping: 25 }
                                }}
                            >
                                <MediaItem item={item} className="w-full h-full" onClick={() => setSelectedItem(item)} />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
                                {selectedItem.id === item.id && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute -inset-2 bg-white/20 blur-xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

interface InteractiveBentoGalleryProps {
    mediaItems: MediaItemType[]
    title?: string
    description?: string
}

const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({ mediaItems, title, description }) => {
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
    const [items, setItems] = useState(mediaItems);
    const [isDragging, setIsDragging] = useState(false);

    // Prevent the page behind the modal from scrolling while an item is open
    useEffect(() => {
        if (!selectedItem) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [selectedItem]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {(title || description) && (
                <div className="mb-8 text-center">
                    {title && (
                        <motion.h1
                            className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent 
                                     bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
                                     dark:from-white dark:via-gray-200 dark:to-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {title}
                        </motion.h1>
                    )}
                    {description && (
                        <motion.p
                            className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {description}
                        </motion.p>
                    )}
                </div>
            )}
            <AnimatePresence mode="wait">
                {selectedItem ? (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen={true}
                        onClose={() => setSelectedItem(null)}
                        setSelectedItem={setSelectedItem}
                        mediaItems={items}
                    />
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[70px] sm:auto-rows-[75px] md:auto-rows-[80px]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layoutId={`media-${item.id}`}
                                className={`relative overflow-hidden rounded-xl cursor-move ${item.span}`}
                                onClick={() => !isDragging && setSelectedItem(item)}
                                variants={{
                                    hidden: { y: 50, scale: 0.9, opacity: 0 },
                                    visible: {
                                        y: 0,
                                        scale: 1,
                                        opacity: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 25,
                                            delay: index * 0.05
                                        }
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={1}
                                onDragStart={() => setIsDragging(true)}
                                onDragEnd={(_e, info) => {
                                    setIsDragging(false);
                                    const moveDistance = info.offset.x + info.offset.y;
                                    if (Math.abs(moveDistance) > 50) {
                                        const newItems = [...items];
                                        const draggedItem = newItems[index];
                                        const targetIndex = moveDistance > 0 ?
                                            Math.min(index + 1, items.length - 1) :
                                            Math.max(index - 1, 0);
                                        newItems.splice(index, 1);
                                        newItems.splice(targetIndex, 0, draggedItem);
                                        setItems(newItems);
                                    }
                                }}
                            >
                                <MediaItem
                                    item={item}
                                    className="absolute inset-0 w-full h-full"
                                    onClick={() => !isDragging && setSelectedItem(item)}
                                />
                                <motion.div
                                    className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <h3 className="relative text-white text-xs sm:text-sm md:text-base font-medium line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <p className="relative text-white/70 text-[10px] sm:text-xs md:text-sm mt-0.5 line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InteractiveBentoGallery

EOF_UDE2_47741980
echo "  wrote src/components/ui/interactive-bento-gallery.tsx"
mkdir -p "$(dirname "src/layouts/AdminLayout.tsx")"
cat > src/layouts/AdminLayout.tsx << 'EOF_UDE2_36546946'
import { NavLink, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Images,
  Bell,
  Settings,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import udeLogo from "../assets/udeLogo.png";
import { adminUser } from "@/lib/adminUser";
import { useTheme } from "@/contexts/ThemeContext";

const navItems = [
  {
    section: "Dashboard",
    links: [
      { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "",
    links: [
      { label: "Players", path: "/admin/player-overview", icon: Users },
      { label: "News", path: "/admin/news", icon: Newspaper },
      { label: "Gallery", path: "/admin/gallery", icon: Images },
    ],
  },
  {
    section: "System",
    links: [
      { label: "Notification", path: "/admin/notifications", icon: Bell },
      { label: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

function getInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="h-20 bg-white dark:bg-black flex items-center justify-between gap-4 px-6 sticky top-0 z-10 border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}

        className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Right side */}
      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {/* Theme Toggle — compact icon button, fits without crowding the topbar on small screens */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 rounded-lg border border-gray-200 dark:border-white/15 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button className="flex items-center gap-1.5 text-xs lg:text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-2 lg:px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
          onClick={() => navigate("/")}>
          Visit Sites
          <ArrowUpRight size={15} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-black text-[14px] font-medium">
            {getInitials(adminUser.name)}
          </div>
          <div className="leading-tight">
            <p className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">
              {adminUser.name}
            </p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold">
              {adminUser.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  handleLogout,
  isOpen,
  onClose,
}: {
  handleLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate()
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-56 bg-white dark:bg-black border-r border-gray-100 dark:border-white/10 flex flex-col z-40
        transition-colors transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="h-16 px-4 flex items-center gap-1"
        onClick={()=>navigate("/")}>
          <img
            src={udeLogo}
            alt="UDESport Logo"
            className="w-8 h-8 object-contain"
          />
          <div className="leading-tight">
            <p className="text-l font-semibold text-gray-600 dark:text-gray-300">UDESport</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Management Ltd</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navItems.map((group, index) => (
            <div key={index}>
              {group.section && (
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500 px-2 mb-1">
                  {group.section}
                </p>
              )}
              <div className="space-y-0.5">
                {group.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-m font-medium transition-colors ${
                        isActive
                          ? "bg-green-400 text-black"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      }`
                    }
                  >
                    <link.icon size={16} />
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white w-full transition-colors"
          >
            <LogOut size={20} />
            LogOut
          </button>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    navigate("/admin/login");
  }

  const authPages = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/verification",
    "/admin/new-password",
  ];

  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-white dark:bg-black transition-colors duration-300 max-w-screen-2xl mx-auto w-full">
      {!isAuthPage && (
        <Sidebar
          handleLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`flex-1 ${!isAuthPage ? "lg:ml-56" : ""}`}
      >
        {!isAuthPage && <Topbar onMenuClick={() => setSidebarOpen(true)} />}
        <div className="overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}


EOF_UDE2_36546946
echo "  wrote src/layouts/AdminLayout.tsx"
mkdir -p "$(dirname "src/routes/admin/dashboard/index.tsx")"
cat > src/routes/admin/dashboard/index.tsx << 'EOF_UDE2_20249051'
// import React from 'react'
import { Users, ArrowLeftRight, Handshake, FileText, Newspaper, RefreshCw, Mail, Trophy } from "lucide-react"
import { adminUser } from "@/lib/adminUser"
import { useGetNewsArticles, useGetPlayers } from "@/hooks/useApi";


const recentActivity = [
    {
        title: 'K. Omeruo transfer confirmed Leganés',
        meta: "Transfer · Serie A · La Liga",
        time: "2h ago",
        icon: ArrowLeftRight
    },
    {
        title: 'News article published - U-17 Trials Open',
        meta: 'Academy · Admin',
        time: "2h ago",
        icon: Newspaper
    },
    {
        title: 'C. Eze status changed → Negotiation',
        meta: "Transfer · Serie A · Premiere league",
        time: "2h ago",
        icon: RefreshCw
    },
    {
        title: 'New message  Marco Bianchi, Juventus FC',
        meta: 'Scout Enquiry · Unread',
        time: "2h ago",
        icon: Mail
    },
    {
        title: 'V. Osimhen wins Serie A Player of Month',
        meta: 'Transfer · Serie A · La Liga',
        time: "2h ago",
        icon: Trophy
    }
]

function StatCardSkeleton() {
    return (
        <div className="bg-gray-100 dark:bg-white/5 rounded-xl shadow-sm p-4 animate-pulse">
            <div className="w-5 h-5 rounded bg-gray-300 dark:bg-white/10 mb-2" />
            <div className="h-3 w-20 rounded bg-gray-300 dark:bg-white/10 mb-3" />
            <div className="h-7 w-10 rounded bg-gray-300 dark:bg-white/10 mb-1" />
            <div className="h-2.5 w-24 rounded bg-gray-300 dark:bg-white/10" />
        </div>
    );
}

function ListRowSkeleton() {
    return (
        <div className="flex items-start justify-between pb-2 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />
                <div className="space-y-1.5">
                    <div className="h-3 w-40 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-2.5 w-28 rounded bg-gray-200 dark:bg-white/10" />
                </div>
            </div>
            <div className="h-2.5 w-10 rounded bg-gray-200 dark:bg-white/10 shrink-0 ml-4" />
        </div>
    );
}

function StatRowSkeleton() {
    return (
        <div className="flex items-center justify-between pb-2 animate-pulse">
            <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-2.5 w-8 rounded bg-gray-200 dark:bg-white/10" />
        </div>
    );
}

export default function Dashboard() {

    const { data: players, isLoading: loadingPlayers } = useGetPlayers();
    const { data: articles, isLoading: loadingArticles } = useGetNewsArticles();

    const freePlayers = players?.filter(
        (player) => player.status === "Free"
    ).length ?? 0;

    const transferredPlayers = players?.filter(
        (player) => player.status === "Transferred"
    ).length ?? 0;

    const negotiationPlayers = players?.filter(
        (player) => player.status === "Negotiation"
    ).length ?? 0;

    const under17 = players?.filter(
        (player) => player.ageGroup === "U-17"
    ).length ?? 0;

    const under21 = players?.filter(
        (player) => player.ageGroup === "U-21"
    ).length ?? 0;

    const under23 = players?.filter(
        (player) => player.ageGroup === "U-23"
    ).length ?? 0;

    const publishedArticles = articles?.filter(
        (article) => article.published === true
    ).length ?? 0;

    const statCards = [
        {
            label: "Players this Season",
            value: players?.length,
            sub: 'From Last Season +13% ',
            icon: Users,
            bg: "bg-green-300"
        },
        {
            label: 'Completed Transfers',
            value: transferredPlayers,
            sub: 'All time Record',
            icon: ArrowLeftRight,
            bg: 'bg-green-500',
        },
        {
            label: 'Live Negotiations',
            value: negotiationPlayers,
            sub: 'Active Now',
            icon: Handshake,
            bg: 'bg-orange-400',
        },
        {
            label: 'Published Article',
            value: publishedArticles,
            sub: 'New Today',
            icon: FileText,
            bg: 'bg-blue-300',
        }
    ]

    const transferStats = [
        {
            label: 'Total Transfers',
            value: transferredPlayers,
            color: 'text-green-500'
        },
        {
            label: 'This Season',
            value: transferredPlayers,
            color: 'text-blue-700 dark:text-blue-400'
        },
        {
            label: 'Combined Value',
            value: '$340M',
            color: 'text-orange-400'
        },
        {
            label: 'In Negotiation',
            value: negotiationPlayers,
            color: 'text-red-500'
        },
    ]

    const ageGroupStats = [
        {
            label: 'U - 17',
            value: under17,
            color: 'text-gray-900 dark:text-white'
        },
        {
            label: 'U - 21',
            value: under21,
            color: 'text-gray-900 dark:text-white'
        },
        {
            label: 'U - 23',
            value: under23,
            color: 'text-orange-400'
        },
        {

            label: 'Free Agents',
            value: freePlayers,
            color: 'text-green-500'
        },
        {
            label: 'Transferred',
            value: transferredPlayers,
            color: 'text-blue-700 dark:text-blue-400'
        }
    ]

    return (
        <div className="p-6">
            {/* Heading */}
            <div className="mb-6">
                <p className="text-sm font-medium text-[#00D46A] mb-1">Overview</p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DASHBOARD</h1>
                <p className="text-sm text-gray-400 mt-0.5">Welcome back, {adminUser.name.split(" ")[0]}</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
                {loadingPlayers || loadingArticles
                    ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                    : statCards.map((card) => (
                        <div key={card.label} className={`${card.bg} rounded-xl shadow-sm p-4`}>
                            <card.icon size={20} className="text-black opacity-80 mb-2" />
                            <p className="text-black text-xs font-medium mb-3">{card.label}</p>
                            <p className="text-3xl font-medium text-black">{card.value}</p>
                            <p className="text-[10px] text-gray-600 mt-1 opacity-70">{card.sub}</p>
                        </div>
                    ))}

            </div>

            {/* Bottom section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent activity */}
                <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-5 lg:mb-30">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                    <div className="divide-y divide-gray-200 dark:divide-white/10 space-y-3">
                        {loadingPlayers || loadingArticles
                            ? Array.from({ length: 5 }).map((_, i) => <ListRowSkeleton key={i} />)
                            : recentActivity.map((item, i) => (
                            <div key={i} className="
            flex items-start justify-between pb-2
            ">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mt-0.5 shrink-0">
                                        <item.icon size={12} className="text-gray-500 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                                        <p className="text-xs text-gray-400">{item.meta}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 shrink-0 ml-4">
                                    {item.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Stats section */}
                <div className="space-y-4">
                    {/* Transfer stats */}

                    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Transfer stats
                        </h2>
                        <div className="divide-y divide-gray-200 dark:divide-white/10 space-y-3">
                            {loadingPlayers
                                ? Array.from({ length: 4 }).map((_, i) => <StatRowSkeleton key={i} />)
                                : transferStats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between pb-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className={`text-xs font-semibold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Age group stats */}
                    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Age Group stats</h2>
                        <div className="divide-y divide-gray-200 dark:divide-white/10 space-y-3">
                            {loadingPlayers
                                ? Array.from({ length: 5 }).map((_, i) => <StatRowSkeleton key={i} />)
                                : ageGroupStats.map((stats) => (
                                <div key={stats.label} className="flex items-center justify-between pb-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{stats.label}</p>
                                    <p className={`text-xs font-semibold ${stats.color}`}>{stats.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


EOF_UDE2_20249051
echo "  wrote src/routes/admin/dashboard/index.tsx"
mkdir -p "$(dirname "src/routes/admin/player-overview/index.tsx")"
cat > src/routes/admin/player-overview/index.tsx << 'EOF_UDE2_73180919'
// import React from 'react'
import { Search, Plus } from "lucide-react"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useGetPlayers } from "@/hooks/useApi";

const statusStyle : Record<string, string> = {
    Transferred: "bg-green-200 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    Negotiation: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    Free: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
}

function PlayerRowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />
                    <div className="space-y-1.5">
                        <div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/10" />
                        <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                </div>
            </td>
            <td className="px-5 py-4"><div className="h-3 w-10 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-8 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-6 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" /></td>
            <td className="px-5 py-4"><div className="h-6 w-20 rounded bg-gray-200 dark:bg-white/10" /></td>
        </tr>
    );
}

export default function PlayerOverview() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [groupFilter, setGroupFilter] = useState('All Groups')
    const [statusFilter, setStatusFilter] = useState('All Statuses')

      const { data: players, isLoading } = useGetPlayers();


const filteredPlayers = players?.filter((player) => {
    const matchSearch =
    player.playerFullName.toLowerCase().includes(search.toLowerCase()) ||
    player.status.toLowerCase().includes(search.toLowerCase()) ||
    player.currentClubName.toLowerCase().includes(search.toLowerCase())

    const matchGroup = groupFilter === "All Groups" || player.ageGroup === groupFilter
    const matchStatus = statusFilter === 'All Statuses' || player.status === statusFilter

    return matchSearch && matchGroup && matchStatus
})

return(
    <div className="p-6">
{/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
                <p className="text-sm font-medium text-green-500 mb-1">Overview</p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PLAYER</h1>
                <p className="text-xs text-gray-400 mt-0.5">Add, edit, and manage player profiles and status</p>
            </div>
            <button onClick={() => navigate("/admin/player-overview/add")} className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-black text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                 <Plus size={10}/>
                 Add Player
            </button>
          </div>

{/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative w-64">
                  <Search size={15} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="text"
                  placeholder="Search Players"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-2 py-2 text-xs border border-gray-200 dark:border-white/15 rounded-lg focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
              </div>

              <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="text-xs border border-gray-200 dark:border-white/15 rounded-lg px-3 py-2 focus:border-green-400 focus:bg-green-100 dark:focus:bg-green-900/30 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5">
                <option>All Groups</option>
                <option>U - 17</option>
                <option>U - 21</option>
                <option>U - 23</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border border-gray-200 dark:border-white/15 focus:bg-green-100 dark:focus:bg-green-900/30 rounded-lg px-3 py-2 focus:outline-none focus:border-green-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5">
                <option>All Statuses</option>
                <option>Transferred</option>
                <option>Negotiation</option>
                <option>Free</option>
              </select>
          </div>

{/* Table Section */}
       <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-x-auto">
         <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 text-gray-400 text-xs">
              <th className="text-left px-5 py-3 font-medium">Player</th>
              <th className="text-left px-5 py-3 font-medium">Group</th>
              <th className="text-left px-5 py-3 font-medium">Position</th>
              <th className="text-left px-5 py-3 font-medium">Ratings</th>
              <th className="text-left px-5 py-3 font-medium">Club</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/10">
            {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <PlayerRowSkeleton key={i} />)
            ) : (
            filteredPlayers?.map((player, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                   {/* Player */}
                   <td className="px-5 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {player.playerFullName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{player.playerFullName}</p>
                            <p className="text-xs text-gray-400">Pos. {player.position}</p>
                        </div>
                     </div>
                   </td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.ageGroup}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.position}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.rating}</td>
                     <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{player.currentClubName}</td>

 {/* Status */}
             <td className="px-5 py-4">
               <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[player.status]}`}>
                 {player.status}
               </span>
             </td>

             {/* Actions */}
             <td className="px-5 py-4">
               <div className="flex items-center gap-2">
                 <button onClick={() => navigate(`/admin/player-overview/edit/${i}`)} className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                    Edit
                 </button>
                 <button className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors">
                    Delete
                 </button>
               </div>
             </td>
                </tr>
            )))}
          </tbody>
         </table>
       </div>

    </div>
)
}


EOF_UDE2_73180919
echo "  wrote src/routes/admin/player-overview/index.tsx"
mkdir -p "$(dirname "src/routes/admin/add-player/index.tsx")"
cat > src/routes/admin/add-player/index.tsx << 'EOF_UDE2_94831567'
// import React from 'react'
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useState } from "react";
import { useGetPlayers } from "@/hooks/useApi";
import countries from "world-countries";

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
      <div className="h-9 w-full rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
    </div>
  );
}

function AddPlayerSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6 space-y-2">
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="h-7 w-40 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="h-3 w-64 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
      </div>
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
        <div className="mt-5">
          <div className="h-3 w-32 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-1.5" />
          <div className="h-24 w-full rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

const AddPlayer = () => {
  const { data: players, isLoading, isError } = useGetPlayers();
  const navigate = useNavigate();
  const { index } = useParams();
  const player = index !== undefined ? players?.[Number(index)] ?? null : null;
  const [name, setName] = useState(player?.playerFullName);
  const [position, setPosition] = useState(player?.position);
  const [group, setGroup] = useState(player?.ageGroup);
  const [dob, setDob] = useState(player?.DOB);
  const [nationality, setNationality] = useState(player?.nationality);
  const [foot, setFoot] = useState(player?.preferredFoot);
  const [height, setHeight] = useState(player?.height);
  const [status, setStatus] = useState(player?.status || "Free");
  const [goals, setGoals] = useState(player?.goals);
  const [assists, setAssists] = useState(player?.assists);
  const [ratings, setRatings] = useState(player?.rating?.toString() || "");
  const [background, setBackground] = useState(player?.playerHistory);

  const [error, setError] = useState<Record<string, string>>({});

  if (isLoading) {
    return <AddPlayerSkeleton />
  }
  if (isError) {
    return <div className="p-6 text-gray-900 dark:text-white">Something went wrong</div>
  }

  function validate() {
    const newError: Record<string, string> = {};
    if (!name?.trim()) {
      newError.name = "Player name is required";
    }

    const dobRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dob?.trim()) {
      newError.dob = "Date of birth is required";
    } else if (!dobRegex.test(dob)) {
      newError.dob = "Use MM/DD/YYYY format (e.g. 08/25/2006)";
    }

    // const heightRegex = /^\d{2,3}\s?cm$/i;
    // if (!height?.trim()) {
    //   newError.height = "Height is required";
    // } else if (!heightRegex.test(height.trim())) {
    //   newError.height = "Height must be in cm (e.g. 187 cm)";
    // }

    if (!background?.trim())
      newError.background = "Player Background is required";

    return newError;
  }

  function handleSubmit() {
    const newError = validate();
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }
    navigate("/admin/player-overview");
  }
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-green-500 mb-1">Overview</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {player ? "EDIT PLAYER" : "ADD PLAYER"}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Add, edit, and manage player profiles and status
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Player's name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Player Name
            </label>
            <input
              type="text"
              placeholder="Input Player Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError({ ...error, name: "" });
              }}
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.name ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.name && <p className="text-xs text-red-500">{error.name}</p>}
          </div>

          {/* Position */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>LW</option>
              <option>RW</option>
              <option>ST</option>
              <option>CM</option>
              <option>RB</option>
              <option>LB</option>
              <option>GK</option>
            </select>
          </div>

          {/* Age Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Age Group
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as "U-17" | "U-21" | "U-23")}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>U-17</option>
              <option>U-21</option>
              <option>U-23</option>
            </select>
          </div>

          {/* Date of birth */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="text"
              placeholder="DD/MM/YY"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setError({ ...error, dob: "" });
              }}
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.dob ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.dob && <p className="text-xs text-red-500">{error.dob}</p>}
          </div>

          {/* Nationality */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Nationality
            </label>

            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option value="">Select nationality</option>

              {countries.map((country) => (
                <option key={country.cca3} value={country.demonyms?.eng?.m ?? country.name.common}>
                  {country.demonyms?.eng?.m ?? country.name.common}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred foot */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Preferred Foot
            </label>
            <select
              value={foot}
              onChange={(e) => setFoot(e.target.value)}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>Both</option>
              <option>Left</option>
              <option>Right</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-5 ">
          {/* Height */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Height (CM)</label>
            <input
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value));
                setError({ ...error, height: "" });
              }}
              type="number"
              placeholder="e.g. 187 cm"
              className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.height ? "border-red-400" : "border-gray-200 dark:border-white/15"
                }`}
            />
            {error.height && (
              <p className="text-xs text-red-500">{error.height}</p>
            )}
          </div>

          {/* Current status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Free" | "Transferred" | "Negotiation")}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:border-green-400"
            >
              <option>Free</option>
              <option>Transferred</option>
              <option>Negotiation</option>
            </select>
          </div>

          {/* Goals */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Goals</label>
            <input
              value={goals}
              onChange={(e) => setGoals(Number(e.target.value))}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Assists */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Assists</label>
            <input
              value={assists}
              onChange={(e) => setAssists(Number(e.target.value))}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Ratings */}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Ratings</label>
            <input
              value={ratings}
              onChange={(e) => setRatings(e.target.value)}
              type="number"
              placeholder="0"
              min={0}
              className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Player background */}
        <div className="flex flex-col gap-1.5 mt-5">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Player Background
          </label>
          <textarea
            value={background}
            onChange={(e) => {
              setBackground(e.target.value);
              setError({ ...error, background: "" });
            }}
            placeholder="Input Player history"
            rows={10}
            className={`border px-3 py-2 text-sm focus:outline-none focus:border-green-400 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error.background ? "border-red-400" : "border-gray-200 dark:border-white/15"
              }`}
          />
          {error.background && (
            <p className="text-xs text-red-500">{error.background}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-gray-900 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {player ? "Save Changes" : "+ Add Player"}
          </button>
          <button
            onClick={() => navigate("/admin/player-overview")}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/15 px-6 py-2 rounded-lg transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => navigate("/admin/player-overview")}
            className="text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlayer;


EOF_UDE2_94831567
echo "  wrote src/routes/admin/add-player/index.tsx"
mkdir -p "$(dirname "src/routes/admin/notification/index.tsx")"
cat > src/routes/admin/notification/index.tsx << 'EOF_UDE2_78151775'
// import React from 'react'
import { useState } from "react"
import { X } from "lucide-react"

const notifications = [
  {
    id: 1,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Good day, I am writing on behalf of my 19-year-old son who plays central midfield for Sunshine Stars FC. He has been our best player for two consecutive seasons, averaging 8 goals and 11 assists from midfield. We are looking for professional representation and a pathway to a European trial. Please advise on your intake process for the U-20 programme.',
    read: false,
  },
  {
    id: 2,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Body of the letter.',
    read: false,
  },
  {
    id: 3,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Body of the letter.',
    read: false,
  },
  {
    id: 4,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Body of the letter.',
    read: false,
  },
  {
    id: 5,
    sender: 'Name of Sender',
    initials: 'DI',
    time: '10 mins ago',
    subject: 'Subject',
    body: 'Body of the letter.',
    read: false,
  },
]

export default function Notifications() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [selectedNotification, setSelectedNotification] = useState<typeof notifications[0] | null>(null)
  const [toast, setToast] = useState(false)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  function markAsRead(id: number) {
    setNotificationList(prev => prev.map(n => n.id === id ? {...n, read: true} : n))
    setSelectedNotification(null)
    showToast()
  }

  function markAllAsRead() {
    setNotificationList(prev => prev.map(n => ({...n, read: true})))
    showToast()
  }

  return (
    <div className="p-6">
{/* Header */}
    <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-500 mb-1">Communication</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NOTIFICATIONS</h1>
          <p className="text-sm text-gray-400 mt-0.5">Contact form submissions from scouts, families, and media</p>
        </div>
      <button onClick={markAllAsRead} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
         + Mark all as read
      </button>
    </div>

    {/* Notification list */}
    <div className="flex flex-col gap-3">
       {notificationList.map((notificat) =>(
      <div key={notificat.id} className={`rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-green-400 focus:outline-none shadow-sm p-5 ${notificat.read ? 'opacity-40' : ''}`}>
       <div className="flex items-start gap-3">
{/* Avatar */}
    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-gray-900 text-xs font-semibold shrink-0">
        {notificat.initials}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-0.5">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{notificat.sender}</p>
        <p className="text-xs text-gray-400">{notificat.time}</p>
      </div>
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{notificat.subject}</p>
      <p className="text-xs text-gray-400 mb-3 line-clamp-1">{notificat.body}</p>

      <div className="flex items-center gap-4">
        <button onClick={() => setSelectedNotification(notificat)} className="text-xs text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors">
         Reply Via Mail
        </button>

        <button onClick={() => markAsRead(notificat.id)} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors">
          Mark as read
        </button>
      </div>
    </div>
       </div>
      </div>
     ))}
    </div>


    {/* Modal */}
       {selectedNotification && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-lg border-2 border-green-500 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                 NOTIFICATIONS
              </h2>
              <button onClick={() => setSelectedNotification(null)}>
                <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"/>
              </button>
            </div>

            {/* Sender details */}
            <div className="flex items-center gap-3 mb-4">
             <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {selectedNotification.initials}
             </div>

             <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedNotification.sender}</p>
              <p className="text-xs text-gray-400">{selectedNotification.time}</p>
             </div>
            </div>

            {/* body and subject */}
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">{selectedNotification.subject}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-12">{selectedNotification.body}</p>

            {/* buttons */}
            <div className="flex items-center gap-3">
               <button onClick={() => markAsRead(selectedNotification.id)} className="bg-gray-100 dark:bg-white/5 hover:bg-green-600 text-gray-900 dark:text-white border border-gray-200 dark:border-white/15 hover:text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
               + Reply via Email
            </button>
            <button onClick={() => setSelectedNotification(null)} className="bg-gray-100 dark:bg-white/5 hover:bg-green-600 text-gray-900 dark:text-white hover:text-white border border-gray-200 dark:border-white/15 text-sm font-medium px-6 py-2 rounded-lg transition-colors">
              Cancel
            </button>
            </div>
          </div>
        </div>
       )}

       {/* toast */}
       {
        toast && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
              ✓
            </div>
            Notification read — Message marked as read
          </div>
        )
       }
    </div>

  )
}

EOF_UDE2_78151775
echo "  wrote src/routes/admin/notification/index.tsx"
mkdir -p "$(dirname "src/routes/admin/settings/index.tsx")"
cat > src/routes/admin/settings/index.tsx << 'EOF_UDE2_73257445'
// import React from 'react'
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function Settings() {
  const [siteTitle, setSiteTitle] = useState('UDE Sports Management')
  const [contactInfo, setContactInfo] = useState('+234')
  const [mail, setMail] = useState('info@udesports.com')
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')

  const [adminName, setAdminName] = useState('domegbukwu')
  const [adminEmail, setAdminEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [toast, setToast] = useState(false)
  const [adminErrors, setAdminErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [inviteAdmins, setInviteAdmins] = useState([
  { name: 'admin name 1', email: '', role: 'Sub Admin' },
  { name: 'admin name 2', email: '', role: 'Sub Admin' },
])

   const [editingIndex, setEditingIndex] = useState<number | null>(null)
  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  function validateAdmin() {
    const newErrors: Record<string, string> = {}
    if (!adminName.trim()) newErrors.adminName = 'Admin name is required'
    if (!adminEmail.trim()) newErrors.adminEmail = 'Admin email is required'
    if (!password.trim()) newErrors.password = 'password is required'
    if (password && !confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    return newErrors
  }

  function resetAdminForm() {
  setAdminName('')
  setAdminEmail('')
  setPassword('')
  setConfirmPassword('')
  setAdminErrors({})
}

    function handleAdminSave() {
    const newErrors = validateAdmin()
    if (Object.keys(newErrors).length > 0) {
      setAdminErrors(newErrors)
      return
    }
    setAdminErrors({})
    resetAdminForm()
    showToast()
  }

  return (
     <>
    <div className="p-6">
      {/* header */}
      <p className="text-sm font-medium text-green-500 mb-1">Communication</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SETTINGS</h1>
      <p className="text-sm text-gray-400 mt-0.5 mb-6">Manage site configuration, admin accounts, and display preferences</p>

      {/* Site Information */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Site Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Site Title
          </label>
          <input type="text" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-green-500"/>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Contact Info</label>
            <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-green-400"  />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Mail</label>
            <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Instagram</label>
              <input type="text" placeholder="Instagram Handle" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">X (Twitter)</label>
            <input type="text" placeholder="x.com/" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 text-sm focus:outline-none focus:border-green-400" />
          </div>
        </div>
        <button onClick={showToast} className="bg-green-500 hover:bg-green-600 rounded-lg hover:text-white text-gray-900 text-sm font-medium px-5 py-2 transition-colors">
             Save Changes
        </button>
      </div>

      {/* Admin Account */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Admin Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
           <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Name</label>
           <input type="text" value={adminName} onChange={(e) => {setAdminName(e.target.value); setAdminErrors({...adminErrors, adminName: ""}) }}
           className={`border px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${adminErrors.adminName ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           {adminErrors.adminName && <p className="text-xs text-red-500">{adminErrors.adminName}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
           <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Email</label>
           <input type="email" placeholder="email address" value={adminEmail} onChange={(e)=> {setAdminEmail(e.target.value); setAdminErrors({...adminErrors, adminEmail: ""})}}
           className={`border px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-400 ${adminErrors.adminEmail ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           {adminErrors.adminEmail && <p className="text-xs text-red-500">{adminErrors.adminEmail}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Role</label>
            <select disabled className="border border-gray-200 dark:border-white/15 px-3 py-2 text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 cursor-not-allowed focus:outline-none">
              <option>Super Admin</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Password</label>
           <div className="relative">
             <input type={showPassword ? "text" : "password"} placeholder="........" value={password} onChange={(e)=>  {setPassword(e.target.value); setAdminErrors({...adminErrors, password: ""}) }}
                className="w-full border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-green-400 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPassword? <Eye size={15}/> : <EyeOff size={15}/>}
              </button>
             {adminErrors.password && <p className="text-xs text-red-500">{adminErrors.password}</p>}
           </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Confirm Password</label>
           <div className="relative">
             <input type={showConfirmPassword ? "text" : "password"} placeholder=".........." value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); setAdminErrors({...adminErrors, confirmPassword: ""})}}
           className={`w-full border px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 pr-10 ${ adminErrors.confirmPassword ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
           </div>
            {adminErrors.confirmPassword && <p className="text-xs text-red-500">{adminErrors.confirmPassword}</p>}
          </div>
        </div>
        <button onClick={handleAdminSave} className="bg-green-500 hover:bg-green-600 hover:text-white rounded-lg text-gray-900 text-sm font-medium px-5 py-2 transition-colors">
          Save Changes
        </button>
      </div>

      {/* Invite Admin Account */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Invite Admin Account</h2>
        <div className="space-y-4">
          {
            inviteAdmins.map((admin, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Name</label>
                  <input type="text" value={admin.name} disabled={editingIndex !== i} onChange={(e) => {const updated = [...inviteAdmins]; updated[i].name = e.target.value; setInviteAdmins(updated)}}
                   className={`border px-3 py-2 text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Email</label>
                  <input type="email" value={admin.email} disabled={editingIndex !== i} onChange={(e) => {const updated = [...inviteAdmins]; updated[i].email = e.target.value; setInviteAdmins(updated)}} placeholder="email address"
                  className={`border px-3 py-2 text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}/>
                </div>
                <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Role</label>
                 <select value={admin.role} disabled={editingIndex !== i} onChange={(e) => {
                 const updated = [...inviteAdmins]; updated[i].role = e.target.value; setInviteAdmins(updated)}}
                 className={`border px-3 py-2 text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}>
                    <option>Sub Admin</option>
                    <option>Super Admin</option>
                 </select>
                </div>
                <div className="flex items-end gap-2 pb-0.5">
                  {editingIndex === i ? (
                    <button
                      onClick={() => { setEditingIndex(null); showToast() }}
                      className="text-xs text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors">
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingIndex(i)}
                      className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                      Edit
                    </button>
                  )}
                  <button className="text-xs text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>

    {/* Toast */}
    {toast && (
      <div className="fixed bottom-6 right-6 bg-green-500 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
       <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-white">✓</div>
       <div>
         <p className="font-semibold">Changes Saved</p>
            <p className="opacity-80">Changes for task done saved</p>
       </div>
       <button onClick={() => setToast(false)} className="ml-2 text-white/70 hover:text-white">
         ✕
       </button>
      </div>
    )}
    </>
   )
}

EOF_UDE2_73257445
echo "  wrote src/routes/admin/settings/index.tsx"
echo "Done. Now run: npx tsc --noEmit -p tsconfig.app.json && npx eslint . && npm run build"
OUTER_EOF
