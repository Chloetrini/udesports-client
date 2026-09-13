import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LayoutDashboard } from 'lucide-react';
import udeLogo from '@/assets/udeLogo.png';
import hamburgerLogo from '@/assets/hamburgerLogo.png';
import PageWrapper from '../page-wrapper';
import { useTheme } from '@/contexts/ThemeContext';
import { useMe } from '@/hooks/useApi';

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    // Quietly checks whether an admin session cookie is already active (e.g.
    // the admin browsing the public site in another tab) so we can offer a
    // way back to the dashboard without them having to type the URL or log
    // in again. A logged-out visitor gets a normal 401 here — isError just
    // means "not logged in," not a real failure — so nothing extra shows.
    const { data: meData, isError: notLoggedIn } = useMe();
    const isAdminLoggedIn = !!meData && !notLoggedIn;

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

    const handleDashboardClick = () => {
        navigate('/admin/dashboard');
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

                        {/* Dashboard button — only rendered when an admin session is already active */}
                        {isAdminLoggedIn && (
                            <button
                                className="
                                    hidden md:flex
                                    w-auto min-w-30 lg:w-41 h-11.25 px-4 lg:px-3
                                    bg-transparent border border-[#00D46A]
                                    rounded-md text-[#00D46A] font-manrope text-sm font-medium
                                    items-center justify-center gap-2
                                    cursor-pointer transition-all duration-200
                                    hover:bg-[#00D46A1A]
                                    active:scale-95
                                "
                                onClick={handleDashboardClick}
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </button>
                        )}

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

                        {/* Dashboard link — only rendered when an admin session is already active */}
                        {isAdminLoggedIn && (
                            <button
                                className="
                    w-full max-w-xs h-11.25 p-3
                    bg-transparent border border-[#00D46A]
                    rounded-md text-[#00D46A] font-manrope text-sm font-medium
                    flex items-center justify-center gap-2
                    cursor-pointer transition-all duration-200
                    hover:bg-[#00D46A1A]
                    active:scale-95
                "
                                onClick={handleDashboardClick}
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </button>
                        )}

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


