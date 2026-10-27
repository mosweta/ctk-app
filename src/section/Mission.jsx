/**
 * Mission — homepage "Mission & Vision" section.
 *
 * Renders the parish's mission, vision, and four core values alongside
 * the Grotto image.
 *
 * Theming:
 *   All colors come from semantic tokens in src/index.css. Because
 *   those tokens redefine themselves under .dark, light and dark mode
 *   are handled automatically — this component does not read the theme
 *   or hold theme state.
 *
 * Motion:
 *   Framer Motion is used for the entrance animations and the two
 *   mission/vision card hover lifts. useReducedMotion() disables both
 *   for users who set prefers-reduced-motion.
 *
 * Content:
 *   The mission statement, vision statement, core values, and their
 *   descriptions are preserved verbatim. The image alt text and
 *   caption were corrected from "Groto" to "Grotto" — a grotto is a
 *   small cave or cave-like structure, which matches the image.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Cross, Heart, Users, Anchor } from 'lucide-react';
import Groto from '../assets/Groto.webp';
import './Mission.css';

/**
 * Core values. `value` is used as the React key because the four
 * names are unique and stable. Adding/removing a value is a
 * content change, not an index change.
 */
const CORE_VALUES = [
  {
    Icon: Users,
    value: 'Inclusivity',
    description: "Welcoming all to God's family",
  },
  {
    Icon: Heart,
    value: 'Servant Leadership',
    description: 'Leading through service',
  },
  {
    Icon: Cross,
    value: 'Shared Responsibility',
    description: "Together in Christ's mission",
  },
  {
    Icon: Anchor,
    value: 'Eucharistic Living',
    description: "Living in Christ's presence",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export default function Mission() {
  const shouldReduceMotion = useReducedMotion();

  // When reduced motion is preferred, skip the entrance animation and
  // hover lift but keep the layout and content identical.
  const sectionInitial = shouldReduceMotion ? false : 'hidden';
  const sectionVariants = shouldReduceMotion ? undefined : staggerContainer;
  const childVariants = shouldReduceMotion ? undefined : fadeInUp;
  const cardHover = shouldReduceMotion ? undefined : { y: -5 };

  return (
    <motion.section
      className="mission-section"
      initial={sectionInitial}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: '-50px' }}
      variants={sectionVariants}
    >
      <div className="mission-container">
        {/* Header */}
        <motion.div className="mission-header" variants={childVariants}>
          <h2 className="mission-title">Mission &amp; Vision</h2>
          <p className="mission-subtitle">Guided by faith, united in love</p>
        </motion.div>

        <div className="mission-grid">
          {/* Grotto image */}
          <motion.figure
            className="mission-media"
            variants={childVariants}
          >
            <div className="mission-media__frame">
              <div className="mission-media__border" aria-hidden="true" />
              <img
                src={Groto}
                alt="Grotto of Our Lady"
                className="mission-media__image"
                loading="lazy"
              />
              <figcaption className="mission-media__caption">
                Grotto of Our Lady
              </figcaption>
            </div>
          </motion.figure>

          {/* Content */}
          <div className="mission-content">
            {/* Mission card */}
            <motion.article
              className="mission-card"
              variants={childVariants}
              whileHover={cardHover}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="mission-card__icon" aria-hidden="true">
                <Cross size={20} />
              </div>
              <div className="mission-card__body">
                <h3 className="mission-card__title">Our Mission</h3>
                <p className="mission-card__text">
                  To love God and humanity, teaching the Gospel values,
                  spreading joy and showing compassion to all
                </p>
              </div>
            </motion.article>

            {/* Vision card */}
            <motion.article
              className="mission-card"
              variants={childVariants}
              whileHover={cardHover}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="mission-card__icon" aria-hidden="true">
                <Anchor size={20} />
              </div>
              <div className="mission-card__body">
                <h3 className="mission-card__title">Our Vision</h3>
                <p className="mission-card__text">
                  A Christ centered parish where faith grows, worship
                  inspires and service transforms lives.
                </p>
              </div>
            </motion.article>

            {/* Core values */}
            <motion.div className="mission-values" variants={childVariants}>
              <div className="mission-values__header">
                <Heart
                  size={20}
                  className="mission-values__header-icon"
                  aria-hidden="true"
                />
                <h3 className="mission-values__title">Core Values</h3>
              </div>

              <ul className="mission-values__grid">
                {CORE_VALUES.map(({ Icon, value, description }) => (
                  <li key={value} className="mission-value">
                    <span className="mission-value__icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <div className="mission-value__body">
                      <strong className="mission-value__name">{value}</strong>
                      <span className="mission-value__description">
                        {description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}