import React from 'react';
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
            // Added slight layout fix for multiline lists
            style={{ alignItems: 'flex-start' }} 
          >
            <div className="home-time-day" style={{ minWidth: '140px', paddingTop: '4px' }}>
              <FiCalendar className="home-time-icon-small" />
              <span>{time.day}</span>
            </div>
            <div className="home-time-schedule" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {time.time.split(',').map((t, i) => (
                <span key={i} className="home-time-badge" style={{ display: 'block', width: '100%' }}>
                  {t.trim()}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ChurchTime = ({ showOnly }) => {
  const [activeTab, setActiveTab] = React.useState(showOnly || 'mass');
  
  const times = {
    mass: [
      { 
        day: 'Sunday (CTK)', 
        time: '1st: 7:00 AM - 9:00 AM, 2nd: 9:00 AM - 11:00 AM, 3rd: 11:00 AM - 1:00 PM, 4th: 1:00 PM - 3:00 PM' 
      },
      { 
        day: 'Sunday (SJTE)', 
        time: '1st: 8:00 AM - 10:00 AM, 2nd: 10:00 AM - 12:00 PM' 
      },
      { 
        day: 'Monday - Saturday', 
        time: '7:00 AM (CTK)' 
      }
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

        <motion.div 
          className="home-time-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
        </motion.div>
      </div>
    </section>
  );
};

export default ChurchTime;