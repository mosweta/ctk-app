import React from 'react'
import { motion } from 'framer-motion'
import './Mission.css'
import fatherImg from '../assets/wallace.jpg' 

const Mission = () => {
  return (
    <motion.section
      className="mission-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mission-inner">
        <div className="mission-media">
          <img src={fatherImg} alt="Father in Charge" />
          <small className="photo-caption">Bishop Wallace Ng'ang'a</small>
        </div>

        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            We exist to share the Gospel and serve our community through worship,
            outreach, and compassionate care. Our mission focuses on spiritual growth,
            practical support, and fostering a welcoming family where everyone can
            encounter the love of Christ.
          </p>
          <p>
            Through ministries, education, and service, we aim to form disciples who
            put faith into action and bring hope to those in need.
          </p>
        </div>
      </div>
    </motion.section>
  )
}

export default Mission
