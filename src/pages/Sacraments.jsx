/**
 * Sacraments page.
 *
 * Replaces the previous full-screen carousel with a card grid +
 * detail section on the same page. The seven sacraments are shown as
 * cards. Selecting a card updates the detail section below without
 * navigating away. Baptism is selected by default.
 *
 * Theming:
 *   All colors come from semantic tokens in src/index.css. Light and
 *   dark mode are handled by the existing .dark class on <html>.
 *
 * Accessibility:
 *   - The card grid is a list of buttons. Each card has an
 *     aria-pressed state so assistive tech knows which one is
 *     selected.
 *   - The detail section has a stable id and gets focus on change so
 *     keyboard users land in the new content.
 *   - All decorative icons are aria-hidden.
 *   - prefers-reduced-motion respected for the detail entrance.
 *
 * Content:
 *   All seven sacrament objects and their fields (about, meaning,
 *   howTo, requirements, contact, schedule, location,
 *   preparationTime) are preserved exactly. The `color` field is
 *   retained in the data for backward compatibility but is not
 *   rendered — the page uses theme tokens instead.
 */

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Droplet,
  Cross,
  Flame,
  Heart,
  BookOpen,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Check,
} from 'lucide-react';
import './Sacraments.css';

// Import images
import baptismImg from '../assets/Sacraments/baptism.jpg';
import eucharistImg from '../assets/Sacraments/eucharist.jpg';
import confirmationImg from '../assets/Sacraments/confirmation.jpg';
import confessionImg from '../assets/Sacraments/confession.jpg';
import anointingImg from '../assets/Sacraments/anointing.jpg';
import holyOrdersImg from '../assets/Sacraments/holy-orders.jpg';
import matrimonyImg from '../assets/Sacraments/matrimony.jpg';

/**
 * The seven sacraments.
 *
 * `icon` values are Lucide components, not JSX. They are rendered
 * inside the card and detail header with explicit sizes.
 */
