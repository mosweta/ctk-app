/**
 * Admin dashboard layout.
 *
 * Sidebar navigation + top bar. The main content area renders child
 * routes via <Outlet />.
 *
 * Responsive: sidebar collapses to a hamburger on mobile.
 */

import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
} from 'lucide-react';
import logo from '../../assets/logoctk.png';
import { FaYoutube } from 'react-icons/fa';
const NAV_ITEMS = [
  { path: '/parish-admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/parish-admin/events', icon: Calendar, label: 'Events' },
  { path: '/parish-admin/announcements', icon: Bell, label: 'Announcements' },
  { path: '/parish-admin/readings', icon: BookOpen, label: 'Daily Readings' },
  { path: '/parish-admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { path: '/parish-admin/groups', icon: Users, label: 'Groups & Jumuiyas' },
  { path: '/parish-admin/settings', icon: Settings, label: 'Settings' },
  { path: '/parish-admin/staff', icon: Users, label: 'Staff' },
  { path: '/parish-admin/livestreams', icon: FaYoutube, label: 'Livestreams' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/parish-admin/login');
  };

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const currentLabel =
    NAV_ITEMS.find((item) => isActive(item.path, item.exact))?.label || 'Admin';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1e4a2a] text-white
                    transform transition-transform duration-300 flex flex-col shadow-xl
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <img
            src={logo}
            alt="CTK"
            className="w-10 h-10 rounded-full border-2 border-white/30"
          />
          <div className="flex-1">
            <p className="font-bold text-sm leading-tight">Christ the King</p>
            <p className="text-xs text-white/60">Parish Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                                text-sm font-medium transition-colors
                                ${active
                                  ? 'bg-white/15 text-white'
                                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-white/50">Signed in as</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm font-medium text-red-200 hover:bg-red-500/20
                       transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">{currentLabel}</h1>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#800000] transition-colors"
          >
            <Home size={16} />
            <span className="hidden sm:inline">View Website</span>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}