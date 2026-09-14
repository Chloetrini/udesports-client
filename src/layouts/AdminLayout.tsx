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
import { useEffect, useState } from "react";
import udeLogo from "../assets/udeLogo.png";
import { useTheme } from "@/contexts/ThemeContext";
import { useMe, useLogout, useGetNotifications } from "@/hooks/useApi";
import type { AdminUser } from "@/services/Auth";

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

function Topbar({ onMenuClick, admin }: { onMenuClick: () => void; admin?: AdminUser }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { data: notificationsData } = useGetNotifications();
  const unreadCount = notificationsData?.unreadCount ?? 0;
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
        {/* Notification bell — unread count from the same admin inbox as
            the Notifications page, so it always matches what's there. */}
        <button
          type="button"
          onClick={() => navigate("/admin/notifications")}
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
          className="relative flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 rounded-lg border border-gray-200 dark:border-white/15 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        <button className="flex items-center gap-1.5 text-xs lg:text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-2 lg:px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
          onClick={() => navigate("/")}>
          Visit Sites
          <ArrowUpRight size={15} />
        </button>
        {admin && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-black text-[14px] font-medium">
              {getInitials(admin.name)}
            </div>
            <div className="leading-tight">
              <p className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">
                {admin.name}
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold">
                {admin.role}
              </p>
            </div>
          </div>
        )}
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

  const authPages = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/verification",
    "/admin/new-password",
  ];

  const isAuthPage = authPages.includes(location.pathname);

  const { data: meData, isLoading: meLoading, isError: meError } = useMe();
  const logoutMutation = useLogout();

  // Not logged in and not already on an auth page — bounce to login.
  useEffect(() => {
    if (!isAuthPage && !meLoading && meError) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthPage, meLoading, meError, navigate]);

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/admin/login");
    }
  }

  // Checking the session — don't flash protected content (or the login
  // redirect) before we know whether the admin is actually logged in.
  if (!isAuthPage && meLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black transition-colors duration-300">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-white/15 border-t-green-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthPage && meError) {
    // useEffect above is redirecting — render nothing in the meantime.
    return null;
  }

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
        className={`flex-1 min-w-0 ${!isAuthPage ? "lg:ml-56" : ""}`}
      >
        {!isAuthPage && <Topbar onMenuClick={() => setSidebarOpen(true)} admin={meData?.admin} />}
        <div className="overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
