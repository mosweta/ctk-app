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
          { title: 'Young Catholic Adults (YCA)', desc: 'Youth Catholic Adults is a group of youths aged between 27 and 35. They are a bridge between the youths and the CWA and CMA.It consists of married individuals or those with children under 27. It is designed to be relatively independent and self-managed.The YCA helps address challenges facing young people, such as unemployment, modern lifestyle pressures, and the need for spiritual mentorship.' },
          { title: 'Youth Serving Christ (YSC)', desc: 'The Youth Serving Christ is a group of youths aged between 18 and 26. The group aims to deepen faith through prayer, bible study, and worship. Strengthen friendships through fellowship and shared experiences. Serve communities with compassion and outreach projects. Develop leadership by empowering youth in planning and service. Provide mentorship and guidance for life’s spiritual and personal decisions.' },
          { title: 'Missionary Youth Movement (MYM)', desc: 'The Missionary Youth Movement is a group of youths aged between 13 and 17. It normally caters for those in high school. They normally carry out their activities such as annual mass, seminars and workshops etc during school holidays.' },
          { title: 'Pontifical Missionary Childhood (PMC)', desc: 'The Pontifical Missionary Childhood consists of children between ages 4 to 12. Their motto is "Children helping children". They help other children through offering of foodstuffs, cash and clothes to help the orphans and needy children in war torn countries.' },
          { title: 'N.B', desc: 'To join any of these groups, kindly see the catechist or visit the parish office.' }
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
