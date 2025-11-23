import React from 'react'
import { motion } from 'framer-motion'
import backgroundImage from '../assets/pxfuel.jpg'
import { slideUpVariants, zoomInVariants } from './animation'

const Hero = () => {
  return (
    <section
      id="hero"
      aria-label="Hero section"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        color: '#dbe8dbef',
      }}
    >
      {/* semi-transparent overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.35)'
        }}
        aria-hidden="true"
      />

      <motion.div
        className="hero-content"
        style={{ zIndex: 2, textAlign: 'center', padding: '3rem' }}
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={zoomInVariants} style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', margin: 0, lineHeight: 1.05 }}>
          Welcome to Christ the King
        </motion.h1>
        <motion.p
          variants={slideUpVariants}
          style={{ marginTop: '1.25rem', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', lineHeight: 1.6 }}
        >
          A community striving for holiness through a rich sacramental life and serving God in our daily lives. We look forward to having you with us.
        </motion.p>
      </motion.div>
    </section>
  )
}

export default Hero