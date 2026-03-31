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
          { title: 'Catholic Men Association (CMA)', desc: "The Catholic Men Association (CMA) is a lay movement committed to forming men of faith who uphold Christian values in family, church, and society. CMA members actively participate in parish life, community service, and spiritual formation programs."},
          
          { title: 'Catholic Women Association (CWA)', desc: 'The Catholic Women Association (CWA) is an association of Catholic lay women mandated to empower Catholic Women spiritually, morally, socially and economically for the purposes of evangelizing families and society at large. The association fosters strong faith, commitment, teamwork, humility, respect, diligence, hard work, and accountability.' },
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
          
        </motion.div>
      </motion.div>
    </motion.main>
  )
}

export default MinistryReadMore