const SACRAMENTS = [
  {
    id: 1,
    title: 'Baptism',
    subtitle: 'The Door to Christian Life',
    icon: Droplet,
    image: baptismImg,
    about:
      'Baptism is the first sacrament of initiation, cleansing us from original sin and making us children of God. Through water and the Holy Spirit, we are born into new life in Christ. Baptism incorporates us into the Church, the body of Christ, and marks us with an indelible spiritual seal.',
    meaning:
      "The word 'Baptism' comes from the Greek 'baptizein' meaning 'to plunge' or 'immerse'. In baptism, we are plunged into the death and resurrection of Christ, dying to sin and rising to new life. This sacrament is necessary for salvation and is the foundation of the entire Christian life.",
    howTo: [
      'Contact the parish office at least 3 months in advance',
      'Attend pre-baptism preparation classes',
      'Choose godparents who are practicing Catholics',
      "Present the child's birth certificate",
      'Schedule the baptism date with the priest',
      'Baptism is typically celebrated during the Easter Vigil or on Sundays during Mass',
      'Baptism should be duly registered, and baptismal cards issued immediately',
      'Names given at baptism should be chosen from saint names or those based on Christian virtues',
    ],
    requirements: [
      'At least one parent must be a practicing Catholic',
      'Godparents must be confirmed Catholics over 16 leading a life in harmony with the faith and not the parent of the child',
      'Pre-baptism course completion certificate',
      "Child's birth certificate",
      'For more information, contact the parish office or refer to the Archdiocese of Nairobi pastoral guidelines',
    ],
    contact: 'Parish Office - 020 2495785',
    schedule: 'Easter Vigil or when announced',
    location: 'Main Church',
    preparationTime: '3 months',
  },
  {
    id: 2,
    title: 'Holy Eucharist',
    subtitle: 'Source and Summit of Christian Life',
    icon: Cross,
    image: eucharistImg,
    about:
      "The Holy Eucharist is the sacrament in which Jesus Christ gives His Body and Blood under the forms of bread and wine. It is the source and summit of the Christian life, where we receive Christ Himself. In the Mass, we participate in Christ's sacrifice and are united with Him and the Church.",
    meaning:
      "The Eucharist completes Christian initiation. Those who have been raised to the dignity of the royal priesthood by Baptism and configured more deeply to Christ by Confirmation participate with the whole community in the Lord's own sacrifice by means of the Eucharist.",
    howTo: [
      'Complete First Holy Communion preparation classes',
      'Be properly disposed (free from serious sin)',
      'Fast for one hour before receiving Communion',
      'Make a proper sign of reverence before receiving',
      'Receive worthily and regularly',
    ],
    requirements: [
      'Have a baptism card',
      'First Communion preparation course',
      'Age 9 or older with not less than one and a half years of instruction and scrutiny before reception',
      'Regular Mass attendance',
      'Proper understanding of the Eucharist',
      'For more information, contact the parish office or refer to the Archdiocese of Nairobi pastoral guidelines',
    ],
    contact: 'Parish Office - 020 2495785',
    schedule:
      'Daily: 7:00 AM | Sunday: 7:00 AM, 9:00 AM, 11:00 AM, 1:00 PM',
    location: 'Main Church',
    preparationTime: '6 months',
  },
  {
    id: 3,
    title: 'Confirmation',
    subtitle: 'Sealed with the Gift of the Holy Spirit',
    icon: Flame,
    image: confirmationImg,
    about:
      'Confirmation perfects Baptismal grace and gives us the Holy Spirit to make us stronger witnesses of Christ. Through the laying on of hands and anointing with chrism, we receive the seven gifts of the Holy Spirit and are strengthened to live out our faith boldly.',
    meaning:
      'By the sacrament of Confirmation, the baptized are more perfectly bound to the Church and are enriched with a special strength of the Holy Spirit. Hence they are, as true witnesses of Christ, more strictly obliged to spread and defend the faith by word and deed.',
    howTo: [
      'Be at least 10 years of age and at least 1 year of instruction',
      'Complete Confirmation preparation program',
      'Choose a sponsor (practicing Catholic) who is present and committed to the faith.',
      'Attend regular classes and retreats',
      "Choose a Confirmation name (saint's name)",
      'Administered at least once a year, usually on Pentecost Sunday or when announced by the parish by the local ordinary or his delegate.',
    ],
    requirements: [
      'Have a baptism card',
      'Have done First Communion',
      'Active participation in parish life',
      'Completion of preparation program',
      'For more information, contact the parish office or refer to the Archdiocese of Nairobi pastoral guidelines',
    ],
    contact: 'Parish Office - 020 2495785',
    schedule: 'Classes: Saturdays at 3:00 PM',
    location: 'Main Church & Parish Hall',
    preparationTime: '1 year',
  },
  {
    id: 4,
    title: 'Confession (Reconciliation)',
    subtitle: 'The Sacrament of Healing',
    icon: Heart,
    image: confessionImg,
    about:
      "Confession is the sacrament of God's mercy, where we receive forgiveness for sins committed after Baptism. Through the priest, Christ absolves us and reconciles us to God and the Church. This sacrament restores us to grace and strengthens us to avoid sin.",
    meaning:
      "Those who approach the sacrament of Penance obtain pardon from God's mercy for the offense committed against Him, and are, at the same time, reconciled with the Church which they have wounded by their sins and which by charity, example, and prayer labors for their conversion.",
    howTo: [
      'Examine your conscience before confession',
      'Approach the confessional with contrition',
      'Confess your sins honestly to the priest',
      'Accept the penance given by the priest',
      'Receive absolution and pray the Act of Contrition',
    ],
    requirements: [
      'Baptized Catholic who receives Holy Communion for the first time prior to First Holy Communion',
      'Proper examination of conscience',
      'Sincere sorrow for sins',
      'Firm purpose of amendment',
      'Worthily receive Communion after confession',
      'For more information, contact the parish office or refer to the Archdiocese of Nairobi pastoral guidelines',
    ],
    contact: 'Parish Office - 020 2495785',
    schedule: 'Saturdays: 4:00 PM - 5:30 PM',
    location: 'Confessionals in Church',
    preparationTime: 'No preparation needed - just come',
  },
  {
    id: 5,
    title: 'Anointing of the Sick',
    subtitle: 'Strength in Illness',
    icon: BookOpen,
    image: anointingImg,
    about:
      "The Anointing of the Sick gives spiritual and physical strength to those who are seriously ill or facing surgery. Through the anointing with blessed oil and prayer, Christ comforts and heals the sick person, giving them grace to bear their suffering and forgiveness of sins.",
    meaning:
      "This sacrament confers a special grace that unites the sick person more closely to Christ's Passion, brings comfort and peace, and gives strength to endure suffering. It also provides forgiveness of sins and, if it is God's will, physical healing.",
    howTo: [
      'Contact the parish office for the priest',
      'The priest will visit the sick person',
      'Family members should prepare a small table with a cross, holy water, and candles',
      'Join in the prayers and responses',
      'Receive Holy Communion if possible',
    ],
    requirements: [
      'Conferred to baptized Catholics who have requested for it or it has been requested on their behalf',
      'The ordinary minister of the sacrament is a priest',
      'The sacrament is not conferred to those who persevere obstinately in manifest grave sins (live publicly scandalous lives)',
      'Proper examination of conscience',
      'Serious illness or advanced age',
      'Before major surgery',
      'Reception while conscious and aware',
      'Can be repeated if condition worsens',
      'Frequent reception not restricted to danger of death',
      'For more information, contact the parish office or refer to the Archdiocese of Nairobi pastoral guidelines',
    ],
    contact: 'Parish Office - 020 2495785',
    schedule: 'Available anytime for emergencies',
    location: 'Home, Hospital, or Church',
    preparationTime: 'Call the priest immediately',
  },
  {
    id: 6,
    title: 'Holy Orders',
    subtitle: "Service to God's People",
    icon: Users,
    image: holyOrdersImg,
    about:
      'Holy Orders is the sacrament through which men are ordained as deacons, priests, or bishops. Through this sacrament, they receive the grace to serve the Church as ministers of Christ. Priests act in the person of Christ to celebrate the sacraments and lead the faithful.',
    meaning:
      'Holy Orders confers an indelible spiritual character and configures the ordained minister to Christ. Through ordination, men are empowered to preach the Gospel, celebrate the liturgy, and shepherd the people of God. It is a sacrament of service and sacrifice.',
    howTo: [
      'Discern your vocation through prayer and spiritual direction',
      'Contact the Vocations Director',
      'Complete application and undergo psychological evaluation',
      'Enter seminary formation',
      'Receive ordination as deacon, then priest',
    ],
    requirements: [
      'Male, practicing Catholic',
      'Baptized and confirmed',
      'Be recommended by parish priest',
      'Should be physically, mentally and psychologically fit',
      "Should voluntarily apply for admission through the vocation director's office",
      'Must have attained the age of majority (18 years)',
      'Good moral character',
      'Should have obtained necessary academic qualifications',
      'Call from God and the Church',
      'For more information, contact the parish office or refer to the Archdiocese of Nairobi pastoral guidelines',
    ],
    contact: 'Parish Office - 020 2495785',
    schedule: 'Wednesday from 8:00 AM to 1:00 PM (Office day)',
    location: "CTK Parish Office (Priest's Office)",
    preparationTime: '8-11 years of formation',
  },
  {
    id: 7,
    title: 'Matrimony',
    subtitle: 'Covenant of Love',
    icon: CheckCircle2,
    image: matrimonyImg,
    about:
      'Matrimony is the sacrament that unites a man and woman in a lifelong covenant of love. Through this sacrament, the couple receives grace to love each other as Christ loves the Church. Marriage is a vocation to holiness and the foundation of family life.',
    meaning:
      'The matrimonial covenant between baptized persons is raised to the dignity of a sacrament. Christ dwells with the married couple, giving them strength to take up their crosses and follow Him. Marriage is ordered to the good of the spouses and the procreation and education of children.',
    howTo: [
      'Contact the parish office 6 months before the wedding',
      'Attend marriage preparation classes',
      'Provide required documents',
      'Choose witnesses (best man and maid of honor)',
    ],
    requirements: [
      'Have to be a man and woman who are legally capable',
      'Both parties must be free to marry',
      'Couples intending to receive must be baptized Catholics unless in mixed marriage',
      'No previous sacramental marriage',
      'Completion of marriage preparation',
      'Baptism card, copy of birth certificate, duly filled prenuptial form, banns, copy of ID etc',
      'For more information, contact the parish office or refer to the Archdiocese of Nairobi pastoral guidelines',
    ],
    contact: 'Parish Office - 020 2495785',
    schedule: 'Sunday classes at 3:00 PM | Weddings by appointment',
    location: 'Main Church',
    preparationTime: '6 months minimum',
  },
];

