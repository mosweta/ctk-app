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
    established: 'May 1997 (Declared a Parish)',
    description:
      'Christ the King Embakasi is a parish located at the heart of Embakasi East Constituency. It is one of the six parishes in Embakasi Deanery under the Archdiocese of Nairobi. It has one outstation, St. John the Evangelist Catholic Church in Tassia.',
    images: [
      {
        src: ctkMainImg,
        alt: 'Christ the King Church',
        caption: 'Present Day Christ the King Church',
      },
      {
        src: ctkSideImg,
        alt: 'Side View',
        caption: 'Another View of the Church',
      },
      {
        src: ctkMassImg,
        alt: 'Sunday Mass',
        caption: 'Sunday Mass Celebration',
      },
      {
        src: groto,
        alt: 'Grotto of Our Lady',
        caption: 'Grotto of Our Lady',
      },
    ],
    timeline: [
      {
        year: 'Before 1970',
        title: 'Early Beginnings',
        description:
          'No Catholic church existed in the Embakasi area. Masses were held at the home of the Edelvale Sisters near Kayole.',
        details:
          'Priests from Our Lady of Visitation Parish, Makadara, celebrated the first Mass in the area at Mabatini, near the army barracks (presently the site of the Embakasi Garrison Junior Staff Quarters). Mass was subsequently celebrated at Embakasi Primary School and then at Embakasi Social Hall.',
      },
      {
        year: '1974',
        title: 'Part of Kariobangi Parish',
        description:
          'Following the division of Makadara Parish, Embakasi became an outstation of Kariobangi Parish.',
        details:
          'The Comboni missionaries were responsible for overseeing the parish. Fr. Romeo became the first priest with special responsibility for Embakasi.',
      },
      {
        year: '1976',
        title: 'Land Acquisition',
        description:
          'Two harambees were organized to raise funds to purchase land for a church.',
        details:
          'The plot was purchased and acquired. Christ the King Catholic Parish currently stands on that land.',
      },
      {
        year: '1981',
        title: 'Part of Umoja Parish',
        description:
          'Following the division of Kariobangi Parish, Embakasi became an outstation of Umoja Parish.',
        details:
          'The Maryknoll Fathers took over, with Fr. Robert Jalbert overseeing the second phase of the building of the church, which was completed during his tenure.',
      },
      {
        year: 'May 1997',
        title: 'Official Parish Status',
        description:
          'Embakasi outstation was officially declared a parish named Christ the King Catholic Church.',
        details:
          "Archbishop Ndingi Mwana a'Nzeki declared it a parish. St. Patrick's Missionary Society was mandated to run the parish with Fr. Edward Lalor in charge. He was succeeded by Fr. Noel Connolly.",
      },
      {
        year: '2002–2012',
        title: 'Fr. John Joe Era',
        description:
          'Fr. John Joe took over as Parish Priest in 2002 and served until 2012, when he was transferred to South Sudan.',
        details:
          'Major milestones during this period included: establishment and construction of the kindergarten and parochial school, tailoring and computer schools, and special school; the birth of a new outstation in Utawala (currently Holy Family Utawala Parish); creation of St. Bakhita Dispensary in Utawala; establishment of a Small Christian Community at the airport (currently St. Christopher S.C.C); and formulation and implementation of a child safeguarding policy covering Christ the King Embakasi and Holy Family Utawala Parishes.',
      },
      {
        year: '2012–2015',
        title: 'Transition Period',
        description:
          'Fr. Victor Dunne served from 2012 to 2014. Fr. Vitalis Iyang led the parish from 2014 until 1 August 2015.',
        details:
          'This marked eighteen years of Christ the King Catholic Parish being run by Missionaries before the transition to diocesan priests.',
      },
      {
        year: '2015',
        title: 'Diocesan Administration Begins',
        description:
          "Bishop Wallace Ng'ang'a was appointed parish priest after the missionaries left, with Fr. Joseph Kariuki as Assistant Parish Priest.",
        details:
          'In collaboration with the pastoral team, they laid out a strategic pastoral plan for the developmental and spiritual growth of the parish, guided by the three pillars of AMECEA (Association of Member Episcopal Conferences in Eastern Africa): self-sustaining, self-propagating, and self-ministering. They organized seminars and workshops to grow the SCCs and the family unit in the church.',
      },
      {
        year: 'Tassia Outstation',
        title: 'Establishment of SJTE Outstation',
        description:
          'Growth in Tassia Baraka Estate created a need for an outstation.',
        details:
          'Bishop Wallace mobilized Christians to raise funds for the initiative. A piece of land was purchased through a loan, and the parish priest and his assistant organized a harambee which helped to offset the loan. Approximately two years later, a tent was erected on the land and operations began. The community now serves about 600 Christians, with two Sunday Masses at 8:00 a.m. and 10:00 a.m. A permanent church structure is still under construction.',
      },
      {
        year: '2023–2025',
        title: 'Growth and Development',
        description:
          'Fr. Ignatius Njue took over as Parish Priest in November 2023, with Fr. Silferius Aluodo as Assistant Parish Priest.',
        details:
          "Alongside Fr. Silferius, Fr. John Gitau joined as assistant in 2024. During this period the parish continued its development, including the building of an ultra-modern priests' house following a series of flooding in the former house, drilling of a borehole, cabro works, and garden work around the church.",
      },
      {
        year: '2025–present',
        title: 'Current Leadership',
        description:
          'Fr. Sammy Mungai took over as Parish Priest in 2025, with Fr. Silferius Aluodo and Fr. John Gitau as Assistants.',
        details:
          'They are currently overseeing the completion of the five-year strategic plan, the ultra-modern school building, and the purchase of pieces of land in Tassia for the St. John the Evangelist outstation.',
      },
    ],
    milestones: [
      { year: '1976', achievement: 'Plot purchased for church construction' },
      { year: 'May 1997', achievement: 'Declared an official parish' },
      {
        year: '2002–2012',
        achievement: 'Schools established, Utawala outstation born',
      },
      { year: '2015', achievement: 'Diocesan priests take over leadership' },
      { year: '2017', achievement: 'SJTE outstation established' },
      {
        year: '2023–2025',
        achievement: 'New leadership & infrastructure development',
      },
    ],
    priests: [
      {
        name: 'Fr. Romeo',
        period: '1974–1981',
        role: 'First priest with special responsibility for Embakasi',
      },
      {
        name: 'Fr. Robert Jalbert',
        period: '1981–1997',
        role: 'Oversaw the second phase of the church building',
      },
      {
        name: 'Fr. Edward Lalor',
        period: '1997–?',
        role: 'First parish priest after declaration',
      },
      {
        name: 'Fr. Noel Connolly',
        period: '?',
        role: 'Succeeded Fr. Edward Lalor',
      },
      {
        name: 'Fr. John Joe',
        period: '2002–2012',
        role: 'Established schools and the Utawala outstation',
      },
      { name: 'Fr. Victor Dunne', period: '2012–2014', role: 'Parish Priest' },
      {
        name: 'Fr. Vitalis Iyang',
        period: '2014–1 Aug 2015',
        role: 'Parish Priest',
      },
      {
        name: "Bishop Wallace Ng'ang'a",
        period: '2015–2023',
        role: 'First diocesan parish priest',
      },
      {
        name: 'Fr. Joseph Kariuki',
        period: '2015–2023',
        role: 'Assistant Parish Priest',
      },
      {
        name: 'Fr. Ignatius Njue',
        period: 'Nov 2023–2025',
        role: 'Parish Priest',
      },
      {
        name: 'Fr. Sammy Mungai',
        period: '2025–present',
        role: 'Current Parish Priest',
      },
      {
        name: 'Fr. Silferius Aluodo',
        period: '2023–present',
        role: 'Current Assistant Parish Priest',
      },
      {
        name: 'Fr. John Gitau',
        period: '2024–present',
        role: 'Current Assistant Parish Priest',
      },
    ],
  };

  // SJTE Data
  const sjteHistory = {
    title: 'St. John the Evangelist (SJTE)',
    subtitle: 'An Outstation of Christ the King Embakasi',
    location: 'Tassia Baraka Estate, Nairobi',
    established: '2017 (as an outstation)',
    description:
      'St. John the Evangelist Catholic Church in Tassia Baraka Estate is an outstation of Christ the King Embakasi Parish. As the community in Tassia and its environs continued to grow, there arose a need to establish an outstation to serve the Christians living in the area. The parish priest at the time, Bishop Wallace Ng\'ang\'a, mobilized Christians to raise funds, and a piece of land was purchased through a loan. A harambee organized by the parish priest and his assistant helped to offset the loan. Approximately two years later, a tent was erected on the land, and operations began.',
    images: [
      {
        src: sjtePlaceholderImg,
        alt: 'St. John the Evangelist Church',
        caption: 'St. John the Evangelist Church',
      },
    ],
    timeline: [
      {
        year: 'Establishment',
        title: 'Land and Tent',
        description:
          "Growth in Tassia Baraka Estate created the need for an outstation of Christ the King Embakasi.",
        details:
          "Bishop Wallace Ng'ang'a mobilized Christians to raise funds. A piece of land was purchased through a loan, and a harambee helped to offset the loan. Approximately two years later, a tent was erected on the land and services began.",
      },
      {
        year: 'Present',
        title: 'Ongoing Development',
        description:
          'The community now serves approximately 600 Christians with two Sunday Masses.',
        details:
          'Two Sunday Masses are held at 8:00 a.m. and 10:00 a.m. including a pmc mass that takes place at 10:00 a.m. in the school hall. A permanent church structure is still being planned for.',
      },
    ],
    milestones: [
      { year: 'Growth', achievement: 'Need for an outstation in Tassia arose' },
      { year: 'Fundraising', achievement: 'Land purchased with funds mobilized by the parish priest' },
      { year: 'Tent', achievement: 'Tent erected and services began' },
      { year: 'Today', achievement: 'Serving approximately 600 Christians' },
      {
        year: 'Ongoing',
        achievement: 'Permanent church structure being planned for',
      },
    ],
    priests: [
      {
        name: "Bishop Wallace Ng'ang'a",
        period: '2015–2023',
        role: 'Oversaw establishment of the outstation',
      },
      {
        name: 'Fr. Ignatius Njue',
        period: 'Nov 2023–2025',
        role: 'Continued development of the outstation',
      },
      {
        name: 'Fr. Sammy Mungai',
        period: '2025–present',
        role: 'Current oversight',
      },
      {
        name: 'Fr. Silferius Aluodo',
        period: '2023–present',
        role: 'Assistant oversight',
      },
      {
        name: 'Fr. John Gitau',
        period: '2024–present',
        role: 'Assistant oversight',
      },
    ],
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

              {/* Both tabs now render the same structured sections:
                  timeline, milestones, and priests. The "History coming
                  soon" placeholder and its empty card are gone. */}
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
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default History;