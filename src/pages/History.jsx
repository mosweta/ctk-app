import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  
  FiBookOpen,
  FiClock
} from 'react-icons/fi';
import {Church} from "lucide-react";

import './history.css';

// Import images (you'll need to add these to your assets folder)
import ctkMainImg from '../assets/church.jpg';
import ctkSideImg from '../assets/church2.jpg';
import ctkMassImg from '../assets/bishops.jpg';
import groto from '../assets/Groto.jpg';
import sjtePlaceholderImg from '../assets/history/Sjte.jpeg';

const History = () => {
  const [activeTab, setActiveTab] = useState('ctk'); // 'ctk' or 'sjte'
  const [ctkCurrentSlide, setCtkCurrentSlide] = useState(0);
  const [sjteCurrentSlide, setSjTeCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // CTK History Timeline Data
  const ctkHistory = {
    title: "Christ the King Embakasi",
    subtitle: "A Journey of Faith Since 1974",
    location: "Embakasi East Constituency, Nairobi",
    established: "1997 (Declared a Parish)",
    description: "Christ the King Embakasi is a parish located at the heart of Embakasi East Constituency. It is one of the six parishes in St. Rita Embakasi Deanery under the archdiocese of Nairobi. It has one outstation called St. John the Evangelist Catholic Church in Tassia.",
    images: [
      { src: ctkMainImg, alt: "Christ the King Church", caption: "Present Day Christ the King Church" },
      { src: ctkSideImg, alt: "Side View", caption: "Another View of the Church" },
      { src: ctkMassImg, alt: "Sunday Mass", caption: "Sunday Mass Celebration" },
      { src: groto, alt: "Groto of our lady", caption: "Groto of our lady" }
    ],
    timeline: [
      {
        year: "Before 1970",
        title: "Early Beginnings",
        description: "No Catholic church in Embakasi area. Masses were held at Edelvale Sister's home near Kayole.",
        details: "Priests from Our Lady of Visitation Makadara offered the first Mass at Mabatini near the army Barracks, then later at Embakasi Primary and Embakasi Social Hall."
      },
      {
        year: "1974",
        title: "Part of Kariobangi Parish",
        description: "Makadara Parish was divided and Embakasi outstation became part of Kariobangi Parish.",
        details: "Comboni missionaries were responsible for overseeing the parish. Fr Romeo became the first priest with special responsibility for Embakasi."
      },
      {
        year: "1976",
        title: "Land Purchase",
        description: "Two harambees were held to raise funds to purchase a plot to put up a church.",
        details: "The plot was purchased and acquired - this is where Christ the King Catholic Parish currently stands."
      },
      {
        year: "1981",
        title: "Part of Umoja Parish",
        description: "Kariobangi Parish was divided and Embakasi outstation became part of the new Umoja Parish.",
        details: "Maryknoll Fathers took over, with Fr. Robert Jalbert overseeing the second phase of building the Church."
      },
      {
        year: "1997",
        title: "Official Parish Status",
        description: "Embakasi outstation was officially declared a parish named Christ the King Catholic Church.",
        details: "Archbishop Ndingi Mwana a'Nzeki declared it a parish. St. Patrick's Missionary Society was mandated to run the parish with Fr. Edward Lalor as Father in charge."
      },
      {
        year: "2002-2012",
        title: "Fr. John Joe Era",
        description: "Fr John Joe took over as Parish Priest and served until 2012.",
        details: "Major milestones during this period included: Establishment of schools (kindergarten, parochial, tailoring, computer, and special school), Birth of Holy Family Utawala Parish, Creation of St. Bakhita Dispensary, Establishment of St. Christopher S.C.C at the airport, Implementation of child safeguarding policy."
      },
      {
        year: "2012-2015",
        title: "Transition Period",
        description: "Fr Victor Dunne (2012-2014) and Fr Vitalis Iyang (2014-2015) led the parish.",
        details: "This marked eighteen years of Christ the King being run by Missionaries before the transition to diocesan priests."
      },
      {
        year: "2015",
        title: "Bishop Wallace Era Begins",
        description: "Bishop Wallace Ng'ang'a was appointed parish priest after the missionaries left.",
        details: "Fr Joseph Kariuki served as Assistant Parish Priest. They laid out a strategic pastoral plan guided by the three pillars of AMECEA: self-sustaining, self-propagating, and self-ministering."
      },
      {
        year: "2017-2018",
        title: "Establishment of SJTE Outstation",
        description: "Need arose to establish an outstation in Tassia Baraka Estate.",
        details: "Bishop Wallace mobilized Christians to raise funds. A piece of land was purchased through a loan, and a harambee helped offset it. A tent was erected, and operations started, serving about 600 Christians."
      },
      {
        year: "2023-2025",
        title: "Growth and Development",
        description: "Fr. Ignatius Njue took over as Parish Priest with Fr. Silferius Aluodo as Assistant.",
        details: "They oversaw the growth and development, including building of an ultra-modern priests' house, drilling of a borehole, cabro works, and garden work around the church."
      },
      {
        year: "2025-present",
        title: "Current Leadership",
        description: "Fr. Sammy Mungai took over as Parish Priest with Fr. Silferius Aluodo and Fr. John Mwangi as Assistants.",
        details: "They are currently overseeing the completion of the five year strategic plan, ultra-modern school building as well as the purchase of pieces of land in Tassia for the outstation St. John the Evangelist."
      }
      
    ],
    milestones: [
      { year: "1976", achievement: "Plot purchased for church construction" },
      { year: "1997", achievement: "Declared an official parish" },
      { year: "2002-2012", achievement: "Schools established & Utawala outstation born" },
      { year: "2015", achievement: "Diocesan priests take over leadership" },
      { year: "2017", achievement: "SJTE outstation established in Tassia" },
      { year: "2023", achievement: "New leadership & infrastructure development" }
    ],
    priests: [
      { name: "Fr Romeo", period: "1974-1981", role: "First priest with special responsibility for Embakasi" },
      { name: "Fr Robert Jalbert", period: "1981-1997", role: "Oversaw second phase of church construction" },
      { name: "Fr Edward Lalor", period: "1997-?", role: "First parish priest after declaration" },
      { name: "Fr Noel Connolly", period: "?", role: "Succeeded Fr Edward Lalor" },
      { name: "Fr John Joe", period: "2002-2012", role: "Established schools and Utawala outstation" },
      { name: "Fr Victor Dunne", period: "2012-2014", role: "Parish Priest" },
      { name: "Fr Vitalis Iyang", period: "2014-2015", role: "Parish Priest" },
      { name: "Bishop Wallace Ng'ang'a", period: "2015-2023", role: "First diocesan parish priest" },
      { name: "Fr Joseph Kariuki", period: "2015-2023", role: "Assistant Parish Priest" },
      { name: "Fr Ignatius Njue", period: "2023-2025", role: "Parish Priest" },
      { name: "Fr Sammy Mungai", period: "2025-present", role: "Current Parish Priest" },
      { name: "Fr Silferius Aluodo", period: "2023-Present", role: "Current Assistant Parish Priest" },
      { name: "Fr John Mwangi", period: "2024-Present", role: "Current Assistant Parish Priest" }
    ]
  };

  // SJTE Coming Soon Data
  const sjteHistory = {
    title: "St. John the Evangelist (SJTE)",
    subtitle: "Coming Soon",
    location: "Tassia, Nairobi",
    established: "2017 (Outstation Established)",
    description: "St. John the Evangelist Catholic Church in Tassia is an outstation of Christ the King Embakasi Parish. Currently serving about 600 Christians with two masses held on Sundays at 8:00 AM and 10:00 AM.",
    images: [
      { src: sjtePlaceholderImg, alt: "SJTE Church", caption: "St. John the Evangelist Church" },
    //   { src: sjtePlaceholderImg, alt: "SJTE Community", caption: "Growing Faith Community" },
    //   { src: sjtePlaceholderImg, alt: "SJTE Mass", caption: "Weekly Mass Celebrations" }
    ],
    timeline: [
      {
        year: "Coming Soon",
        title: "Full History Coming Soon",
        description: "Detailed history of St. John the Evangelist Catholic Church will be available shortly.",
        details: "We are currently documenting the rich history of our Tassia outstation. Check back soon for updates!"
      }
    ],
    milestones: [
      { year: "2017", achievement: "Land purchased for the outstation" },
      { year: "2018", achievement: "Tent erected and operations started" },
      { year: "2024", achievement: "Growing community of 600+ Christians" }
    ],
    priests: [
      { name: "Bishop Wallace Ng'ang'a", period: "2017-2023", role: "Oversaw establishment of outstation" },
      { name: "Fr Ignatius Njue", period: "2023-2025", role: "Succeeded Bishop Wallace Ng'ang'a and started the purchase of land" },
      { name: "Fr Sammy Mungai", period: "2025-Present", role: "Current oversight" },
      { name: "Fr Silferius Aluodo", period: "2023-Present", role: "Assistant oversight" },
      { name: "Fr John Mwangi", period: "2024-Present", role: "Assistant oversight" }
    ]
  };

  const currentData = activeTab === 'ctk' ? ctkHistory : sjteHistory;
  const currentImages = currentData.images;
  const currentSlide = activeTab === 'ctk' ? ctkCurrentSlide : sjteCurrentSlide;
  const setCurrentSlide = activeTab === 'ctk' ? setCtkCurrentSlide : setSjTeCurrentSlide;

  // Navigation functions
  const nextSlide = () => {
    if (isAnimating) return;
    setDirection(1);
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % currentImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection(-1);
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    
      <main className="history-page">
        {/* Tab Buttons */}
        <div className="history-tabs">
          <button 
            className={`tab-btn ${activeTab === 'ctk' ? 'active' : ''}`}
            onClick={() => setActiveTab('ctk')}
          >
            <Church />
            <span>Christ the King</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sjte' ? 'active' : ''} coming-soon`}
            onClick={() => setActiveTab('sjte')}
          >
            <FiBookOpen />
            <span>St. John the Evangelist</span>
            {activeTab === 'sjte' && <span className="coming-soon-badge">Coming Soon</span>}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="history-content"
          >
            {/* Hero Section with Image Slider */}
            <div className="hero-slider-section">
              <div className="slider-container">
                <div className="slider-wrapper">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.img
                      key={currentSlide}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      src={currentImages[currentSlide].src}
                      alt={currentImages[currentSlide].alt}
                      className="slider-image"
                    />
                  </AnimatePresence>
                  
                  {/* Slider Caption */}
                  <div className="slider-caption">
                    <p>{currentImages[currentSlide].caption}</p>
                  </div>
                  
                  {/* Slider Navigation */}
                  <button className="slider-nav prev" onClick={prevSlide}>
                    <FiChevronLeft />
                  </button>
                  <button className="slider-nav next" onClick={nextSlide}>
                    <FiChevronRight />
                  </button>
                  
                  {/* Slider Dots */}
                  <div className="slider-dots">
                    {currentImages.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* History Content */}
            <div className="history-info">
              <div className="info-header">
                <h1>{currentData.title}</h1>
                <p className="subtitle">{currentData.subtitle}</p>
                <div className="quick-facts">
                  <span><FiMapPin /> {currentData.location}</span>
                  <span><FiCalendar /> Established: {currentData.established}</span>
                </div>
              </div>

              <div className="description-section">
                <p>{currentData.description}</p>
              </div>

              {activeTab === 'ctk' && (
                <>
                  {/* Timeline Section */}
                  <div className="timeline-section">
                    <h2>
                      <FiClock className="section-icon" />
                      Historical Timeline
                    </h2>
                    <div className="timeline">
                      {currentData.timeline.map((item, index) => (
                        <motion.div 
                          key={index} 
                          className="timeline-item"
                          variants={fadeInUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.3 }}
                        >
                          <div className="timeline-year">{item.year}</div>
                          <div className="timeline-content">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <div className="timeline-details">
                              {item.details}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones Section */}
                  <div className="milestones-section">
                    <h2>Key Milestones</h2>
                    <div className="milestones-grid">
                      {currentData.milestones.map((milestone, index) => (
                        <motion.div 
                          key={index} 
                          className="milestone-card"
                          variants={fadeInUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="milestone-year">{milestone.year}</div>
                          <div className="milestone-text">{milestone.achievement}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Priests Section */}
                  <div className="priests-section">
                    <h2>
                      <FiUsers className="section-icon" />
                      Parish Priests Through the Years
                    </h2>
                    <div className="priests-grid">
                      {currentData.priests.map((priest, index) => (
                        <motion.div 
                          key={index} 
                          className="priest-card"
                          variants={fadeInUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="priest-name">{priest.name}</div>
                          <div className="priest-period">{priest.period}</div>
                          <div className="priest-role">{priest.role}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'sjte' && (
                <div className="coming-soon-section">
                  <div className="coming-soon-card">
                    <FiBookOpen className="coming-soon-icon" />
                    <h2>History Coming Soon</h2>
                    <p>We are currently documenting the rich history of St. John the Evangelist Catholic Church in Tassia.</p>
                    <div className="coming-soon-info">
                      <div className="info-block">
                        <FiCalendar />
                        <span>Established: 2017</span>
                      </div>
                      <div className="info-block">
                        <FiUsers />
                        <span>500+ Christians</span>
                      </div>
                      <div className="info-block">
                        <Church />
                        <span>2 Masses Sundays</span>
                        <span>8:00 AM & 10:00 AM</span>
                      </div>
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      
   
  );
};

export default History;