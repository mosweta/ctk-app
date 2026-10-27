/**
 * Header
 *
 * Site-wide navigation bar. Sticky at the top of every page.
 *
 * Design notes:
 *   - Generous gaps between nav items and inside buttons so the header
 *     breathes and fills space evenly.
 *   - ThemeToggle is separated by a vertical divider.
 *   - Desktop navigation is shown at the `lg` breakpoint (1024px+),
 *     not `md`. At `md` the six-item nav plus logo plus theme toggle
 *     overflows the viewport; `lg` gives it room without shrinking
 *     anything or dropping nav items.
 *   - Mobile drawer uses large, thumb-friendly rows: ~64px top-level
 *     items, ~56px sub-menu items, with 20px vertical gaps.
 *   - Give is a filled primary CTA (not a subtle nav button) to
 *     distinguish it from navigation. Same treatment on desktop and
 *     in the mobile drawer.
 *
 * Accessibility:
 *   - Desktop dropdown triggers are real buttons with click + keyboard
 *     activation, aria-haspopup, aria-expanded, and aria-controls.
 *   - Escape closes an open dropdown and returns focus to its trigger.
 *   - Mobile drawer has role="dialog", aria-modal="true", a labelled
 *     title, moves focus in on open, restores focus on close, traps Tab
 *     inside, and closes on Escape.
 *   - aria-labels on all icon-only controls.
 *   - Body scroll locks while the mobile drawer is open.
 */

import { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Cross,
  Calendar,
  Mail,
  Menu,
  ChevronDown,
  Image as ImageIcon,
  Clock,
  Heart,
  Bell,
  User,
  Crown,
  BookOpen,
  X,
} from 'lucide-react';
import logo from '../assets/logoctk.webp';
import ThemeToggle from '../components/ThemeToggle';

