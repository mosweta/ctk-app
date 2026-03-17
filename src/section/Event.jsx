import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Event.css';
import { FiCalendar, FiClock, FiMapPin, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { event } from '../export.js';

const Event = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef(null);
  
  // Group events by month for better organization
  const groupedEvents = event.reduce((acc, curr) => {
    const month = curr.date.split(' ')[0]; // Assuming date format like "Dec 24"
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(curr);
    return acc;
  }, {});

  // Featured event (first one)
  const featuredEvent = event[0];

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && event.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % event.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, event.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % event.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + event.length) % event.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.section
      className="events-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
    >
      <div className="events-container">
        {/* Header - Matching other sections */}
        <motion.div className="section-header" variants={fadeInUp}>
          
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">
            Join us in fellowship and celebration
          </p>
        </motion.div>

        {/* Featured Event - Mobile/Tablet */}
        <motion.div className="featured-event" variants={fadeInUp}>
          <div className="featured-content">
            <span className="featured-label">🌟 Featured Event</span>
            <h2>{featuredEvent.name}</h2>
            <h3>{featuredEvent.about}</h3>
            <div className="featured-details">
              <span><FiCalendar /> {featuredEvent.date}</span>
              <span><FiClock /> {featuredEvent.time || "9:00 AM"}</span>
              <span><FiMapPin /> {featuredEvent.location || "Main Church"}</span>
            </div>
            <p className="featured-description">
              Join us for this special celebration. All are welcome to attend and participate in this blessed occasion.
            </p>
            <button className="featured-btn">
              Learn More <FiArrowRight />
            </button>
          </div>
          <div className="featured-image">
            <img src={featuredEvent.src} alt={featuredEvent.about} />
            <div className="image-overlay"></div>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <motion.div className="carousel-section" variants={fadeInUp}>
          <div className="carousel-header">
            <h3>All Upcoming Events</h3>
            <div className="carousel-controls">
              <button 
                className="carousel-btn" 
                onClick={prevSlide}
                aria-label="Previous event"
              >
                <FiChevronLeft />
              </button>
              <button 
                className="carousel-btn" 
                onClick={nextSlide}
                aria-label="Next event"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div className="carousel-container" ref={sliderRef}>
            <motion.div 
              className="carousel-track"
              animate={{ x: `-${currentSlide * 320}px` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {event.map((item, index) => (
                <motion.div
                  key={index}
                  className={`carousel-item ${currentSlide === index ? 'active' : ''}`}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="event-card">
                    <div className="event-card-image">
                      <img src={item.src} alt={item.about} />
                      <span className="event-date-badge">
                        <FiCalendar />
                        {item.date}
                      </span>
                    </div>
                    <div className="event-card-content">
                      <h4>{item.about}</h4>
                      <p className="event-time">
                        <FiClock /> {item.time || "7:00 PM"}
                      </p>
                      <p className="event-location">
                        <FiMapPin /> {item.location || "Christ the King Church"}
                      </p>
                      <button className="event-card-btn">
                        Details
                      </button>
                    </div>
                    {hoveredIndex === index && (
                      <motion.div 
                        className="event-hover-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span>Click for more info</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {event.map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to event ${index + 1}`}
              >
                <span className="indicator-line"></span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Monthly Events Grid */}
        <motion.div className="monthly-grid" variants={fadeInUp}>
          {Object.entries(groupedEvents).map(([month, events]) => (
            <div key={month} className="month-group">
              <h3 className="month-title">{month}</h3>
              <div className="month-events">
                {events.map((event, index) => (
                  <motion.div 
                    key={index} 
                    className="month-event-item"
                    whileHover={{ x: 5 }}
                  >
                    <div className="event-dot"></div>
                    <div className="event-details">
                      <span className="event-date">{event.name}</span>
                      <span className="event-date">{event.date}</span>
                      <span className="event-name">{event.about}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        
        
      </div>
    </motion.section>
  );
};

export default Event;