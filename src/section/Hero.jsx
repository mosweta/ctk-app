import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';
import { FiChevronLeft, FiChevronRight, FiPlay, FiCalendar } from 'react-icons/fi';

// Import your images
import heroImage1 from '../assets/church5.jpg';
import heroImage2 from '../assets/bishops.jpg';
import heroImage3 from '../assets/cma.jpg';
import heroImage4 from '../assets/Groto.jpg';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Slide data
  const slides = [
    {
      id: 1,
      image: heroImage1,
      title: "Welcome to Christ the King",
      subtitle: "A Eucharistic Community",
      description: "A community striving for holiness through a rich sacramental life and serving God in our daily lives.",
      ctaPrimary: { text: "Join Us This Sunday", link: "/liturgy/mass-times" },
      ctaSecondary: { text: "About Us", link: "/about/history" }
    },
    {
      id: 2,
      image: heroImage2,
      title: "Experience God's Presence",
      subtitle: "Daily Mass & Adoration",
      description: "Deepen your faith through daily Eucharist, confession, and perpetual adoration.",
      ctaPrimary: { text: "Mass Schedule", link: "/liturgy/mass-times" },
      ctaSecondary: { text: "Adoration Times", link: "/liturgy/adoration" }
    },
    {
      id: 3,
      image: heroImage3,
      title: "Growing Together in Faith",
      subtitle: "Community & Fellowship",
      description: "Join our vibrant community with programs for children, youth, and adults.",
      ctaPrimary: { text: "Our Ministries", link: "/ministry/readmore" },
      ctaSecondary: { text: "Get Involved", link: "/get-involved" }
    },
    {
      id: 4,
      image: heroImage4,
      title: "Prepare Your Heart",
      subtitle: "Season of Lent",
      description: "Join us for special Lenten services, confessions, and Easter celebrations.",
      ctaPrimary: { text: "Announcements", link: "/events/announcements" },
      ctaSecondary: { text: "Confession Times", link: "/liturgy/confession" }
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // Navigation functions
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

  return (
    <section id="hero" className="hero-section" aria-label="Hero section">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="hero-background"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title}
            className="hero-image"
          />
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
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Subtitle */}
          <motion.span 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {slides[currentSlide].subtitle}
          </motion.span>

          {/* Title */}
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {slides[currentSlide].title}
          </motion.h1>

          {/* Description */}
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {slides[currentSlide].description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <a href={slides[currentSlide].ctaPrimary.link} className="btn btn-primary">
              <FiCalendar className="btn-icon" />
              {slides[currentSlide].ctaPrimary.text}
            </a>
            <a href={slides[currentSlide].ctaSecondary.link} className="btn btn-secondary">
              <FiPlay className="btn-icon" />
              {slides[currentSlide].ctaSecondary.text}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
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