const NAV = {
  about: {
    title: 'About',
    icon: Users,
    dropdown: [
      { title: 'Staff', path: '/staff', icon: User },
      { title: 'Photo Album', path: '/gallery', icon: ImageIcon },
      { title: 'Contact Us', path: '/contact', icon: Mail },
      { title: 'History', path: '/history', icon: Crown },
    ],
  },
  liturgy: {
    title: 'Liturgy',
    icon: Cross,
    dropdown: [
      { title: 'Sacraments', path: '/sacrament', icon: Heart },
      { title: 'Daily Readings', path: '/readings', icon: BookOpen },
      { title: 'Mass Times', path: '/mass-times', icon: Clock },
      { title: 'Confession Times', path: '/confession', icon: Cross },
      { title: 'Adoration Times', path: '/adoration', icon: Heart },
    ],
  },
  events: {
    title: 'Events',
    icon: Calendar,
    dropdown: [
      { title: 'Upcoming Events', path: '/events', icon: Calendar },
      { title: 'Calendar', path: '/calendar', icon: Calendar },
      { title: 'Announcements', path: '/announcements', icon: Bell },
    ],
  },
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSection, setMobileSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const drawerRef = useRef(null);
  const previouslyFocused = useRef(null);
  const triggerRefs = useRef({});

  // Scroll shadow.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileSection(null);
  }, [location.pathname]);

  // Global Escape handler for desktop dropdowns.
  useEffect(() => {
    if (!openDropdown) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        triggerRefs.current[openDropdown]?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openDropdown]);

  // Mobile drawer: focus management, Tab trap, Escape, scroll lock.
  useEffect(() => {
    if (!mobileOpen) return;

    previouslyFocused.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => {
      drawerRef.current
        ?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        ?.focus();
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;

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
      previouslyFocused.current?.focus?.();
    };
  }, [mobileOpen]);

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-surface/98 backdrop-blur-md shadow-md'
            : 'bg-surface/95 backdrop-blur-sm shadow-sm'
        }`}
      >
        <nav
          className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8
                     flex justify-between items-center h-20 md:h-24"
        >
          {/* Logo */}
          <button
            onClick={() => go('/')}
            className="flex items-center gap-4 group"
            aria-label="Christ the King - Home"
          >
            <img
              src={logo}
              alt=""
              className="h-14 w-14 md:h-16 md:w-16 rounded-full
                         transition-transform group-hover:scale-105
                         dark:bg-white/10 dark:p-0.5"
            />
            <span className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
              CTK
            </span>
          </button>

          {/* Desktop Navigation (lg and up) */}
          <div className="hidden lg:flex items-center gap-2">
            <NavButton icon={Home} label="Home" onClick={() => go('/')} />

            {Object.entries(NAV).map(([key, group]) => {
              const GroupIcon = group.icon;
              const isOpen = openDropdown === key;
              const triggerId = `nav-trigger-${key}`;
              const panelId = `nav-panel-${key}`;

              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(key)}
                  onMouseLeave={() =>
                    setOpenDropdown((cur) => (cur === key ? null : cur))
                  }
                >
                  <NavButton
                    ref={(el) => {
                      triggerRefs.current[key] = el;
                    }}
                    id={triggerId}
                    icon={GroupIcon}
                    label={group.title}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenDropdown((cur) => (cur === key ? null : key))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setOpenDropdown(key);
                        requestAnimationFrame(() => {
                          document
                            .querySelector(`#${panelId} [data-menu-item]`)
                            ?.focus();
                        });
                      }
                    }}
                    trailing={
                      <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className={`transition-transform duration-200 ml-1 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    }
                  />

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="menu"
                        aria-labelledby={triggerId}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setOpenDropdown(null);
                            triggerRefs.current[key]?.focus();
                          }
                        }}
                        className={`absolute top-full w-64 bg-surface
                                    border border-border rounded-xl shadow-xl
                                    py-2 overflow-hidden ${
                                      key === 'events' ? 'right-0' : 'left-0'
                                    }`}
                      >
                        {group.dropdown.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.path}
                              data-menu-item
                              role="menuitem"
                              onClick={() => go(item.path)}
                              className="w-full flex items-center gap-3 px-4 py-3
                                         text-[15px] font-medium text-body
                                         hover:bg-primary-light hover:text-primary
                                         focus-visible:outline-none
                                         focus-visible:bg-primary-light
                                         focus-visible:text-primary
                                         transition-colors text-left"
                            >
                              <ItemIcon
                                size={18}
                                className="text-primary"
                                aria-hidden="true"
                              />
                              {item.title}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <NavButton
              icon={Heart}
              label="Get Involved"
              onClick={() => go('/get-involved')}
            />

            {/* Give CTA — distinct from nav items, prominent primary button */}
            <button
              type="button"
              onClick={() => go('/give')}
              className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                         bg-primary text-on-primary font-semibold text-[15px]
                         shadow-sm hover:bg-primary-hover hover:shadow-md
                         transition-colors
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Heart size={18} aria-hidden="true" />
              Give
            </button>

            <div className="ml-4 pl-4 border-l border-border flex items-center justify-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Trigger (below lg) */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-primary hover:bg-primary-light
                         transition-colors"
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-nav-title"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]
                         bg-surface flex flex-col shadow-2xl lg:hidden"
            >
              {/* Sidebar Header */}
              <div className="bg-base text-white px-6 py-8 flex flex-col items-center relative">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 p-3 rounded-lg text-white/70
                             hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
                <img
                  src={logo}
                  alt=""
                  className="h-20 w-20 rounded-full border-4 border-white/20 mb-4"
                />
                <h3 id="mobile-nav-title" className="font-bold text-xl">
                  Christ the King
                </h3>
                <p className="text-sm text-white/70">Catholic Parish</p>
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                <MobileNavItem
                  icon={Home}
                  label="Home"
                  onClick={() => go('/')}
                />

                {Object.entries(NAV).map(([key, group]) => {
                  const GroupIcon = group.icon;
                  const isOpen = mobileSection === key;
                  const regionId = `mobile-group-${key}`;

                  return (
                    <div key={key}>
                      <button
                        onClick={() => setMobileSection(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        aria-controls={regionId}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl
                                   text-body font-semibold text-base
                                   hover:bg-primary-light hover:text-primary
                                   transition-colors
                                   focus-visible:outline-none focus-visible:ring-2
                                   focus-visible:ring-primary"
                      >
                        <GroupIcon
                          size={24}
                          className="text-primary shrink-0"
                          aria-hidden="true"
                        />
                        <span className="flex-1 text-left">{group.title}</span>
                        <ChevronDown
                          size={20}
                          aria-hidden="true"
                          className={`shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            id={regionId}
                            role="group"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-3 mt-3 space-y-2"
                          >
                            {group.dropdown.map((item) => {
                              const ItemIcon = item.icon;
                              return (
                                <button
                                  key={item.path}
                                  onClick={() => go(item.path)}
                                  className="w-full flex items-center gap-3.5 px-4 py-3.5
                                             text-[15px] font-medium text-muted
                                             hover:text-primary hover:bg-primary-light
                                             rounded-lg transition-colors text-left
                                             focus-visible:outline-none
                                             focus-visible:ring-2
                                             focus-visible:ring-primary"
                                >
                                  <ItemIcon
                                    size={20}
                                    className="shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.title}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <MobileNavItem
                  icon={Heart}
                  label="Get Involved"
                  onClick={() => go('/get-involved')}
                />

                {/* Give CTA in drawer — same visual weight as desktop */}
                <button
                  type="button"
                  onClick={() => go('/give')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4
                             rounded-xl bg-primary text-on-primary
                             font-semibold text-base shadow-sm
                             hover:bg-primary-hover transition-colors
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Heart size={20} aria-hidden="true" />
                  Give
                </button>
              </nav>

              <div className="px-6 py-5 border-t border-border text-center">
                <p className="text-xs text-muted">
                  © {new Date().getFullYear()} Christ the King Parish
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Desktop navigation button. Forwards ref + extra props so dropdown
 * triggers can attach keyboard and accessibility handlers.
 */
const NavButton = forwardRef(function NavButton(
  { icon: Icon, label, trailing, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                 text-[15px] font-semibold text-body
                 hover:bg-primary-light hover:text-primary transition-colors
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-primary"
      {...rest}
    >
      <Icon size={20} className="text-primary" strokeWidth={2} aria-hidden="true" />
      {label}
      {trailing}
    </button>
  );
});

/**
 * Mobile drawer top-level navigation item. Large tap target.
 */
function MobileNavItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl
                 text-body font-semibold text-base
                 hover:bg-primary-light hover:text-primary transition-colors
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-primary"
    >
      <Icon
        size={24}
        className="text-primary shrink-0"
        strokeWidth={2}
        aria-hidden="true"
      />
      {label}
    </button>
  );
}