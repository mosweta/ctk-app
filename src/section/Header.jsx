/**
 * Header
 *
 * Site-wide navigation bar. Sticky at the top of every page.
 *
 * Design notes:
 *   - Generous gaps between nav items (gap-3) and inside buttons
 *     (gap-2.5) so the header breathes and fills space evenly.
 *   - ThemeToggle is separated by a vertical divider with ample
 *     padding (ml-6 pl-6).
 *   - Mobile sidebar uses space-y-3 for top-level items and gap-3.5
 *     between icon and label.
 *
 * Accessibility:
 *   - aria-labels on all icon-only controls.
 *   - Mobile drawer has a close button and dismisses on backdrop.
 *   - Body scroll locks while the mobile drawer is open.
 */

import { useState, useEffect } from 'react';
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
import logo from '../assets/logoctk.png';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileSection(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
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
        <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8
                        flex justify-between items-center h-20 md:h-24">
          
          {/* Logo */}
          <button
            onClick={() => go('/')}
            className="flex items-center gap-6 group"
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <NavButton icon={Home} label="Home" onClick={() => go('/')} />

            {Object.entries(NAV).map(([key, group]) => {
              const GroupIcon = group.icon;
              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <NavButton
                    icon={GroupIcon}
                    label={group.title}
                    trailing={
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ml-1 ${
                          openDropdown === key ? 'rotate-180' : ''
                        }`}
                      />
                    }
                  />
                  <AnimatePresence>
                    {openDropdown === key && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-64 bg-surface
                                   border border-border rounded-xl shadow-xl
                                   py-2 overflow-hidden"
                      >
                        {group.dropdown.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.path}
                              onClick={() => go(item.path)}
                              className="w-full flex items-center gap-3 px-4 py-3
                                         text-[15px] font-medium text-body
                                         hover:bg-primary-light hover:text-primary
                                         transition-colors text-left"
                            >
                              <ItemIcon size={18} className="text-primary" />
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

            {/* Theme Toggle integrated with more gap */}
            <div className="ml-10 pl-6 border-l border-border flex items-center justify-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Trigger */}
          <div className="md:hidden flex items-center gap-3">
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

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]
                         bg-surface flex flex-col shadow-2xl md:hidden"
            >
              {/* Sidebar Header */}
              <div className="bg-base text-white px-6 py-8 flex flex-col items-center relative">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
                <img
                  src={logo}
                  alt=""
                  className="h-20 w-20 rounded-full border-4 border-white/20 mb-4"
                />
                <h3 className="font-bold text-xl">Christ the King</h3>
                <p className="text-sm text-white/70">Catholic Parish</p>
              </div>

              {/* Sidebar Navigation with increased vertical gaps */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-3">
                <MobileNavItem
                  icon={Home}
                  label="Home"
                  onClick={() => go('/')}
                />

                {Object.entries(NAV).map(([key, group]) => {
                  const GroupIcon = group.icon;
                  const isOpen = mobileSection === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => setMobileSection(isOpen ? null : key)}
                        className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl
                                   text-body font-semibold text-[15px]
                                   hover:bg-primary-light hover:text-primary
                                   transition-colors"
                      >
                        <GroupIcon size={22} className="text-primary" />
                        <span className="flex-1 text-left">{group.title}</span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {/* Sub-menu with better spacing */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-8 mt-2 space-y-1.5"
                          >
                            {group.dropdown.map((item) => {
                              const ItemIcon = item.icon;
                              return (
                                <button
                                  key={item.path}
                                  onClick={() => go(item.path)}
                                  className="w-full flex items-center gap-3 px-4 py-3
                                             text-sm font-medium text-muted
                                             hover:text-primary hover:bg-primary-light
                                             rounded-lg transition-colors text-left"
                                >
                                  <ItemIcon size={18} />
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
 * Desktop navigation button. Enlarged icons, generous padding, gap-2.5
 * between icon and text.
 */
function NavButton({ icon: Icon, label, trailing, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                 text-[15px] font-semibold text-body
                 hover:bg-primary-light hover:text-primary transition-colors"
    >
      <Icon size={20} className="text-primary" strokeWidth={2} />
      {label}
      {trailing}
    </button>
  );
}

/**
 * Mobile drawer navigation item. Larger icons, gap-3.5 between icon
 * and label.
 */
function MobileNavItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl
                 text-body font-semibold text-[15px]
                 hover:bg-primary-light hover:text-primary transition-colors"
    >
      <Icon size={22} className="text-primary" strokeWidth={2} />
      {label}
    </button>
  );
}