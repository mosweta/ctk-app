import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Users, 
  BookOpen,
  Clock,
  Church
} from 'lucide-react';

import './history.css';

// Import images
import ctkMainImg from '../assets/church.webp';
import ctkSideImg from '../assets/church2.webp';
import ctkMassImg from '../assets/bishops.webp';
import groto from '../assets/Groto.webp';
import sjtePlaceholderImg from '../assets/history/Sjte.webp';

const History = () => {
  const [activeTab, setActiveTab] = useState('ctk');
  const [ctkSlide, setCtkSlide] = useState(0);
  const [sjteSlide, setSjteSlide] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // CTK History Data
  const ctkHistory = {
    title: 'Christ the King Embakasi',
    subtitle: 'A Journey of Faith Since 1974',
    location: 'Embakasi East Constituency, Nairobi',
    established: '1997 (Declared a Parish)',
    description: 'Christ the King Embakasi is a parish located at the heart of Embakasi East Constituency. It is one of the six parishes in St. Rita Embakasi Deanery under the archdiocese of Nairobi. It has one outstation called St. John the Evangelist Catholic Church in Tassia.',
    images: [
      { src: ctkMainImg, alt: 'Christ the King Church', caption: 'Present Day Christ the King Church' },
      { src: ctkSideImg, alt: 'Side View', caption: 'Another View of the Church' },
      { src: ctkMassImg, alt: 'Sunday Mass', caption: 'Sunday Mass Celebration' },
      { src: groto, alt: 'Grotto of Our Lady', caption: 'Grotto of Our Lady' }
    ],
    timeline: [
      { year: 'Before 1970', title: 'Early Beginnings', description: "No Catholic church in Embakasi area. Masses were held at Edelvale Sister's home near Kayole.", details: 'Priests from Our Lady of Visitation Makadara offered the first Mass at Mabatini near the army Barracks, then later at Embakasi Primary and Embakasi Social Hall.' },
      { year: '1974', title: 'Part of Kariobangi Parish', description: 'Makadara Parish was divided and Embakasi outstation became part of Kariobangi Parish.', details: 'Comboni missionaries were responsible for overseeing the parish. Fr Romeo became the first priest with special responsibility for Embakasi.' },
      { year: '1976', title: 'Land Purchase', description: 'Two harambees were held to raise funds to purchase a plot to put up a church.', details: 'The plot was purchased and acquired - this is where Christ the King Catholic Parish currently stands.' },
      { year: '1981', title: 'Part of Umoja Parish', description: 'Kariobangi Parish was divided and Embakasi outstation became part of the new Umoja Parish.', details: 'Maryknoll Fathers took over, with Fr. Robert Jalbert overseeing the second phase of building the Church.' },
      { year: '1997', title: 'Official Parish Status', description: 'Embakasi outstation was officially declared a parish named Christ the King Catholic Church.', details: "Archbishop Ndingi Mwana a'Nzeki declared it a parish. St. Patrick's Missionary Society was mandated to run the parish with Fr. Edward Lalor as Father in charge." },
      { year: '2002-2012', title: 'Fr. John Joe Era', description: 'Fr John Joe took over as Parish Priest and served until 2012.', details: 'Major milestones during this period included: Establishment of schools (kindergarten, parochial, tailoring, computer, and special school), Birth of Holy Family Utawala Parish, Creation of St. Bakhita Dispensary, Establishment of St. Christopher S.C.C at the airport, Implementation of child safeguarding policy.' },
      { year: '2012-2015', title: 'Transition Period', description: 'Fr Victor Dunne (2012-2014) and Fr Vitalis Iyang (2014-2015) led the parish.', details: 'This marked eighteen years of Christ the King being run by Missionaries before the transition to diocesan priests.' },
      { year: '2015', title: 'Bishop Wallace Era Begins', description: "Bishop Wallace Ng'ang'a was appointed parish priest after the missionaries left.", details: "Fr Joseph Kariuki served as Assistant Parish Priest. They laid out a strategic pastoral plan guided by the three pillars of AMECEA: self-sustaining, self-propagating, and self-ministering." },
      { year: '2017-2018', title: 'Establishment of SJTE Outstation', description: 'Need arose to establish an outstation in Tassia Baraka Estate.', details: 'Bishop Wallace mobilized Christians to raise funds. A piece of land was purchased through a loan, and a harambee helped offset it. A tent was erected, and operations started, serving about 600 Christians.' },
      { year: '2023-2025', title: 'Growth and Development', description: 'Fr. Ignatius Njue took over as Parish Priest with Fr. Silferius Aluodo as Assistant.', details: "They oversaw the growth and development, including building of an ultra-modern priests' house, drilling of a borehole, cabro works, and garden work around the church." },
      { year: '2025-present', title: 'Current Leadership', description: 'Fr. Sammy Mungai took over as Parish Priest with Fr. Silferius Aluodo and Fr. John Mwangi as Assistants.', details: 'They are currently overseeing the completion of the five year strategic plan, ultra-modern school building as well as the purchase of pieces of land in Tassia for the outstation St. John the Evangelist.' }
    ],
    milestones: [
      { year: '1976', achievement: 'Plot purchased for church construction' },
      { year: '1997', achievement: 'Declared an official parish' },
      { year: '2002-2012', achievement: 'Schools established & Utawala outstation born' },
      { year: '2015', achievement: 'Diocesan priests take over leadership' },
      { year: '2017', achievement: 'SJTE outstation established in Tassia' },
      { year: '2023', achievement: 'New leadership & infrastructure development' }
    ],
    priests: [
      { name: 'Fr Romeo', period: '1974-1981', role: 'First priest with special responsibility for Embakasi' },
      { name: 'Fr Robert Jalbert', period: '1981-1997', role: 'Oversaw second phase of church construction' },
      { name: 'Fr Edward Lalor', period: '1997-?', role: 'First parish priest after declaration' },
      { name: 'Fr Noel Connolly', period: '?', role: 'Succeeded Fr Edward Lalor' },
      { name: 'Fr John Joe', period: '2002-2012', role: 'Established schools and Utawala outstation' },
      { name: 'Fr Victor Dunne', period: '2012-2014', role: 'Parish Priest' },
      { name: 'Fr Vitalis Iyang', period: '2014-2015', role: 'Parish Priest' },
      { name: "Bishop Wallace Ng'ang'a", period: '2015-2023', role: 'First diocesan parish priest' },
      { name: 'Fr Joseph Kariuki', period: '2015-2023', role: 'Assistant Parish Priest' },
      { name: 'Fr Ignatius Njue', period: '2023-2025', role: 'Parish Priest' },
      { name: 'Fr Sammy Mungai', period: '2025-present', role: 'Current Parish Priest' },
      { name: 'Fr Silferius Aluodo', period: '2023-Present', role: 'Current Assistant Parish Priest' },
      { name: 'Fr John Mwangi', period: '2024-Present', role: 'Current Assistant Parish Priest' }
    ]
  };

  // SJTE Data
  const sjteHistory = {
    title: 'St. John the Evangelist (SJTE)',
    subtitle: 'Coming Soon',
    location: 'Tassia, Nairobi',
    established: '2017 (Outstation Established)',
    description: 'St. John the Evangelist Catholic Church in Tassia is an outstation of Christ the King Embakasi Parish. Currently serving about 600 Christians with two masses held on Sundays at 8:00 AM and 10:00 AM.',
    images: [
      { src: sjtePlaceholderImg, alt: 'SJTE Church', caption: 'St. John the Evangelist Church' },
    ],
    timeline: [
      { year: 'Coming Soon', title: 'Full History Coming Soon', description: 'Detailed history of St. John the Evangelist Catholic Church will be available shortly.', details: 'We are currently documenting the rich history of our Tassia outstation. Check back soon for updates!' }
    ],
    milestones: [
      { year: '2017', achievement: 'Land purchased for the outstation' },
      { year: '2018', achievement: 'Tent erected and operations started' },
      { year: '2024', achievement: 'Growing community of 600+ Christians' }
    ],
    priests: [
      { name: "Bishop Wallace Ng'ang'a", period: '2017-2023', role: 'Oversaw establishment of outstation' },
      { name: 'Fr Ignatius Njue', period: '2023-2025', role: "Succeeded Bishop Wallace Ng'ang'a and started the purchase of land" },
      { name: 'Fr Sammy Mungai', period: '2025-Present', role: 'Current oversight' },
      { name: 'Fr Silferius Aluodo', period: '2023-Present', role: 'Assistant oversight' },
      { name: 'Fr John Mwangi', period: '2024-Present', role: 'Assistant oversight' }
    ]
  };

  const currentData = activeTab === 'ctk' ? ctkHistory : sjteHistory;
  const currentImages = currentData.images;
  
  const currentSlide = activeTab === 'ctk' ? ctkSlide : sjteSlide;
  const setCurrentSlide = activeTab === 'ctk' ? setCtkSlide : setSjteSlide;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % currentImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset slide to 0 when switching tabs to avoid invalid indices
    if (tab === 'ctk') setCtkSlide(0);
    else setSjteSlide(0);
  };

  const fadeInUp = shouldReduceMotion
    ? undefined
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  const slideVariants = shouldReduceMotion
    ? undefined
    : {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 }
      };

  return (
    <main className="history-page">
      
      {/* Tabs */}
      <div className="history-tabs" role="tablist" aria-label="Parish History">
        <button 
          role="tab"
          aria-selected={activeTab === 'ctk'}
          className={`history-tab ${activeTab === 'ctk' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('ctk')}
        >
          <Church size={20} aria-hidden="true" />
          <span>Christ the King</span>
        </button>
        <button 
          role="tab"
          aria-selected={activeTab === 'sjte'}
          className={`history-tab ${activeTab === 'sjte' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('sjte')}
        >
          <BookOpen size={20} aria-hidden="true" />
          <span>St. John the Evangelist</span>
        </button>
      </div>

      <div className="history-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Image Carousel */}
            <div className="history-slider">
              <div className="history-slider__frame">
                <AnimatePresence mode="wait" custom={1}>
                  <motion.img
                    key={currentSlide}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    src={currentImages[currentSlide].src}
                    alt={currentImages[currentSlide].alt}
                    className="history-slider__image"
                  />
                </AnimatePresence>
                
                {currentImages[currentSlide].caption && (
                  <div className="history-slider__caption">
                    {currentImages[currentSlide].caption}
                  </div>
                )}
              </div>
              
              <div className="history-slider__controls">
                <button
                  onClick={prevSlide}
                  aria-label="Previous image"
                  className="history-slider__nav"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="history-slider__dots" role="tablist" aria-label="Image slides">
                  {currentImages.map((_, index) => (
                    <button
                      key={index}
                      role="tab"
                      aria-selected={currentSlide === index}
                      aria-label={`Image ${index + 1}`}
                      className={`history-slider__dot ${currentSlide === index ? 'is-active' : ''}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  aria-label="Next image"
                  className="history-slider__nav"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* History Info */}
            <div className="history-info">
              <header className="history-info__header">
                <h1 className="history-info__title">{currentData.title}</h1>
                <p className="history-info__subtitle">{currentData.subtitle}</p>
                
                <div className="history-info__facts">
                  <span className="history-fact">
                    <MapPin size={16} aria-hidden="true" /> {currentData.location}
                  </span>
                  <span className="history-fact">
                    <Calendar size={16} aria-hidden="true" /> Established: {currentData.established}
                  </span>
                </div>
              </header>

              <div className="history-info__description">
                <p>{currentData.description}</p>
              </div>

              {/* CTK Content */}
              {activeTab === 'ctk' && (
                <>
                  <section className="history-section">
                    <h2 className="history-section__heading">
                      <Clock className="history-section__icon" aria-hidden="true" />
                      Historical Timeline
                    </h2>
                    <div className="history-timeline">
                      {currentData.timeline.map((item, index) => (
                        <motion.div 
                          key={index} 
                          className="history-timeline__item"
                          variants={fadeInUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                        >
                          <div className="history-timeline__year">{item.year}</div>
                          <div className="history-timeline__content">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <div className="history-timeline__details">{item.details}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  <section className="history-section">
                    <h2 className="history-section__heading">Key Milestones</h2>
                    <div className="history-milestones">
                      {currentData.milestones.map((milestone, index) => (
                        <motion.div 
                          key={index} 
                          className="history-milestone"
                          variants={fadeInUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                        >
                          <div className="history-milestone__year">{milestone.year}</div>
                          <div className="history-milestone__text">{milestone.achievement}</div>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  <section className="history-section">
                    <h2 className="history-section__heading">
                      <Users className="history-section__icon" aria-hidden="true" />
                      Parish Priests Through the Years
                    </h2>
                    <div className="history-priests">
                      {currentData.priests.map((priest, index) => (
                        <motion.div 
                          key={index} 
                          className="history-priest"
                          variants={fadeInUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                        >
                          <div className="history-priest__name">{priest.name}</div>
                          <div className="history-priest__period">{priest.period}</div>
                          <div className="history-priest__role">{priest.role}</div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {/* SJTE Content */}
              {activeTab === 'sjte' && (
                <div className="history-coming-soon">
                  <div className="history-coming-soon__card">
                    <BookOpen size={48} className="history-coming-soon__icon" aria-hidden="true" />
                    <h2>History Coming Soon</h2>
                    <p>We are currently documenting the rich history of St. John the Evangelist Catholic Church in Tassia.</p>
                    
                    <div className="history-coming-soon__facts">
                      <div className="history-coming-soon__fact">
                        <Calendar size={18} aria-hidden="true" />
                        <span>Established: 2017</span>
                      </div>
                      <div className="history-coming-soon__fact">
                        <Users size={18} aria-hidden="true" />
                        <span>500+ Christians</span>
                      </div>
                      <div className="history-coming-soon__fact">
                        <Church size={18} aria-hidden="true" />
                        <span>2 Masses Sundays</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default History;