export default function Sacraments() {
  // Baptism is the default selection.
  const [selectedId, setSelectedId] = useState(SACRAMENTS[0].id);
  const detailRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const selected = SACRAMENTS.find((s) => s.id === selectedId) || SACRAMENTS[0];

  const handleSelect = (id) => {
    setSelectedId(id);
    // Move focus to the detail heading after the state update commits.
    requestAnimationFrame(() => {
      detailRef.current?.focus();
    });
  };

  return (
    <main className="sacraments-page">
      <div className="sacraments-container">
        {/* Page introduction */}
        <header className="sacraments-header">
          <h1 className="sacraments-title">The Seven Sacraments</h1>
          <p className="sacraments-intro">
            The sacraments are the outward signs of inward grace, instituted
            by Christ and entrusted to the Church. Through them we are born
            into new life, strengthened in faith, healed in body and spirit,
            and united in love.
          </p>
        </header>

        {/* Card grid */}
        <ul className="sacrament-grid" role="list">
          {SACRAMENTS.map((sacrament) => {
            const Icon = sacrament.icon;
            const isActive = sacrament.id === selectedId;
            return (
              <li key={sacrament.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(sacrament.id)}
                  aria-pressed={isActive}
                  className={`sacrament-card${isActive ? ' is-active' : ''}`}
                >
                  <div className="sacrament-card__media">
                    <img
                      src={sacrament.image}
                      alt=""
                      loading="lazy"
                    />
                    <div className="sacrament-card__overlay" aria-hidden="true" />
                    <span className="sacrament-card__icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                  </div>
                  <div className="sacrament-card__body">
                    <h2 className="sacrament-card__title">
                      {sacrament.title}
                    </h2>
                    <p className="sacrament-card__subtitle">
                      {sacrament.subtitle}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Detail section */}
        <motion.section
          key={selected.id}
          ref={detailRef}
          tabIndex={-1}
          aria-labelledby="sacrament-detail-title"
          className="sacrament-detail"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Detail header */}
          <header className="sacrament-detail__header">
            <div className="sacrament-detail__title-wrap">
              <span className="sacrament-detail__icon" aria-hidden="true">
                <selected.icon size={26} />
              </span>
              <div>
                <h2
                  id="sacrament-detail-title"
                  className="sacrament-detail__title"
                >
                  {selected.title}
                </h2>
                <p className="sacrament-detail__subtitle">
                  {selected.subtitle}
                </p>
              </div>
            </div>
          </header>

          {/* About */}
          <div className="sacrament-detail__section">
            <h3 className="sacrament-detail__heading">About the Sacrament</h3>
            <p className="sacrament-detail__body">{selected.about}</p>
          </div>

          {/* Meaning */}
          <div className="sacrament-detail__meaning">
            <h3 className="sacrament-detail__heading">
              Meaning & Significance
            </h3>
            <p className="sacrament-detail__body">{selected.meaning}</p>
          </div>

          {/* How to Receive */}
          <div className="sacrament-detail__section">
            <h3 className="sacrament-detail__heading">How to Receive</h3>
            <ol className="sacrament-steps">
              {selected.howTo.map((step, i) => (
                <li key={i} className="sacrament-steps__item">
                  <span
                    className="sacrament-steps__number"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Requirements */}
          <div className="sacrament-detail__section">
            <h3 className="sacrament-detail__heading">Requirements</h3>
            <ul className="sacrament-requirements">
              {selected.requirements.map((req, i) => (
                <li key={i} className="sacrament-requirements__item">
                  <Check
                    size={16}
                    className="sacrament-requirements__icon"
                    aria-hidden="true"
                  />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Schedule */}
          <div className="sacrament-detail__section">
            <h3 className="sacrament-detail__heading">
              Contact & Schedule
            </h3>
            <div className="sacrament-contact-grid">
              <div className="sacrament-contact-card">
                <span className="sacrament-contact-card__icon" aria-hidden="true">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="sacrament-contact-card__label">Contact</p>
                  <p className="sacrament-contact-card__value">
                    {selected.contact}
                  </p>
                </div>
              </div>
              <div className="sacrament-contact-card">
                <span className="sacrament-contact-card__icon" aria-hidden="true">
                  <Calendar size={18} />
                </span>
                <div>
                  <p className="sacrament-contact-card__label">Schedule</p>
                  <p className="sacrament-contact-card__value">
                    {selected.schedule}
                  </p>
                </div>
              </div>
              <div className="sacrament-contact-card">
                <span className="sacrament-contact-card__icon" aria-hidden="true">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="sacrament-contact-card__label">Location</p>
                  <p className="sacrament-contact-card__value">
                    {selected.location}
                  </p>
                </div>
              </div>
              <div className="sacrament-contact-card">
                <span className="sacrament-contact-card__icon" aria-hidden="true">
                  <Clock size={18} />
                </span>
                <div>
                  <p className="sacrament-contact-card__label">
                    Preparation Time
                  </p>
                  <p className="sacrament-contact-card__value">
                    {selected.preparationTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}