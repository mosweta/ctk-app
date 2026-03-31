import React from 'react';
import { motion } from 'framer-motion';
import './Mission.css';
import { Cross, Heart, Users, Anchor, Church } from 'lucide-react';
import Groto from '../assets/Groto.jpg';
// More direct import approach
const Mission = () => {
  const coreValues = [
    { icon: <Users />, value: "Inclusivity", description: "Welcoming all to God's family" },
    { icon: <Heart />, value: "Servant Leadership", description: "Leading through service" },
    { icon: <Cross />, value: "Shared Responsibility", description: "Together in Christ's mission" },
    { icon: <Anchor />, value: "Eucharistic Living", description: "Living in Christ's presence" }
  ];
  

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.section
      className="mission-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="mission-container">
        <motion.div className="mission-header" variants={fadeInUp}>
          
          <h2 className="section-title">Mission & Vision</h2>
          <p className="section-subtitle">Guided by faith, united in love</p>
        </motion.div>

        <div className="mission-grid">
          {/* Image Section */}
          <motion.div 
            className="mission-media-wrapper"
            variants={fadeInUp}
          >
            <div className="image-frame">
              <div className="image-border"></div>
              <img 
                src={Groto} 
                alt="Groto of Our Lady" 
                className="leader-image"
                loading="lazy"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                <h3 className="leader-name">Groto of Our Lady</h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="mission-content">
            {/* Mission Card */}
            <motion.div 
              className="content-card mission-card"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="card-icon-wrapper">
                <Cross className="card-icon" />
              </div>
              <div className="card-content">
                <h3 className="card-title">Our Mission</h3>
                <p className="card-text">
                  To love God and humanity, teaching the Gospel values, spreading joy and showing compassion to all
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              className="content-card vision-card"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="card-icon-wrapper">
                <Anchor className="card-icon" />
              </div>
              <div className="card-content">
                <h3 className="card-title">Our Vision</h3>
                <p className="card-text">
                  A Christ centered parish where faith grows, worship inspires and service transforms lives.
                </p>
              </div>
            </motion.div>

            {/* Core Values */}
            <motion.div className="values-wrapper" variants={fadeInUp}>
              <div className="values-header">
                <Heart className="values-icon" />
                <h3 className="values-title">Core Values</h3>
              </div>
              
              <div className="values-grid">
                {coreValues.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="value-card"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="value-icon">{item.icon}</span>
                    <div className="value-info">
                      <strong className="value-name">{item.value}</strong>
                      <span className="value-description">{item.description}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Mission;