import React from 'react'
import { motion } from 'framer-motion'
import { slideUpVariants } from './animation'

const Livestream = () => {
  return (
    <section
      id="livestream"
      className="livestream-section"
      style={{
        backgroundColor: '#e6f5e6', // pale green background
        padding: '4rem 0',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '2rem',
          padding: '0 1rem',
        }}
      >
        {/* Details Section - 50% */}
        <motion.div
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            flex: 1,
            padding: '2rem',
          }}
        >
          <h1 style={{ marginBottom: '1.5rem', color: '#800000' }}>Join Our Livestream</h1>
          <p style={{ marginBottom: '1rem', color: ' #234a33' }}>
            Experience our services from anywhere in the world. Join our community virtually
            for live masses, special events, and spiritual gatherings.
          </p>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            color: '#234a33',
            marginTop: '2rem'
          }}>
            <li style={{ marginBottom: '1rem' }}>📅 Sunday Mass: From 7:00 AM</li>
            <li style={{ marginBottom: '1rem' }}>🕊️ Daily Prayer: 8:00 AM </li>
            <li style={{ marginBottom: '1rem' }}>✨ Special Events: Check Schedule</li>
          </ul>
        </motion.div>

        {/* Video Section - 50% */}
        <motion.div
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 aspect ratio
            width: '100%',
            backgroundColor: '#f8f9fa'
          }}>
            {/* Placeholder for livestream - replace src with actual stream URL */}
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL"
              title="CTK Livestream"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Livestream