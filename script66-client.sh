#!/usr/bin/env bash
set -e

REPO_DIR="udesports-client"
if [ ! -f "src/App.tsx" ] && [ -d "$REPO_DIR" ]; then
  cd "$REPO_DIR"
fi
if [ ! -f "src/App.tsx" ]; then
  echo "ABORT: run this from inside your udesports-client repo (or its parent folder)."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "devbranch" ]; then
  echo "NOTE: you're on branch '$CURRENT_BRANCH', not 'devbranch'."
  echo "Switch to it first with: git checkout devbranch"
  exit 1
fi

python3 - << 'PYEOF'
import sys

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def patch_one_of(path, candidates, new, label):
    content = read(path)
    if new in content:
        print(f"  SKIP  {label} (already applied)")
        return
    for old in candidates:
        if content.count(old) == 1:
            content = content.replace(old, new, 1)
            write(path, content)
            print(f"  OK    {label}")
            return
    print(f"  ABORT: could not find expected text for: {label} in {path}")
    sys.exit(1)

path = "src/components/player-information/FetchPlayers.tsx"
patch_one_of(
    path,
    ["""type FetchPlayersProps = {
  ageFilter: AgeGroup
  statusFilter: Status
  searchInput: string
  onPlayerClick: (id: string) => void   // called with the player's id when a card is clicked
  onClearFilters: () => void            // resets age/status/search back to defaults in the parent
}

const FetchPlayers = ({ ageFilter, statusFilter, searchInput, onPlayerClick, onClearFilters }: FetchPlayersProps) => {"""],
    """type FetchPlayersProps = {
  ageFilter: AgeGroup
  statusFilter: Status
  searchInput: string
  onPlayerClick: (id: string) => void   // called with the player's id when a card is clicked
  onClearFilters: () => void            // resets age/status/search back to defaults in the parent
}

// Stat numbers (G/A, SV/CS, APP.) share a fixed 69px-wide column but
// appearance counts routinely run 3-4 characters (e.g. "380+", "408") —
// that overflows the box at the base 40px size, so this scales the font
// down as the value gets longer instead of widening the card.
const statValueTextClass = (value: string | number) => {
  const length = String(value).length
  if (length >= 4) return 'text-[18px]'
  if (length === 3) return 'text-[24px]'
  return 'text-[40px]'
}

const FetchPlayers = ({ ageFilter, statusFilter, searchInput, onPlayerClick, onClearFilters }: FetchPlayersProps) => {""",
    "FetchPlayers.tsx: add statValueTextClass helper",
)

path = "src/components/player-information/FetchPlayers.tsx"
patch_one_of(
    path,
    ["""                      <span className='font-manrope font-bold text-[11px] leading-[100%]'>SV/CS</span>
                      <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{result.saves + result.cleanSheets}</span>"""],
    """                      <span className='font-manrope font-bold text-[11px] leading-[100%]'>SV/CS</span>
                      <span className={`font-wdxl-lubrifont-sc font-normal leading-[100%] ${statValueTextClass(result.saves + result.cleanSheets)}`}>{result.saves + result.cleanSheets}</span>""",
    "FetchPlayers.tsx: SV/CS number responsive size",
)

path = "src/components/player-information/FetchPlayers.tsx"
patch_one_of(
    path,
    ["""                      <span className='font-manrope font-bold text-[11px] leading-[100%]'>G/A</span>
                      <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{result.goals + result.assists}</span>"""],
    """                      <span className='font-manrope font-bold text-[11px] leading-[100%]'>G/A</span>
                      <span className={`font-wdxl-lubrifont-sc font-normal leading-[100%] ${statValueTextClass(result.goals + result.assists)}`}>{result.goals + result.assists}</span>""",
    "FetchPlayers.tsx: G/A number responsive size",
)

path = "src/components/player-information/FetchPlayers.tsx"
patch_one_of(
    path,
    ["""                    <span className='font-manrope font-bold text-[11px] leading-[100%]'>APP.</span>
                    <span className='font-wdxl-lubrifont-sc font-normal text-[40px] leading-[100%]'>{result.playerAppearance}</span>"""],
    """                    <span className='font-manrope font-bold text-[11px] leading-[100%]'>APP.</span>
                    <span className={`font-wdxl-lubrifont-sc font-normal leading-[100%] ${statValueTextClass(result.playerAppearance)}`}>{result.playerAppearance}</span>""",
    "FetchPlayers.tsx: APP. number responsive size",
)

path = "src/main.tsx"
patch_one_of(
    path,
    ["""import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
)"""],
    """import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StrictMode>,
)""",
    "main.tsx: wrap app in HelmetProvider (fixes react-helmet-async silently not working)",
)

path = "src/routes/main/home/index.tsx"
patch_one_of(
    path,
    ["""import SectionFive from '@/components/home/ArticleSection';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <HeroSec />"""],
    """import SectionFive from '@/components/home/ArticleSection';
import { Seo } from '@/components/seo';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <Seo
        title="Football Scouting, Player Management & Placement"
        description="UdeSport is Nigeria's most prolific football scouting and player placement academy — 38+ verified placements at professional clubs across Europe, Asia, and Africa."
      />
      <HeroSec />""",
    "home/index.tsx: add Seo",
)

path = "src/routes/main/about/index.tsx"
patch_one_of(
    path,
    ["""import AutoScroll from "embla-carousel-auto-scroll"

const About = () => {"""],
    """import AutoScroll from "embla-carousel-auto-scroll"
import { Seo } from "@/components/seo"

const About = () => {""",
    "about/index.tsx: import Seo",
)

