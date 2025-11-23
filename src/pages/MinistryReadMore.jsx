import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import headerBg from '../assets/bg1.jpeg'
import './MinistryReadMore.css'

const MinistryReadMore = () => {
  const navigate = useNavigate()

  return (
    <motion.main 
      className="ministry-readmore"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="readmore-header" 
        style={{ backgroundImage: `url(${headerBg})` }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="header-overlay" />
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h1>More Information</h1>
          <p>
            Our ministries serve various groups and needs in the parish. We provide
            faith formation, outreach programs, and community-building activities.
          </p>
        </motion.div>
      </motion.header>

      <motion.div 
        className="readmore-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {[
          { title: 'CMA', desc: 'Catholic Men Association — fellowship and service for men.' },
          { title: 'CWA', desc: 'Catholic Women Association — fellowship and outreach for women.' },
          { title: 'YCS', desc: 'Youth Catholic Society — formation and activities for young people.' },
          { title: 'PMC', desc: 'Parish Missionary Community — evangelization and community outreach.' }
        ].map((ministry, index) => (
          <motion.section
            key={ministry.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
          >
            <h2>{ministry.title}</h2>
            <p>{ministry.desc}</p>
          </motion.section>
        ))}

        <motion.div 
          className="readmore-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <motion.button 
            className="btn-go" 
            onClick={() => navigate('/ministry/signup')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Sign Up Page
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.main>
  )
}

export default MinistryReadMore
