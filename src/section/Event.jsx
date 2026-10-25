import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Event.css';
import { FiCalendar, FiClock, FiMapPin, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useApi } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Event = () => {
  const { data: events, loading, error } = useApi('/events');

  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (events?.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % events.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [events?.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % events.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-[#f8faf8]">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
      </div>
    );
  }

  if (error || !events || events.length === 0) {
    return (
      <div className="text-center py-32 bg-[#f8faf8]">
        <h2 className="text-2xl font-bold text-[#234a33] mb-2">Upcoming Events</h2>
        <p className="text-gray-500">No events are currently scheduled. Please check back later.</p>
      </div>
    );
  }

  const featuredEvent = events[0];

  return (
    <motion.section
      className="events-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUp}
    >
      <div className="events-container">
        <motion.div className="section-header" variants={fadeInUp}>
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Join us in fellowship and celebration</p>
        </motion.div>

        {/* Featured Event */}
        <motion.div className="featured-event" variants={fadeInUp}>
          <div className="featured-content">
            <span className="featured-label">🌟 Featured Event</span>
            <h2>{featuredEvent.title}</h2>
            <h3>{featuredEvent.description?.substring(0, 100)}...</h3>
            <div className="featured-details">
              <span><FiCalendar /> {new Date(featuredEvent.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span><FiClock /> {new Date(featuredEvent.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              <span><FiMapPin /> {featuredEvent.location || "Main Church"}</span>
            </div>
            <p className="featured-description">{featuredEvent.description}</p>
            <Link to="/events" className="featured-btn">
              View All Events <FiArrowRight />
            </Link>
          </div>
          <div className="featured-image">
            {featuredEvent.image_url ? (
              <img src={featuredEvent.image_url} alt={featuredEvent.title} />
            ) : (
              <div className="w-full h-full bg-[#234a33] flex items-center justify-center">
                <FiCalendar className="text-white/20" size={80} />
              </div>
            )}
            <div className="image-overlay"></div>
          </div>
        </motion.div>

        {/* Carousel Section for other events */}
        {events.length > 1 && (
          <motion.div className="carousel-section" variants={fadeInUp}>
            <div className="carousel-header">
              <h3>All Upcoming Events</h3>
              <div className="carousel-controls">
                <button className="carousel-btn" onClick={prevSlide}><FiChevronLeft /></button>
                <button className="carousel-btn" onClick={nextSlide}><FiChevronRight /></button>
              </div>
            </div>

            <div className="carousel-container">
              <motion.div 
                className="carousel-track"
                animate={{ x: `-${currentSlide * 320}px` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {events.map((item, index) => (
                  <div key={index} className="carousel-item">
                    <div className="event-card">
                      <div className="event-card-image">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} />
                        ) : (
                          <div className="w-full h-full bg-[#234a33] flex items-center justify-center">
                            <FiCalendar className="text-white/20" size={40} />
                          </div>
                        )}
                        <span className="event-date-badge">
                          <FiCalendar />
                          {new Date(item.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="event-card-content">
                        <h4>{item.title}</h4>
                        <p className="event-time">
                          <FiClock /> {new Date(item.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="event-location">
                          <FiMapPin /> {item.location || "Christ the King Church"}
                        </p>
                        <Link to="/calendar" className="event-card-btn inline-block text-center">Details</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default Event;