path = "src/routes/main/about/index.tsx"
patch_one_of(
    path,
    ["""    <PageWrapper className="w-full px-5 lg:px-10 py-14 bg-white dark:bg-black transition-colors duration-300">
      {/* Hero */}"""],
    """    <PageWrapper className="w-full px-5 lg:px-10 py-14 bg-white dark:bg-black transition-colors duration-300">
      <Seo
        title="About Us"
        description="Meet the team behind UdeSport and see our track record of verified player placements at professional clubs across Europe, Asia, and Africa."
      />
      {/* Hero */}""",
    "about/index.tsx: render Seo",
)

path = "src/routes/main/contact/index.tsx"
patch_one_of(
    path,
    ["""import { toast } from "react-toastify"

const contactDetails = ["""],
    """import { toast } from "react-toastify"
import { Seo } from "@/components/seo"

const contactDetails = [""",
    "contact/index.tsx: import Seo",
)

path = "src/routes/main/contact/index.tsx"
patch_one_of(
    path,
    ["""    <div className="w-full px-5 lg:px-16 py-14 container mx-auto bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-5">
        {/* Left — Let's Talk */}"""],
    """    <div className="w-full px-5 lg:px-16 py-14 container mx-auto bg-white dark:bg-black transition-colors duration-300">
      <Seo
        title="Contact Us"
        description="Get in touch with UdeSport — Lekki, Lagos. Reach out for scouting inquiries, player placements, or partnership opportunities."
      />
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-5">
        {/* Left — Let's Talk */}""",
    "contact/index.tsx: render Seo",
)

path = "src/routes/main/articles/news/index.tsx"
patch_one_of(
    path,
    ["""import PageWrapper from '@/components/page-wrapper';"""],
    """import PageWrapper from '@/components/page-wrapper';
import { Seo } from '@/components/seo';""",
    "news/index.tsx: import Seo",
)

path = "src/routes/main/articles/news/index.tsx"
patch_one_of(
    path,
    ["""  return (
    <PageWrapper className="p-[20px] bg-white dark:bg-black transition-colors duration-300">
      <section className=" flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className='w-full lg:w-8/12'>"""],
    """  return (
    <PageWrapper className="p-[20px] bg-white dark:bg-black transition-colors duration-300">
      <Seo
        title="News & Transfers"
        description="The latest transfer news, academy updates, and milestones from UdeSport's roster of placed players."
      />
      <section className=" flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 lg:h-fit">
        <div className='w-full lg:w-8/12'>""",
    "news/index.tsx: render Seo",
)

path = "src/routes/main/player-information/index.tsx"
patch_one_of(
    path,
    ["""import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import PageWrapper from '@/components/page-wrapper'"""],
    """import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import PageWrapper from '@/components/page-wrapper'
import { Seo } from '@/components/seo'""",
    "player-information/index.tsx: import Seo",
)

path = "src/routes/main/player-information/index.tsx"
patch_one_of(
    path,
    ["""    <PageWrapper className='relative w-full min-h-screen p-[20px] monitorAdjust '>

      <div className='flex flex-col gap-[8px] mt-20 mb-5 relative'>"""],
    """    <PageWrapper className='relative w-full min-h-screen p-[20px] monitorAdjust '>
      <Seo
        title="Player Roster"
        description="Browse UdeSport's full roster of scouted and placed footballers — filter by age group, status, and position."
      />

      <div className='flex flex-col gap-[8px] mt-20 mb-5 relative'>""",
    "player-information/index.tsx: render Seo",
)

path = "src/routes/main/gallery/index.tsx"
patch_one_of(
    path,
    ["""import { useGetGalleryImages } from "@/hooks/useApi";
import PageWrapper from "@/components/page-wrapper";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";"""],
    """import { useGetGalleryImages } from "@/hooks/useApi";
import PageWrapper from "@/components/page-wrapper";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import { Seo } from "@/components/seo";

const GALLERY_SEO = {
  title: "Gallery",
  description: "Photos from training, transfers, and tournaments — UdeSport's journey from Lagos to the world.",
};""",
    "gallery/index.tsx: import Seo + shared GALLERY_SEO constant",
)

path = "src/routes/main/gallery/index.tsx"
patch_one_of(
    path,
    ["""  if (isLoading) {
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
  }"""],
    """  if (isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden flex justify-center">
        <Seo {...GALLERY_SEO} />
        <PageWrapper className=" p-[20px]">
          <GalleryHeader />
          <GallerySkeleton />
        </PageWrapper>
      </main>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-[#060A0F] dark:text-white p-6">
        <Seo {...GALLERY_SEO} />
        Failed to load gallery.
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-[#060A0F] dark:text-white p-6">
        <Seo {...GALLERY_SEO} />
        No gallery images available.
      </div>
    );
  }""",
    "gallery/index.tsx: render Seo on loading/error/empty states",
)

path = "src/routes/main/gallery/index.tsx"
patch_one_of(
    path,
    ["""  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden flex justify-center">
      <PageWrapper className=" p-[20px]">
        <GalleryHeader />

        {/* Interactive image/video display */}
        <InteractiveBentoGallery mediaItems={mediaItems} />
      </PageWrapper>
    </main>
  );
}"""],
    """  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden flex justify-center">
      <Seo {...GALLERY_SEO} />
      <PageWrapper className=" p-[20px]">
        <GalleryHeader />

        {/* Interactive image/video display */}
        <InteractiveBentoGallery mediaItems={mediaItems} />
      </PageWrapper>
    </main>
  );
}""",
    "gallery/index.tsx: render Seo on main state",
)

print("Done.")
PYEOF

echo ""
echo "Next: verify with"
echo "  npx tsc -p tsconfig.app.json --noEmit && npx eslint . && npm run build"
