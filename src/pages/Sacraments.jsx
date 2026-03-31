import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiDroplet,  
  FiHeart, 
  FiCheckCircle, 
  FiSun, 
  FiBookOpen, 
  FiUsers,
  FiCalendar,
  FiClock,
  FiMail,
  FiMapPin
} from 'react-icons/fi';
import {Cross} from 'lucide-react'

import './Sacraments.css';

// Import images (you'll need to add these images to your assets folder)
import baptismImg from '../assets/Sacraments/baptism.jpg';
import eucharistImg from '../assets/Sacraments/eucharist.jpg';
import confirmationImg from '../assets/Sacraments/confirmation.jpg';
import confessionImg from '../assets/Sacraments/confession.jpg';
import anointingImg from '../assets/Sacraments/anointing.jpg';
import holyOrdersImg from '../assets/Sacraments/holy-orders.jpg';
import matrimonyImg from '../assets/Sacraments/matrimony.jpg';

const Sacraments = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const sacraments = [
    {
      id: 1,
      title: "Baptism",
      subtitle: "The Door to Christian Life",
      icon: <FiDroplet />,
      image: baptismImg,
      about: "Baptism is the first sacrament of initiation, cleansing us from original sin and making us children of God. Through water and the Holy Spirit, we are born into new life in Christ. Baptism incorporates us into the Church, the body of Christ, and marks us with an indelible spiritual seal.",
      meaning: "The word 'Baptism' comes from the Greek 'baptizein' meaning 'to plunge' or 'immerse'. In baptism, we are plunged into the death and resurrection of Christ, dying to sin and rising to new life. This sacrament is necessary for salvation and is the foundation of the entire Christian life.",
      howTo: [
        "Contact the parish office at least 3 months in advance",
        "Attend pre-baptism preparation classes",
        "Choose godparents who are practicing Catholics",
        "Present the child's birth certificate",
        "Schedule the baptism date with the priest"
      ],
      requirements: [
        "At least one parent must be a practicing Catholic",
        "Godparents must be confirmed Catholics over 16",
        "Pre-baptism course completion certificate",
        "Child's birth certificate",
        "Letter of consent from the parish of residence"
      ],
      contact: "Parish Office - 020 2495785",
      schedule: "Easter Vigil or when announced",
      location: "Main Church",
      preparationTime: "3 months",
      color: "#4a90e2"
    },
    {
      id: 2,
      title: "Holy Eucharist",
      subtitle: "Source and Summit of Christian Life",
      icon: <Cross />,
      image: eucharistImg,
      about: "The Holy Eucharist is the sacrament in which Jesus Christ gives His Body and Blood under the forms of bread and wine. It is the source and summit of the Christian life, where we receive Christ Himself. In the Mass, we participate in Christ's sacrifice and are united with Him and the Church.",
      meaning: "The Eucharist completes Christian initiation. Those who have been raised to the dignity of the royal priesthood by Baptism and configured more deeply to Christ by Confirmation participate with the whole community in the Lord's own sacrifice by means of the Eucharist.",
      howTo: [
        "Complete First Holy Communion preparation classes",
        "Be properly disposed (free from serious sin)",
        "Fast for one hour before receiving Communion",
        "Make a proper sign of reverence before receiving",
        "Receive worthily and regularly"
      ],
      requirements: [
        "Baptism certificate",
        "First Communion preparation course",
        "Age 7 or older",
        "Regular Mass attendance",
        "Proper understanding of the Eucharist"
      ],
      contact: "Parish Office - 020 2495785",
      schedule: "Daily: 7:00 AM | Sunday: 7:00 AM, 9:00 AM, 11:00 AM, 1:00 PM",
      location: "Main Church",
      preparationTime: "6 months",
      color: "#e2b83e"
    },
    {
      id: 3,
      title: "Confirmation",
      subtitle: "Sealed with the Gift of the Holy Spirit",
      icon: <FiSun />,
      image: confirmationImg,
      about: "Confirmation perfects Baptismal grace and gives us the Holy Spirit to make us stronger witnesses of Christ. Through the laying on of hands and anointing with chrism, we receive the seven gifts of the Holy Spirit and are strengthened to live out our faith boldly.",
      meaning: "By the sacrament of Confirmation, the baptized are more perfectly bound to the Church and are enriched with a special strength of the Holy Spirit. Hence they are, as true witnesses of Christ, more strictly obliged to spread and defend the faith by word and deed.",
      howTo: [
        "Be at least 14 years of age",
        "Complete Confirmation preparation program",
        "Choose a sponsor (practicing Catholic)",
        "Attend regular classes and retreats",
        "Choose a Confirmation name (saint's name)"
      ],
      requirements: [
        "Baptism certificate",
        "First Communion certificate",
        "Sponsor's letter from their parish",
        "Active participation in parish life",
        "Completion of preparation program"
      ],
      contact: "Parish Office - 020 2495785",
      schedule: "Classes: Saturdays at 3:00 PM",
      location: "Main Church & Parish Hall",
      preparationTime: "1 year",
      color: "#e05a5a"
    },
    {
      id: 4,
      title: "Confession (Reconciliation)",
      subtitle: "The Sacrament of Healing",
      icon: <FiHeart />,
      image: confessionImg,
      about: "Confession is the sacrament of God's mercy, where we receive forgiveness for sins committed after Baptism. Through the priest, Christ absolves us and reconciles us to God and the Church. This sacrament restores us to grace and strengthens us to avoid sin.",
      meaning: "Those who approach the sacrament of Penance obtain pardon from God's mercy for the offense committed against Him, and are, at the same time, reconciled with the Church which they have wounded by their sins and which by charity, example, and prayer labors for their conversion.",
      howTo: [
        "Examine your conscience before confession",
        "Approach the confessional with contrition",
        "Confess your sins honestly to the priest",
        "Accept the penance given by the priest",
        "Receive absolution and pray the Act of Contrition"
      ],
      requirements: [
        "Proper examination of conscience",
        "Sincere sorrow for sins",
        "Firm purpose of amendment",
        "Confession at least once a year (obligatory)",
        "Worthily receive Communion after confession"
      ],
      contact: "Parish Office - 020 2495785",
      schedule: "Saturdays: 4:00 PM - 5:30 PM",
      location: "Confessionals in Church",
      preparationTime: "No preparation needed - just come",
      color: "#6c5ce7"
    },
    {
      id: 5,
      title: "Anointing of the Sick",
      subtitle: "Strength in Illness",
      icon: <FiBookOpen />,
      image: anointingImg,
      about: "The Anointing of the Sick gives spiritual and physical strength to those who are seriously ill or facing surgery. Through the anointing with blessed oil and prayer, Christ comforts and heals the sick person, giving them grace to bear their suffering and forgiveness of sins.",
      meaning: "This sacrament confers a special grace that unites the sick person more closely to Christ's Passion, brings comfort and peace, and gives strength to endure suffering. It also provides forgiveness of sins and, if it is God's will, physical healing.",
      howTo: [
        "Contact the parish office for the priest",
        "The priest will visit the sick person",
        "Family members should prepare a small table with a cross, holy water, and candles",
        "Join in the prayers and responses",
        "Receive Holy Communion if possible"
      ],
      requirements: [
        "Serious illness or advanced age",
        "Before major surgery",
        "Reception while conscious and aware",
        "Can be repeated if condition worsens",
        "Frequent reception not restricted to danger of death"
      ],
      contact: "Parish Office - 020 2495785",
      schedule: "Available anytime for emergencies",
      location: "Home, Hospital, or Church",
      preparationTime: "Call the priest immediately",
      color: "#4ecdc4"
    },
    {
      id: 6,
      title: "Holy Orders",
      subtitle: "Service to God's People",
      icon: <FiUsers />,
      image: holyOrdersImg,
      about: "Holy Orders is the sacrament through which men are ordained as deacons, priests, or bishops. Through this sacrament, they receive the grace to serve the Church as ministers of Christ. Priests act in the person of Christ to celebrate the sacraments and lead the faithful.",
      meaning: "Holy Orders confers an indelible spiritual character and configures the ordained minister to Christ. Through ordination, men are empowered to preach the Gospel, celebrate the liturgy, and shepherd the people of God. It is a sacrament of service and sacrifice.",
      howTo: [
        "Discern your vocation through prayer and spiritual direction",
        "Contact the Vocations Director",
        "Complete application and undergo psychological evaluation",
        "Enter seminary formation (4-7 years)",
        "Receive ordination as deacon, then priest"
      ],
      requirements: [
        "Male, practicing Catholic",
        "Baptized and confirmed",
        "Single or married (for permanent deacon)",
        "Good moral character",
        "Bachelor's degree (for priest)",
        "Call from God and the Church"
      ],
      contact: "Parish Office - 020 2495785",
      schedule: "Wednesday from 8:00 AM to 1:00 PM (Office day)",
      location: "CTK Parish Office(Priest's Office)",
      preparationTime: "7 years of formation",
      color: "#f39c12"
    },
    {
      id: 7,
      title: "Matrimony",
      subtitle: "Covenant of Love",
      icon: <FiCheckCircle />,
      image: matrimonyImg,
      about: "Matrimony is the sacrament that unites a man and woman in a lifelong covenant of love. Through this sacrament, the couple receives grace to love each other as Christ loves the Church. Marriage is a vocation to holiness and the foundation of family life.",
      meaning: "The matrimonial covenant between baptized persons is raised to the dignity of a sacrament. Christ dwells with the married couple, giving them strength to take up their crosses and follow Him. Marriage is ordered to the good of the spouses and the procreation and education of children.",
      howTo: [
        "Contact the parish office 6 months before the wedding",
        "Attend marriage preparation classes",
        "Provide required documents",
        "Choose witnesses (best man and maid of honor)"
      ],
      requirements: [
        "Both parties must be free to marry",
        "At least one party is a baptized Catholic",
        "No previous sacramental marriage",
        "Completion of marriage preparation",
        "Baptism and Confirmation certificates"
      ],
      contact: "Parish Office - 020 2495785",
      schedule: "Sunday classes at 3:00 PM | Weddings by appointment",
      location: "Main Church",
      preparationTime: "6 months minimum",
      color: "#e84393"
    }
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const navigateNext = () => {
    if (isAnimating) return;
    setDirection(1);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % sacraments.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const navigatePrev = () => {
    if (isAnimating) return;
    setDirection(-1);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + sacraments.length) % sacraments.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setIsAnimating(true);
    setCurrentIndex(index);
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

  const currentSacrament = sacraments[currentIndex];

  return (
    
      <main className="sacraments-page">
        <div className="sacraments-container" ref={containerRef}>
          {/* Navigation Arrows */}
          <button 
            className="nav-arrow prev" 
            onClick={navigatePrev}
            aria-label="Previous sacrament"
          >
            <FiChevronLeft />
          </button>
          <button 
            className="nav-arrow next" 
            onClick={navigateNext}
            aria-label="Next sacrament"
          >
            <FiChevronRight />
          </button>

          {/* Progress Indicators */}
          <div className="progress-indicators">
            {sacraments.map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentIndex === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to ${sacraments[index].title}`}
              >
                <span className="indicator-dot"></span>
              </button>
            ))}
          </div>

          {/* Current Sacrament Display */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="sacrament-slide"
            >
              <div className="sacrament-content">
                {/* Image Section - 1/4 width */}
                <div className="sacrament-image-section">
                  <div 
                    className="image-container"
                    style={{ borderBottom: `4px solid ${currentSacrament.color}` }}
                  >
                    <img src={currentSacrament.image} alt={currentSacrament.title} />
                    <div className="image-overlay" style={{ background: `linear-gradient(135deg, ${currentSacrament.color}20, transparent)` }}></div>
                  </div>
                  <div className="sacrament-icon" style={{ backgroundColor: currentSacrament.color }}>
                    {currentSacrament.icon}
                  </div>
                  <div className="sacrament-quick-info">
                    <p><FiClock /> Prep: {currentSacrament.preparationTime}</p>
                    <p><FiCalendar /> {currentSacrament.schedule.split('|')[0]}</p>
                  </div>
                </div>

                {/* About Section - 3/4 width */}
                <div className="sacrament-info-section">
                  <div className="info-header">
                    <h1 className="sacrament-title">{currentSacrament.title}</h1>
                    <p className="sacrament-subtitle">{currentSacrament.subtitle}</p>
                  </div>

                  <div className="info-tabs">
                    <div className="tab-content">
                      {/* About Section */}
                      <div className="about-section">
                        <h2>About the Sacrament</h2>
                        <p>{currentSacrament.about}</p>
                        <div className="meaning-box" style={{ borderLeftColor: currentSacrament.color }}>
                          <h3>Meaning & Significance</h3>
                          <p>{currentSacrament.meaning}</p>
                        </div>
                      </div>

                      {/* How to Receive Section */}
                      <div className="how-to-section">
                        <h2>How to Receive</h2>
                        <ul className="how-to-list">
                          {currentSacrament.howTo.map((step, index) => (
                            <li key={index}>
                              <span className="step-number">{index + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Requirements Section */}
                      <div className="requirements-section">
                        <h2>Requirements</h2>
                        <ul className="requirements-list">
                          {currentSacrament.requirements.map((req, index) => (
                            <li key={index}>
                              <FiCheckCircle className="check-icon" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Contact & Schedule */}
                      <div className="contact-section">
                        <h2>Contact & Schedule</h2>
                        <div className="contact-grid">
                          <div className="contact-card">
                            <FiMail className="contact-icon" />
                            <div>
                              <strong>Contact</strong>
                              <p>{currentSacrament.contact}</p>
                            </div>
                          </div>
                          <div className="contact-card">
                            <FiCalendar className="contact-icon" />
                            <div>
                              <strong>Schedule</strong>
                              <p>{currentSacrament.schedule}</p>
                            </div>
                          </div>
                          <div className="contact-card">
                            <FiMapPin className="contact-icon" />
                            <div>
                              <strong>Location</strong>
                              <p>{currentSacrament.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
  );
};

export default Sacraments;