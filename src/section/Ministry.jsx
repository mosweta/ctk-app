import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Ministry.css'
import background from '../assets/peakpx.jpg'

const Ministry = () => {
  const navigate = useNavigate()

  return (
    <motion.section
      id="ministry"
      className="ministry-section"
      style={{ backgroundImage: `url(${background})` }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="ministry-overlay" aria-hidden="true" />
      <motion.div
        className="ministry-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
      >
        <h2 className="ministry-title">Our Communities</h2>
        <h4 className="ministry-sub">Serving our community through faith and action</h4>
        <div className="ministry-buttons">
          
          <button className="btn outline" onClick={() => navigate('/readmore')}>Read More</button>
        </div>
      </motion.div>
    </motion.section>
  )
}

export default Ministry
