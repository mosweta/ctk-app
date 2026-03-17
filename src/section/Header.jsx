import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logoctk.png';
import './header.css';
import { 
  Home, 
  Users, 
  Cross, 
  Calendar, 
  Mail, 
  Menu, 
  ChevronDown,
  Image,
  Clock,
  Heart,
  Bell,
  User
} from 'lucide-react';
import { FiX } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLiturgyOpen, setIsLiturgyOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Navigation items data
  const navItems = {
    about: {
      title: 'About',
      icon: <Users />,
      dropdown: [
        { title: 'Staff', path: '/staff', icon: <User /> },
        { title: 'Photo Album', path: '/photo-album', icon: <Image /> },
        { title: 'Contact Us', path: '/contact-us', icon: <Mail /> }
      ]
    },
    liturgy: {
      title: 'Liturgy',
      icon: <Cross />,
      dropdown: [
        { title: 'Mass Times', path: '/mass-time', icon: <Clock /> },
        { title: 'Adoration', path: '/adoration-time', icon: <Heart /> },
        { title: 'Confession', path: '/confession-time', icon: <Cross /> }
      ]
    },
    events: {
      title: 'Events & News',
      icon: <Calendar />,
      dropdown: [
        { title: 'Calendar', path: '/calendar', icon: <Calendar /> },
        { title: 'News', path: '/news', icon: <Bell /> }
      ]
    }
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <nav className="nav-container">
          {/* Logo */}
          <motion.div 
            className="logo-wrapper"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('/')}
          >
            <img src={logo} alt="Christ the King Logo" className="logo" />
            <span className="logo-text">CTK</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="nav-menu-desktop">
            <motion.button
              className="nav-link"
              onClick={() => handleNavigation('/')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="nav-icon" />
              Home
            </motion.button>

            {/* About Dropdown */}
            <div className="dropdown-container">
              <motion.button
                className="nav-link dropdown-trigger"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
              >
                <Users className="nav-icon" />
                About
                <ChevronDown className={`dropdown-arrow ${isAboutOpen ? 'rotated' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {isAboutOpen && (
                  <motion.div 
                    className="dropdown-menu"
                    onMouseEnter={() => setIsAboutOpen(true)}
                    onMouseLeave={() => setIsAboutOpen(false)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {navItems.about.dropdown.map((item, index) => (
                      <motion.button
                        key={index}
                        className="dropdown-item"
                        onClick={() => handleNavigation(item.path)}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="dropdown-icon">{item.icon}</span>
                        {item.title}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Liturgy Dropdown */}
            <div className="dropdown-container">
              <motion.button
                className="nav-link dropdown-trigger"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsLiturgyOpen(true)}
                onMouseLeave={() => setIsLiturgyOpen(false)}
              >
                <Cross className="nav-icon" />
                Liturgy
                <ChevronDown className={`dropdown-arrow ${isLiturgyOpen ? 'rotated' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {isLiturgyOpen && (
                  <motion.div 
                    className="dropdown-menu"
                    onMouseEnter={() => setIsLiturgyOpen(true)}
                    onMouseLeave={() => setIsLiturgyOpen(false)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {navItems.liturgy.dropdown.map((item, index) => (
                      <motion.button
                        key={index}
                        className="dropdown-item"
                        onClick={() => handleNavigation(item.path)}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="dropdown-icon">{item.icon}</span>
                        {item.title}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              className="nav-link"
              onClick={() => scrollToSection('sacraments')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Sacraments
            </motion.button>

            <motion.button
              className="nav-link"
              onClick={() => handleNavigation('/get-involved')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Involved
            </motion.button>

            {/* Events Dropdown */}
            <div className="dropdown-container">
              <motion.button
                className="nav-link dropdown-trigger"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsEventsOpen(true)}
                onMouseLeave={() => setIsEventsOpen(false)}
              >
                <Calendar className="nav-icon" />
                Events
                <ChevronDown className={`dropdown-arrow ${isEventsOpen ? 'rotated' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {isEventsOpen && (
                  <motion.div 
                    className="dropdown-menu"
                    onMouseEnter={() => setIsEventsOpen(true)}
                    onMouseLeave={() => setIsEventsOpen(false)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {navItems.events.dropdown.map((item, index) => (
                      <motion.button
                        key={index}
                        className="dropdown-item"
                        onClick={() => handleNavigation(item.path)}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="dropdown-icon">{item.icon}</span>
                        {item.title}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX /> : <Menu />}
          </motion.button>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div 
              className="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="sidebar-header">
                <img src={logo} alt="CTK Logo" className="sidebar-logo" />
                <h3 className="sidebar-title">Christ the King</h3>
                <p className="sidebar-subtitle">Catholic Church</p>
              </div>

              <div className="sidebar-nav">
                {/* Home */}
                <motion.button
                  className="sidebar-nav-item"
                  onClick={() => handleNavigation('/')}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="sidebar-icon" />
                  Home
                </motion.button>

                {/* About Section */}
                <div className="sidebar-section">
                  <motion.button
                    className="sidebar-section-header"
                    onClick={() => setIsAboutOpen(!isAboutOpen)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users className="sidebar-icon" />
                    About
                    <ChevronDown className={`section-arrow ${isAboutOpen ? 'open' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {isAboutOpen && (
                      <motion.div 
                        className="sidebar-submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {navItems.about.dropdown.map((item, index) => (
                          <motion.button
                            key={index}
                            className="sidebar-submenu-item"
                            onClick={() => handleNavigation(item.path)}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="submenu-icon">{item.icon}</span>
                            {item.title}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Liturgy Section */}
                <div className="sidebar-section">
                  <motion.button
                    className="sidebar-section-header"
                    onClick={() => setIsLiturgyOpen(!isLiturgyOpen)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Cross className="sidebar-icon" />
                    Liturgy
                    <ChevronDown className={`section-arrow ${isLiturgyOpen ? 'open' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {isLiturgyOpen && (
                      <motion.div 
                        className="sidebar-submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {navItems.liturgy.dropdown.map((item, index) => (
                          <motion.button
                            key={index}
                            className="sidebar-submenu-item"
                            onClick={() => handleNavigation(item.path)}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="submenu-icon">{item.icon}</span>
                            {item.title}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sacraments */}
                <motion.button
                  className="sidebar-nav-item"
                  onClick={() => scrollToSection('sacraments')}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sacraments
                </motion.button>

                {/* Get Involved */}
                <motion.button
                  className="sidebar-nav-item"
                  onClick={() => handleNavigation('/get-involved')}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Involved
                </motion.button>

                {/* Events Section */}
                <div className="sidebar-section">
                  <motion.button
                    className="sidebar-section-header"
                    onClick={() => setIsEventsOpen(!isEventsOpen)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar className="sidebar-icon" />
                    Events
                    <ChevronDown className={`section-arrow ${isEventsOpen ? 'open' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {isEventsOpen && (
                      <motion.div 
                        className="sidebar-submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {navItems.events.dropdown.map((item, index) => (
                          <motion.button
                            key={index}
                            className="sidebar-submenu-item"
                            onClick={() => handleNavigation(item.path)}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="submenu-icon">{item.icon}</span>
                            {item.title}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="sidebar-footer">
                <p className="sidebar-footer-text">© 2024 Christ the King</p>
                <p className="sidebar-footer-text">All rights reserved</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;