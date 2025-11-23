import React from 'react'
import { motion } from 'framer-motion'
import Header from '../section/Header'
import Footer from '../section/Footer'
import './Staff.css'

const Staff = () => {
  const staffMembers = [
    {
      title: 'Head Priest',
      name: 'Fr. John Doe',
      description: 'The head priest leads the spiritual guidance and oversees all church activities.',
      image: '../assets/head_priest.jpg' // Placeholder image
    },
    {
      title: 'Priest',
      name: 'Fr. Michael Smith',
      description: 'Assists in conducting masses and providing pastoral care.',
      image: '../assets/priest1.jpg' // Placeholder image
    },
    {
      title: 'Priest',
      name: 'Fr. David Johnson',
      description: 'Focuses on community outreach and youth ministry.',
      image: '../assets/priest2.jpg' // Placeholder image
    },
    {
      title: 'Secretary',
      name: 'Ms. Mary Williams',
      description: 'Manages administrative tasks and coordinates church events.',
      image: '../assets/secretary.jpg' // Placeholder image
    },
    {
      title: 'Catechist',
      name: 'Mr. Robert Brown',
      description: 'Teaches religious education to children and adults.',
      image: '../assets/catechist1.jpg' // Placeholder image
    },
    {
      title: 'Catechist',
      name: 'Mrs. Linda Davis',
      description: 'Supports catechetical programs and sacramental preparation.',
      image: '../assets/catechist2.jpg' // Placeholder image
    },
    {
      title: 'Catechist',
      name: 'Mr. James Wilson',
      description: 'Leads Bible study groups and faith formation sessions.',
      image: '../assets/catechist3.jpg' // Placeholder image
    },
    {
      title: 'Catechist',
      name: 'Mrs. Patricia Taylor',
      description: 'Assists in youth catechesis and community service projects.',
      image: '../assets/catechist4.jpg' // Placeholder image
    },
    {
      title: 'Catechist',
      name: 'Mr. Christopher Anderson',
      description: 'Focuses on adult education and spiritual development.',
      image: '../assets/catechist5.jpg' // Placeholder image
    }
  ]

  return (
    <>
      <Header />
      <main className="staff-main">
        <div className="staff-header">
          <motion.h1
            style={{ color: '#800000', fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Times New Roman, serif', letterSpacing: '2px', position: 'relative', zIndex: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            Our Staff
          </motion.h1>
        </div>
        <div className="staff-container">
          <div className="staff-grid">
            {staffMembers.map((member, index) => (
              <motion.div
                key={index}
                className="staff-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <img src={member.image} alt={member.name} className="staff-image" />
                <h3>{member.title}</h3>
                <h4>{member.name}</h4>
                <p>{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Staff
