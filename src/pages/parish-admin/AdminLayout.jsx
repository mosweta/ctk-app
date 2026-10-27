/**
 * Admin dashboard layout.
 *
 * Sidebar navigation + top bar. The main content area renders child
 * routes via <Outlet />.
 *
 * Responsive:
 *   - lg and up: sidebar is a static, always-visible column.
 *   - below lg: sidebar is a fixed overlay (drawer).
 *
 * Theming:
 *   - Uses the shared site-wide theme (see src/hooks/useTheme.js and
 *     ThemeContext). Toggling the theme here updates the same
 *     localStorage key and the `dark` class on <html> that the
 *     public site uses.
 *   - All surfaces, text, and borders use semantic tokens so both
 *     themes work without overrides.
 */

import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import logo from '../../assets/logoctk.webp';
import ThemeToggle from '../../components/ThemeToggle';

const NAV_ITEMS = [
  { path: '/parish-admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/parish-admin/events', icon: Calendar, label: 'Events' },
  { path: '/parish-admin/announcements', icon: Bell, label: 'Announcements' },
  { path: '/parish-admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { path: '/parish-admin/groups', icon: Users, label: 'Groups & Jumuiyas' },
  { path: '/parish-admin/settings', icon: Settings, label: 'Settings' },
  { path: '/parish-admin/staff', icon: Users, label: 'Staff' },
  { path: '/parish-admin/livestreams', icon: FaYoutube, label: 'Livestreams' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(null);

  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const asideRef = useRef(null);

  // Close drawer on route change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarOpen(false);
  }, [location.pathname]);

  // Drawer focus trap, Escape, scroll lock.
  useEffect(() => {
    if (!sidebarOpen) return;

    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => {
      asideRef.current
        ?.querySelector('a, button, [tabindex]:not([tabindex="-1"])')
        ?.focus();
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = asideRef.current?.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus?.();
      }
    };
  }, [sidebarOpen]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
      navigate('/parish-admin/login');
    } catch {
      setSignOutError(
        'We could not sign you out. Please check your connection and try again.'
      );
    } finally {
      setSigningOut(false);
    }
  };

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const currentLabel =
    NAV_ITEMS.find((item) => isActive(item.path, item.exact))?.label ||
    'Admin';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={asideRef}
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-base text-on-base
                    transform transition-transform duration-200
                    flex flex-col
                    lg:static lg:translate-x-0 lg:transition-none
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    motion-reduce:transition-none`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <img
            src={logo}
            alt=""
            className="w-10 h-10 rounded-full border-2 border-white/30"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight truncate">
              Christ the King
            </p>
            <p className="text-xs text-white/60">Parish Admin</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Close sidebar"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Nav */}
        <nav
          className="flex-1 overflow-y-auto p-3"
          aria-label="Admin navigation"
        >
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={() =>
                      [
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                        'text-sm font-medium transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'focus-visible:ring-white/60',
                        active
                          ? 'bg-white/15 text-white'
                          : 'text-white/75 hover:bg-white/10 hover:text-white',
                      ].join(' ')
                    }
                  >
                    <Icon size={18} className="shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Account + sign-out */}
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-2 min-w-0">
            <p className="text-xs text-white/50">Signed in as</p>
            <p className="text-sm font-medium truncate" title={user?.email || ''}>
              {user?.email || '—'}
            </p>
          </div>

          {signOutError && (
            <div
              role="alert"
              className="mb-2 flex items-start gap-2 rounded-md bg-red-500/15 border border-red-400/30 px-3 py-2 text-xs text-red-100"
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>{signOutError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-busy={signingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm font-medium text-red-200
                       hover:bg-red-500/20
                       transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-white/60"
          >
            {signingOut ? (
              <Loader2 size={18} className="animate-spin shrink-0" aria-hidden="true" />
            ) : (
              <LogOut size={18} className="shrink-0" aria-hidden="true" />
            )}
            <span>{signingOut ? 'Signing out…' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-20 bg-surface border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-body hover:bg-primary-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <h1 className="text-lg font-semibold text-heading truncate">
              {currentLabel}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1 py-0.5"
            >
              <Home size={16} aria-hidden="true" />
              <span className="hidden sm:inline">View Website</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}