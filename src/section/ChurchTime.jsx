import React from 'react';
import { motion } from 'framer-motion';

const TimeSection = ({ title, times }) => {
  return (
    <motion.div
      className="time-section"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '1.5rem',
        flex: 1,
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.h3
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ 
          margin: '0 0 1.5rem 0', 
          color: '#2c5282',
          textAlign: 'center',
          fontSize: '1.5rem',
          borderBottom: '2px solid #e6f5e6',
          paddingBottom: '0.75rem',
          fontWeight: 'bold'
        }}
      >{title}</motion.h3>

      <div style={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <ul style={{ 
          listStyle: 'none',
          padding: 0,
          margin: 0,
          color: '#4a5568'
        }}>
          {times.map((time, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              style={{
                padding: '0.75rem 0',
                borderBottom: index !== times.length - 1 ? '1px solid #edf2f7' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                style={{ fontWeight: '600', color: '#2c5282' }}
              >{time.day}</motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
                style={{ fontSize: '0.95rem' }}
              >{time.time}</motion.span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const ChurchTime = ({ showOnly }) => {
  const [activeTab, setActiveTab] = React.useState(showOnly || 'mass');
  const times = {
    mass: [
      { day: 'Sunday', time: '7:00 AM, 09:00 AM, 11:00 AM, 13:00 PM' },
      { day: 'Monday - Friday', time: '7:30 AM' },
      
    ],
    confession: [
      { day: 'Saturday', time: '4:00 PM - 5:30 PM' },
    ],
    adoration: [
      { day: 'Last Thursday ', time: '7:00 PM - 8:30 PM' },
      
    ]
  };

  const tabList = [
    { key: 'mass', label: 'Mass Times' },
    { key: 'confession', label: 'Confession Times' },
    { key: 'adoration', label: 'Adoration Times' }
  ];

  return (
    <section
      id="church-time"
      style={{
        backgroundColor: '#46684d',
        padding: '4rem 1rem',
        color: '#ffffff',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            color: '#ffffff',
            marginBottom: '2rem',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontWeight: 'bold'
          }}
        >
          Mass & Service Times
        </motion.h2>

        {/* Tab headers horizontal */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {tabList.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? '#ffffff' : 'transparent',
                color: activeTab === tab.key ? '#11693e' : '#fff',
                border: 'none',
                borderRadius: '6px 6px 0 0',
                fontWeight: '600',
                fontSize: '1.1rem',
                padding: '0.75rem 2rem',
                boxShadow: activeTab === tab.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s',
                borderBottom: activeTab === tab.key ? '4px solid #11693e' : '4px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}
        >
          {/* Only show the active section */}
          <div>
            {activeTab === 'mass' && (
              <TimeSection title="Mass Times" times={times.mass} />
            )}
            {activeTab === 'confession' && (
              <TimeSection title="Confession Times" times={times.confession} />
            )}
            {activeTab === 'adoration' && (
              <TimeSection title="Adoration Times" times={times.adoration} />
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ChurchTime;
