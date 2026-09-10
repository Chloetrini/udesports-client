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
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import udeLogo from "../assets/udeLogo.png";
import { adminUser } from "@/lib/adminUser";

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
  return (
    <div className="h-20 bg-white flex items-center justify-between gap-4 px-6 sticky top-0 z-10 border-b border-gray-100">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}

        className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="flex items-center gap-1.5 text-xs lg:text-sm text-gray-600 border border-gray-200 px-2 lg:px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          onClick={() => navigate("/")}>
          Visit Sites
          <ArrowUpRight size={15} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-black text-[14px] font-medium">
            {getInitials(adminUser.name)}
          </div>
          <div className="leading-tight">
            <p className="text-xs lg:text-sm font-semibold text-gray-900">
              {adminUser.name}
            </p>
            <p className="text-[10px] text-gray-600 font-semibold">
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
        fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-100 flex flex-col z-40
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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
            <p className="text-l font-semibold text-gray-600">UDESport</p>
            <p className="text-sm text-gray-600">Management Ltd</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navItems.map((group, index) => (
            <div key={index}>
              {group.section && (
                <p className="text-sm font-medium text-gray-400 px-2 mb-1">
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
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
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
    <div className="flex min-h-screen bg-gray-50 max-w-screen-2xl mx-auto w-full">
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