// src/section/Hero.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';
import { FiChevronLeft, FiChevronRight, FiPlay, FiCalendar } from 'react-icons/fi';

// Import all your image variants
// Church Images
import churchDesktop from '../assets/church.jpg';
import churchTablet from '../assets/church.jpg';
import churchMobileLandscape from '../assets/church.jpg';
import churchMobilePortrait from '../assets/churchP.png';

// Bishops Images
import bishopsDesktop from '../assets/churchL.png';
import bishopsTablet from '../assets/churchL.png';
import bishopsMobileLandscape from '../assets/bishops.jpg';
import bishopsMobilePortrait from '../assets/churchE.jpeg';

// CMA Images
import cmaDesktop from '../assets/cma.jpg';
import cmaTablet from '../assets/cma.jpg';
import cmaMobileLandscape from '../assets/cma.jpg';
import cmaMobilePortrait from '../assets/cmaP.png';

// Groto Images
import grotoDesktop from '../assets/Groto.jpg';
import grotoTablet from '../assets/Groto.jpg';
import grotoMobileLandscape from '../assets/Groto.jpg';
import grotoMobilePortrait from '../assets/Groto.jpg';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [deviceType, setDeviceType] = useState('desktop');
  const [orientation, setOrientation] = useState('landscape');

  // Detect device type and orientation
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;
      
      // Determine device type
      if (width <= 640) {
        setDeviceType('mobile');
      } else if (width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
      
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    };
    
    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);
    
    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  // Get the appropriate image for current device and orientation
  const getImageForDevice = (images) => {
    // Mobile Portrait (most common on phones)
    if (deviceType === 'mobile' && orientation === 'portrait') {
      return images.mobilePortrait || images.mobileLandscape || images.tablet || images.desktop;
    }
    
    // Mobile Landscape
    if (deviceType === 'mobile' && orientation === 'landscape') {
      return images.mobileLandscape || images.tablet || images.desktop;
    }
    
    // Tablet
    if (deviceType === 'tablet') {
      return images.tablet || images.desktop;
    }
    
    // Desktop
    return images.desktop;
  };

  // Slide data with all image variants
  const slides = [
    {
      id: 1,
      title: "Welcome to Christ the King",
      subtitle: "A Eucharistic Community",
      description: "A community striving for holiness through a rich sacramental life and serving God in our daily lives.",
      ctaPrimary: { text: "Join Us This Sunday", link: "/mass-times" },
      ctaSecondary: { text: "About Us", link: "/history" },
      images: {
        desktop: churchDesktop,
        tablet: churchTablet,
        mobileLandscape: churchMobileLandscape,
        mobilePortrait: churchMobilePortrait
      }
    },
    {
      id: 2,
      title: "Experience God's Presence",
      subtitle: "Daily Mass & Adoration",
      description: deviceType === 'mobile' 
        ? "Deepen your faith through daily Eucharist and confession." 
        : "Deepen your faith through daily Eucharist, confession, and perpetual adoration.",
      ctaPrimary: { text: "Mass Schedule", link: "/mass-times" },
      ctaSecondary: { text: "Adoration Times", link: "/adoration" },
      images: {
        desktop: bishopsDesktop,
        tablet: bishopsTablet,
        mobileLandscape: bishopsMobileLandscape,
        mobilePortrait: bishopsMobilePortrait
      }
    },
    {
      id: 3,
      title: "Growing Together in Faith",
      subtitle: "Community & Fellowship",
      description: deviceType === 'mobile' 
        ? "Join our vibrant community with programs for all ages." 
        : "Join our vibrant community with programs for children, youth, and adults.",
      ctaPrimary: { text: "Our Ministries", link: "/readmore" },
      ctaSecondary: { text: "Get Involved", link: "/get-involved" },
      images: {
        desktop: cmaDesktop,
        tablet: cmaTablet,
        mobileLandscape: cmaMobileLandscape,
        mobilePortrait: cmaMobilePortrait
      }
    },
    {
      id: 4,
      title: "Prepare Your Heart",
      subtitle: "Season of Lent",
      description: deviceType === 'mobile' 
        ? "Join us for special Lenten services and confessions." 
        : "Join us for special Lenten services, confessions, and Easter celebrations.",
      ctaPrimary: { text: "Announcements", link: "/announcements" },
      ctaSecondary: { text: "Confession Times", link: "/confession" },
      images: {
        desktop: grotoDesktop,
        tablet: grotoTablet,
        mobileLandscape: grotoMobileLandscape,
        mobilePortrait: grotoMobilePortrait
      }
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];
  const currentImage = getImageForDevice(currentSlideData.images);

  return (
    <section id="hero" className="hero-section" aria-label="Hero section">
      {/* Background Slider with Responsive Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="hero-background"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Method 1: Using Picture Element (Recommended) */}
          <picture>
            {/* Mobile Portrait (2:3 ratio) */}
            <source 
              media="(max-width: 640px) and (orientation: portrait)"
              srcSet={currentSlideData.images.mobilePortrait}
            />
            {/* Mobile Landscape (16:9 ratio) */}
            <source 
              media="(max-width: 640px) and (orientation: landscape)"
              srcSet={currentSlideData.images.mobileLandscape}
            />
            {/* Tablet (16:9 ratio) */}
            <source 
              media="(max-width: 1024px)"
              srcSet={currentSlideData.images.tablet}
            />
            {/* Desktop (16:9 ratio) */}
            <img 
              src={currentSlideData.images.desktop}
              alt={currentSlideData.title}
              className="hero-image"
            />
          </picture>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="hero-content-wrapper">
        <motion.div
          className="hero-content"
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.span 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {currentSlideData.subtitle}
          </motion.span>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {currentSlideData.title}
          </motion.h1>

          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {currentSlideData.description}
          </motion.p>

          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <a href={currentSlideData.ctaPrimary.link} className="btn btn-primary">
              <FiCalendar className="btn-icon" />
              {currentSlideData.ctaPrimary.text}
            </a>
            <a href={currentSlideData.ctaSecondary.link} className="btn btn-secondary">
              <FiPlay className="btn-icon" />
              {currentSlideData.ctaSecondary.text}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Arrows - Hide on mobile */}
      <button 
        className="nav-arrow prev" 
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <FiChevronLeft />
      </button>
      <button 
        className="nav-arrow next" 
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <FiChevronRight />
      </button>

      {/* Slide Indicators */}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className="indicator-line"></span>
          </button>
        ))}
      </div>

      {/* Pause/Play Button */}
      <button 
        className="pause-play-btn"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        <span className={`pause-icon ${isAutoPlaying ? '' : 'hidden'}`}>⏸</span>
        <span className={`play-icon ${isAutoPlaying ? 'hidden' : ''}`}>▶</span>
      </button>

      {/* Scroll Indicator */}
      <a href="#mission" className="scroll-indicator">
        <span className="scroll-text">Scroll</span>
        <span className="scroll-line"></span>
      </a>
    </section>
  );
};

export default Hero;