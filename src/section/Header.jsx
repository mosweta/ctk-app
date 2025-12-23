import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/logoctk.png'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutHovered, setIsAboutHovered] = useState(false)
  const [isLiturgyHovered, setIsLiturgyHovered] = useState(false)
  const [isEventsHovered, setIsEventsHovered] = useState(false)
  const navigate = useNavigate()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleHomeClick = () => {
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Logo/Brand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{ 
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img
            src= {logo} // TODO: Replace with actual logo path once added
            alt="CTK Logo"
            style={{
              height: '80px',
              width: 'auto',
              borderRadius: '50%',
              objectFit: 'contain'
            }}
          />
        </motion.div>

        {/* Navigation */}
        <div
          className={`nav-menu ${isMenuOpen ? 'active' : ''}`}
        >
          <motion.button
            onClick={handleHomeClick}
            whileHover={{ scale: 1.05 }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              position: 'relative',
              '@media (max-width: 768px)': {
                width: '100%',
                textAlign: 'center',
                padding: '1rem',
                borderBottom: '1px solid #edf2f7',
                fontSize: '1.1rem'
              }
            }}
          >
            Home
          </motion.button>
          <div
            className="nav-item"
            onMouseEnter={() => setIsAboutHovered(true)}
            onMouseLeave={() => setIsAboutHovered(false)}
            style={{ position: 'relative' }}
          >
            <motion.button
              onClick={() => scrollToSection('about')}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                position: 'relative',
                '@media (max-width: 768px)': {
                  width: '100%',
                  textAlign: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #edf2f7',
                  fontSize: '1.1rem'
                }
              }}
            >
              About
            </motion.button>
            {isAboutHovered && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/staff')}>Staff</button>
                <button onClick={() => navigate('/photo-album')}>Photo Album</button>
                <button onClick={() => navigate('/contact-us')}>Contact Us</button>
              </div>
            )}
          </div>
          <div
            className="nav-item"
            onMouseEnter={() => setIsLiturgyHovered(true)}
            onMouseLeave={() => setIsLiturgyHovered(false)}
            style={{ position: 'relative' }}
          >
            <motion.button
              onClick={() => scrollToSection('liturgy')}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                position: 'relative',
                '@media (max-width: 768px)': {
                  width: '100%',
                  textAlign: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #edf2f7',
                  fontSize: '1.1rem'
                }
              }}
            >
              Liturgy
            </motion.button>
            {isLiturgyHovered && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/mass-time')}>Mass Time</button>
                <button onClick={() => navigate('/adoration-time')}>Adoration Time</button>
                <button onClick={() => navigate('/confession-time')}>Confession Time</button>
              </div>
            )}
          </div>
          <motion.button
            onClick={() => scrollToSection('sacraments')}
            whileHover={{ scale: 1.05 }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              position: 'relative',
              '@media (max-width: 768px)': {
                width: '100%',
                textAlign: 'center',
                padding: '1rem',
                borderBottom: '1px solid #edf2f7',
                fontSize: '1.1rem'
              }
            }}
          >
            Sacraments
          </motion.button>
          <motion.button
            onClick={() => navigate('/get-involved')}
            whileHover={{ scale: 1.05 }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              position: 'relative',
              '@media (max-width: 768px)': {
                width: '100%',
                textAlign: 'center',
                padding: '1rem',
                borderBottom: '1px solid #edf2f7',
                fontSize: '1.1rem'
              }
            }}
          >
            Get Involved
          </motion.button>
          <div
            className="nav-item"
            onMouseEnter={() => setIsEventsHovered(true)}
            onMouseLeave={() => setIsEventsHovered(false)}
            style={{ position: 'relative' }}
          >
            <motion.button
              onClick={() => scrollToSection('events')}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                position: 'relative',
                '@media (max-width: 768px)': {
                  width: '100%',
                  textAlign: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #edf2f7',
                  fontSize: '1.1rem'
                }
              }}
            >
              Events & News
            </motion.button>
            {isEventsHovered && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/calendar')}>Calendar</button>
                <button onClick={() => scrollToSection('news')}>News</button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span className="nav-toggle-icon">{isMenuOpen ? '✕' : '☰'}</span>
        </button>
      </nav>
    </header>
  )
}

export default Header