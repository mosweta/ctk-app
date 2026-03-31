import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChurchTime.css';
import { FiClock, FiCalendar, FiHeart, FiSun } from 'react-icons/fi';
import { Cross } from "lucide-react";

const TimeSection = ({ title, times, icon }) => {
  return (
    <motion.div
      className="home-time-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="home-time-header">
        <span className="home-time-icon">{icon}</span>
        <h3>{title}</h3>
      </div>

      <div className="home-time-list">
        {times.map((time, index) => (
          <motion.div
            key={index}
            className="home-time-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="home-time-day">
              <FiCalendar className="home-time-icon-small" />
              <span>{time.day}</span>
            </div>
            <div className="home-time-schedule">
              {time.time.split(',').map((t, i) => (
                <span key={i} className="home-time-badge">
                  {t.trim()}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Simple note for each section
      <div className="home-time-note">
        {title === "Mass Times" && <span><FiSun /> Sundays at both CTK and St. John Tassia Weekdays at CTK </span>}
        {title === "Confession Times" && <span><Cross /> In CTK </span>}
        {title === "Adoration Times" && <span><FiHeart /> In CTK or St. John Tassia</span>}
      </div> */}
    </motion.div>
  );
};

const ChurchTime = ({ showOnly }) => {
  const [activeTab, setActiveTab] = React.useState(showOnly || 'mass');
  
  const times = {
    mass: [
      { day: 'Sunday', time: '7:00 AM, 9:00 AM, 11:00 AM, 1:00 PM' },
      { day: 'Monday - Friday', time: '7:00 AM' }
    ],
    confession: [
      { day: 'Saturday', time: '4:00 PM - 5:30 PM' }
    ],
    adoration: [
      { day: 'Last Thursday', time: '7:00 PM - 8:30 PM' }
    ]
  };

  const tabs = [
    { key: 'mass', label: 'Mass', icon: <FiClock /> },
    { key: 'confession', label: 'Confession', icon: <Cross /> },
    { key: 'adoration', label: 'Adoration', icon: <FiHeart /> }
  ];

  const sectionIcons = {
    mass: <FiClock />,
    confession: <Cross />,
    adoration: <FiHeart />
  };

  return (
    <section className="home-church-time">
      <div className="home-church-time-container">
        {/* Simple Header - Matching other sections */}
        <motion.div 
          className="home-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          
          <h2 className="home-section-title">Service Times</h2>
          <p className="home-section-subtitle">
            Join us for prayer and worship throughout the week
          </p>
        </motion.div>

        {/* Simple Tabs */}
        <motion.div 
          className="home-time-tabs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`home-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="home-tab-icon">{tab.icon}</span>
              <span className="home-tab-label">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div 
          className="home-time-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'mass' && (
              <TimeSection 
                key="mass" 
                title="Mass Times" 
                times={times.mass} 
                icon={sectionIcons.mass}
              />
            )}
            {activeTab === 'confession' && (
              <TimeSection 
                key="confession" 
                title="Confession Times" 
                times={times.confession} 
                icon={sectionIcons.confession}
              />
            )}
            {activeTab === 'adoration' && (
              <TimeSection 
                key="adoration" 
                title="Adoration Times" 
                times={times.adoration} 
                icon={sectionIcons.adoration}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Simple Footer Link */}
        <motion.div 
          className="home-time-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* <a href="/full-schedule" className="home-time-link">
            View Full Schedule →
          </a> */}
        </motion.div>
      </div>
    </section>
  );
};

export default ChurchTime;