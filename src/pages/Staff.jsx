import React from 'react'
import { motion } from 'framer-motion'
import Header from '../section/Header'
import Footer from '../section/Footer'
import './Staff.css'

// Import your images (adjust the paths based on your actual file structure)
import headPriest from '../assets/priest1.jpg'
import priest1 from '../assets/priest2.jpg'
import priest2 from '../assets/priest3.png'
import secretary from '../assets/secretary.jpg'
import catechist1 from '../assets/catechistm.png'
import catechist2 from '../assets/catechistf.png'
import bgImage from '../assets/bg1.jpeg'

const Staff = () => {
  const staffMembers = [
    {
      title: 'Head Priest',
      name: 'Fr. John Doe',
      description: 'The head priest leads the spiritual guidance and oversees all church activities.',
      image: headPriest
    },
    {
      title: 'Priest',
      name: 'Fr. Michael Smith',
      description: 'Assists in conducting masses and providing pastoral care.',
      image: priest1
    },
    {
      title: 'Priest',
      name: 'Fr. David Johnson',
      description: 'Focuses on community outreach and youth ministry.',
      image: priest2
    },
    {
      title: 'Secretary',
      name: 'Ms. Mary Williams',
      description: 'Manages administrative tasks and coordinates church events.',
      image: secretary
    },
    {
      title: 'Catechist',
      name: 'Mr. Robert Brown',
      description: 'Teaches religious education to children and adults.',
      image: catechist1
    },
    {
      title: 'Catechist',
      name: 'Mrs. Linda Davis',
      description: 'Supports catechetical programs and sacramental preparation.',
      image: catechist2
    },
    
  ]

  return (
    <>
      <Header />
      <main className="staff-main">
        <div className="staff-header" style={{ backgroundImage: `url(${bgImage})` }}>
          <motion.h1
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
                <div className="staff-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="staff-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                </div>
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