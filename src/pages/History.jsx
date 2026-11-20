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
  Church,
  Star,
  Award,
  Target,
  Eye,
  Heart,
  Cross,
  Anchor,
  TrendingUp,
  Home,
  UserCheck
} from 'lucide-react';

import './history.css';

// Import images
import ctkMainImg from '../assets/church.webp';
import ctkSideImg from '../assets/church2.webp';
import secretariat from '../assets/history/Secretariat.jpeg';
import groto from '../assets/Groto.webp';
import sjtePlaceholderImg from '../assets/history/Sjte.webp';

const History = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Carousel Images
  const images = [
    { src: ctkMainImg, alt: 'Christ the King Church', caption: 'Present Day Christ the King Church' },
    { src: ctkSideImg, alt: 'Side View', caption: 'Another View of the Church' },
    { src: secretariat, alt: 'Modern secretariat building', caption: 'Modern secretariat building' },
    { src: groto, alt: 'Grotto of Our Lady', caption: 'Grotto of Our Lady' },
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (index) => setActiveSlide(index);

  const fadeInUp = shouldReduceMotion
    ? undefined
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  const slideVariants = shouldReduceMotion
    ? undefined
    : { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };

  // Core Values (from homepage)
  const coreValues = [
    { Icon: Users, title: 'Inclusivity', description: "Welcoming all to God's family" },
    { Icon: Heart, title: 'Servant Leadership', description: 'Leading through service' },
    { Icon: Cross, title: 'Shared Responsibility', description: "Together in Christ's mission" },
    { Icon: Anchor, title: 'Eucharistic Living', description: "Living in Christ's presence" },
  ];

  // Historical Timeline Data
  const timeline = [
    {
      year: 'Before 1970',
      title: 'The Beginnings of Catholic Worship',
      description: 'No Catholic church existed in the Embakasi area.',
      details: 'Masses were initially held at the Edelvale Sisters\' home near Kayole. Priests from Our Lady of Visitation Parish, Makadara, later celebrated Mass at Mabatini near the Army Barracks (now Embakasi Garrison Junior Staff Quarters). Masses subsequently moved to Embakasi Primary School and Embakasi Social Hall.'
    },
    {
      year: '1974–1981',
      title: 'Establishment of Embakasi Outstation',
      description: 'Following the division of Makadara Parish, Embakasi became an outstation of Kariobangi Parish.',
      details: 'The Comboni Missionaries oversaw the parish, with Fr. Romeo becoming the first priest with special responsibility for Embakasi. In 1976, two harambees were held to purchase the land where the present parish stands. In 1981, Kariobangi Parish was divided, and Embakasi became part of Umoja Parish under the Maryknoll Fathers. The second phase of church construction was completed under Fr. Robert Jalbert.'
    },
    {
      year: 'May 1997',
      title: 'Establishment as a Parish',
      description: 'Archbishop Ndingi Mwana a\'Nzeki officially declared Embakasi a parish named Christ the King Catholic Church.',
      details: 'St. Patrick\'s Missionary Society was mandated to run the parish, with Fr. Edward Lalor as Father in charge, succeeded by Fr. Noel Connolly.'
    },
    {
      year: '2002–2012',
      title: 'Pastoral and Community Development',
      description: 'Fr. John Joe led the parish through a period of significant growth.',
      details: 'Achievements included the construction of the kindergarten, parochial school, tailoring, computer, and special school. The Utawala outstation (now Holy Family Utawala Parish) was established, St. Bakhita Dispensary was created, and the airport Small Christian Community (now St. Christopher SCC) was formed. A child safeguarding policy covering Christ the King Embakasi and Holy Family Utawala Parishes was formulated and implemented.'
    },
    {
      year: '2012–2015',
      title: 'Final Years of Missionary Leadership',
      description: 'Fr. Victor Dunne served from 2012 to 2014, followed by Fr. Vitalis Iyang from 2014 to 1 August 2015.',
      details: 'This period marked the conclusion of eighteen years of missionary leadership at Christ the King Catholic Parish.'
    },
    {
      year: '2015',
      title: 'Transition to Diocesan Leadership',
      description: 'Diocesan leadership took over, with Bishop Wallace Ng\'ang\'a appointed parish priest and Fr. Joseph Kariuki as Assistant Parish Priest.',
      details: 'They in collaboration with the pastoral team laid out a strategic pastoral plan for the developmental and spiritual growth of the parish guided by the three pillars of the AMECEA (Association of Member Episcopal Conferences in Eastern Africa): self-sustaining, self-propagating, and self-ministering. Seminars and workshops were organized to strengthen Small Christian Communities and the family unit.'
    }
  ];

  // Key Milestones
  const milestones = [
    { year: 'Before 1970', achievement: 'Early Catholic worship in Embakasi' },
    { year: '1974', achievement: 'Embakasi becomes a Kariobangi outstation' },
    { year: '1976', achievement: 'Acquisition of present parish land' },
    { year: '1981', achievement: 'Second phase of church construction completed' },
    { year: 'May 1997', achievement: 'Official establishment as a parish' },
    { year: '2002–2012', achievement: 'Educational and community initiatives' },
    { year: '2015', achievement: 'Transition to diocesan leadership and strategic plan developed' },
    { year: '2017', achievement: 'St. John the Evangelist outstation established' },
    { year: '2017–present', achievement: 'Major infrastructure development and strategic plan implementation' },
  ];

  // Growth Highlights
  const growthHighlights = [
    'Construction of a modern priests\' house following repeated flooding in the former residence',
    'Drilling of a borehole and garden works',
    'Development of a modern parish secretariat',
    'Cabro paving works around the church grounds',
    'Establishment of a sacramental bookshop',
    'Construction of an ultra-modern school building',
    'Development of a new Mother Mary Grotto',
    'Construction of a new chapel',
    
    'Formulation and current implementation of the 5 year strategic plan'
  ];

  // Priests Through the Years
  const missionaries = [
    { name: 'Fr. Romeo', period: '1974–1981', role: 'First priest with special responsibility for Embakasi' },
    { name: 'Fr. Robert Jalbert', period: '1981–1997', role: 'Oversaw completion of second phase of church construction' },
    { name: 'Fr. Edward Lalor', period: '1997', role: 'Priest in charge following parish establishment' },
    { name: 'Fr. Noel Connolly', period: '1997–2002', role: 'Succeeded Fr. Edward Lalor' },
    { name: 'Fr. John Joe', period: '2002–2012', role: 'Parish Priest' },
    { name: 'Fr. Victor Dunne', period: '2012–2014', role: 'Parish Priest' },
    { name: 'Fr. Vitalis Iyang', period: '2014–1 Aug 2015', role: 'Parish Priest' },
  ];

  const diocesan = [
    { name: 'Bishop Wallace Ng\'ang\'a', period: '2015–2023', role: 'First diocesan parish priest' },
    { name: 'Fr. Joseph Kariuki', period: '2015–2016', role: 'Assistant Parish Priest' },
    { name: 'Fr. Victor Mbuthia', period: '2016–2018', role: 'Assistant Parish Priest' },
    { name: 'Fr. Xavier Saka', period: '2018–2021', role: 'Assistant Parish Priest' },
    { name: 'Fr. Bernard Njuguna', period: '2021–2023', role: 'Assistant Parish Priest' },
    { name: 'Fr. Ignatius Njue', period: 'Nov 2023–2025', role: 'Parish Priest' },
    { name: 'Fr. Sammy Mungai', period: '2025–present', role: 'Current Parish Priest' },
    { name: 'Fr. Silferius Aluodo', period: '2023–present', role: 'Current Assistant Parish Priest' },
    { name: 'Fr. John Gitau', period: '2024–present', role: 'Current Assistant Parish Priest' },
  ];

  return (
    <main className="history-page">
      <div className="history-content">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hero Image Carousel */}
          <div className="history-slider">
            <div className="history-slider__frame">
              <AnimatePresence mode="wait" custom={1}>
                <motion.img
                  key={activeSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                  src={images[activeSlide].src}
                  alt={images[activeSlide].alt}
                  className="history-slider__image"
                />
              </AnimatePresence>
              {images[activeSlide].caption && (
                <div className="history-slider__caption">{images[activeSlide].caption}</div>
              )}
            </div>
            
            <div className="history-slider__controls">
              <button onClick={prevSlide} aria-label="Previous image" className="history-slider__nav">
                <ChevronLeft size={20} />
              </button>
              <div className="history-slider__dots" role="tablist" aria-label="Image slides">
                {images.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={activeSlide === index}
                    aria-label={`Image ${index + 1}`}
                    className={`history-slider__dot ${activeSlide === index ? 'is-active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
              <button onClick={nextSlide} aria-label="Next image" className="history-slider__nav">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Parish Introduction */}
          <div className="history-info">
            <header className="history-info__header">
              <h1 className="history-info__title">Christ the King Embakasi</h1>
              <p className="history-info__subtitle">A Journey of Faith</p>
              
              <div className="history-info__facts">
                <span className="history-fact"><MapPin size={16} /> Embakasi East Constituency, Nairobi</span>
                <span className="history-fact"><Calendar size={16} /> Established: May 1997</span>
              </div>
            </header>

            <div className="history-info__description">
              <p>Christ the King Catholic Parish is located in Embakasi East Constituency. It is one of the six parishes in Embakasi Deanery under the Archdiocese of Nairobi and has one outstation, St. John the Evangelist Catholic Church in Tassia. The congregation is largely drawn from the surrounding residential estates.</p>
            </div>

            {/* Historical Timeline */}
            <section className="history-section">
              <h2 className="history-section__heading">
                <Clock className="history-section__icon" /> Historical Timeline
              </h2>
              <div className="history-timeline">
                {timeline.map((item, index) => (
                  <motion.div key={index} className="history-timeline__item" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
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

            {/* Key Milestones */}
            <section className="history-section">
              <h2 className="history-section__heading">
                <Star className="history-section__icon" /> Key Milestones
              </h2>
              <div className="history-milestones">
                {milestones.map((milestone, index) => (
                  <motion.div key={index} className="history-milestone" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <div className="history-milestone__year">{milestone.year}</div>
                    <div className="history-milestone__text">{milestone.achievement}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Growth and Development (2017–2025) */}
            <section className="history-section">
              <h2 className="history-section__heading">
                <TrendingUp className="history-section__icon" /> Growth and Development (2017–present)
              </h2>
              <div className="history-info__description">
                <p>Since 2017, the parish experienced significant physical development and improvement of facilities. These projects have enhanced the parish's ability to serve its growing community. The current leadership, under Fr. Sammy Mungai, continues to oversee the ongoing implementation of the five-year strategic plan.</p>
              </div>
              <div className="history-milestones" style={{ marginTop: '1.5rem' }}>
                {growthHighlights.map((highlight, index) => (
                  <motion.div key={index} className="history-milestone" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <div className="history-milestone__text">{highlight}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* St. John the Evangelist Outstation */}
            <section className="history-section">
              <h2 className="history-section__heading">
                <Church className="history-section__icon" /> St. John the Evangelist Catholic Church — Tassia
              </h2>
              <div className="history-info__description">
                <p>The growth of the Catholic population in Tassia Baraka Estate and surrounding areas created the need for an outstation. Bishop Wallace Ng'ang'a, the parish priest at the time, mobilised Christians to raise funds, and land was acquired through a loan. A harambee organised by the parish priest and his assistant helped offset the loan. Approximately two years later, a tent was erected and operations began.</p>
                <p style={{ marginTop: '1rem' }}>The outstation currently serves approximately 600 Christians, with three Masses celebrated there. A permanent church structure is still in the process of being built.</p>
              </div>
            </section>

            {/* Priests Through the Years */}
            <section className="history-section">
              <h2 className="history-section__heading">
                <UserCheck className="history-section__icon" /> Missionary Leadership
              </h2>
              <div className="history-priests">
                {missionaries.map((priest, index) => (
                  <motion.div key={index} className="history-priest" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <div className="history-priest__name">{priest.name}</div>
                    <div className="history-priest__period">{priest.period}</div>
                    <div className="history-priest__role">{priest.role}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="history-section">
              <h2 className="history-section__heading">
                <UserCheck className="history-section__icon" /> Diocesan Leadership
              </h2>
              <div className="history-priests">
                {diocesan.map((priest, index) => (
                  <motion.div key={index} className="history-priest" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <div className="history-priest__name">{priest.name}</div>
                    <div className="history-priest__period">{priest.period}</div>
                    <div className="history-priest__role">{priest.role}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Mission & Vision & Core Values */}
            <section className="history-section">
              <h2 className="history-section__heading">
                <Target className="history-section__icon" /> Our Mission
              </h2>
              <div className="history-info__description">
                <p>To love God and humanity, teaching the Gospel values, spreading joy and showing compassion to all.</p>
              </div>
            </section>

            <section className="history-section">
              <h2 className="history-section__heading">
                <Eye className="history-section__icon" /> Our Vision
              </h2>
              <div className="history-info__description">
                <p>A Christ centered parish where faith grows, worship inspires and service transforms lives.</p>
              </div>
            </section>

            <section className="history-section" style={{ marginBottom: '0' }}>
              <h2 className="history-section__heading">
                <Heart className="history-section__icon" /> Our Core Values
              </h2>
              <div className="history-milestones">
                {coreValues.map((value, index) => {
                  const Icon = value.Icon;
                  return (
                    <motion.div key={index} className="history-milestone" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="history-milestone__year" style={{ fontSize: '1.05rem' }}>{value.title}</div>
                        <div className="history-milestone__text" style={{ fontSize: '0.9rem' }}>{value.description}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default History;