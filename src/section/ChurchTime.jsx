/**
 * ChurchTime — homepage "Service Times" section.
 *
 * Renders Mass, Confession, Adoration, and Rosary as an accessible
 * ARIA tablist. Each tab reveals a card listing the days and times for
 * that service.
 *
 * Also used by /mass-times, /adoration, and /confession via the
 * `showOnly` prop. When `showOnly` is set, that service is the initial
 * tab. The component still allows switching tabs after mount, matching
 * the pre-existing behavior on those routes.
 *
 * Theming:
 *   All colors come from semantic tokens in src/index.css. Because
 *   those tokens redefine themselves under .dark, light and dark mode
 *   are handled by the existing theme system — this component does
 *   not read the theme, listen for changes, or hold theme state.
 *
 * Reduced motion:
 *   useReducedMotion() disables Framer Motion animations for users
 *   who set prefers-reduced-motion. The CSS guards its transitions
 *   under the same preference.
 */

import { useCallback, useRef } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FiClock, FiCalendar, FiHeart } from 'react-icons/fi';
import { Cross } from 'lucide-react';
import './ChurchTime.css';

/**
 * Service data.
 *
 * `days` is a list of { day, times } entries. `times` is an array of
 * strings, so each schedule is a discrete item — no comma-splitting
 * during render.
 *
 * DO NOT modify names, days, or times without verifying against the
 * parish bulletin.
 */
const SERVICES = {
  mass: {
    label: 'Mass',
    panelTitle: 'Mass Times',
    Icon: FiClock,
    days: [
      {
        day: 'Sunday (CTK)',
        times: [
          '1st: 7:00 AM - 9:00 AM',
          '2nd: 9:00 AM - 11:00 AM',
          '3rd: 11:00 AM - 1:00 PM',
          '4th: 1:00 PM - 3:00 PM',
        ],
      },
      {
        day: 'Sunday (SJTE)',
        times: ['1st: 8:00 AM - 10:00 AM', '2nd: 10:00 AM - 12:00 PM'],
      },
      {
        day: 'Monday - Saturday',
        times: ['7:00 AM (CTK)'],
      },
    ],
  },
  confession: {
    label: 'Confession',
    panelTitle: 'Confession Times',
    Icon: Cross,
    days: [{ day: 'Saturday', times: ['4:00 PM - 5:30 PM'] }],
  },
  adoration: {
    label: 'Adoration',
    panelTitle: 'Adoration Times',
    Icon: FiHeart,
    days: [{ day: 'Last Thursday', times: ['7:00 PM - 8:30 PM'] }],
  },
  rosary: {
    label: 'Rosary',
    panelTitle: 'Rosary Times',
    Icon: Cross,
    days: [{ day: 'Monday - Saturday', times: ['6:25 AM - 7:00 AM'] }],
  },
};

/** Stable tab order. Keys must match entries in SERVICES. */
const SERVICE_ORDER = ['mass', 'confession', 'adoration', 'rosary'];

export default function ChurchTime({ showOnly }) {
  // `showOnly` seeds the initial tab; validated so a stale or mistyped
  // value cannot break rendering.
  const initialTab = SERVICES[showOnly] ? showOnly : 'mass';
  const [activeTab, setActiveTab] = useState(initialTab);

  const shouldReduceMotion = useReducedMotion();
  const activeService = SERVICES[activeTab];

  // Refs to tab buttons so arrow navigation can move focus without a
  // global id lookup.
  const tabRefs = useRef({});

  /**
   * WAI-ARIA tabs keyboard behavior:
   *   ArrowRight / ArrowLeft cycle focus and selection.
   *   Home / End jump to first / last.
   *   Enter / Space are handled by the browser's native button click.
   */
  const onTabKeyDown = useCallback(
    (e, index) => {
      const count = SERVICE_ORDER.length;
      let nextIndex = null;

      if (e.key === 'ArrowRight') nextIndex = (index + 1) % count;
      else if (e.key === 'ArrowLeft')
        nextIndex = (index - 1 + count) % count;
      else if (e.key === 'Home') nextIndex = 0;
      else if (e.key === 'End') nextIndex = count - 1;

      if (nextIndex === null) return;

      e.preventDefault();
      const nextKey = SERVICE_ORDER[nextIndex];
      setActiveTab(nextKey);
      tabRefs.current[nextKey]?.focus();
    },
    []
  );

  return (
    <section id="church-time" className="home-church-time">
      <div className="home-church-time__container">
        {/* Header */}
        <motion.div
          className="home-church-time__header"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="home-church-time__title">Service Times</h2>
          <p className="home-church-time__subtitle">
            Join us for prayer and worship throughout the week
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="home-church-time__tabs"
          role="tablist"
          aria-label="Select a service"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SERVICE_ORDER.map((key, index) => {
            const { label, Icon } = SERVICES[key];
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                ref={(el) => {
                  tabRefs.current[key] = el;
                }}
                id={`church-time-tab-${key}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`church-time-panel-${key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(key)}
                onKeyDown={(e) => onTabKeyDown(e, index)}
                className={`home-church-time__tab${
                  isActive ? ' home-church-time__tab--active' : ''
                }`}
              >
                <span className="home-church-time__tab-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Panel */}
        <motion.div
          className="home-church-time__content"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={`church-time-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`church-time-tab-${activeTab}`}
              tabIndex={0}
              className="home-church-time__card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="home-church-time__card-header">
                <span className="home-church-time__card-icon">
                  <activeService.Icon aria-hidden="true" />
                </span>
                <h3 className="home-church-time__card-title">
                  {activeService.panelTitle}
                </h3>
              </div>

              <ul className="home-church-time__list">
                {activeService.days.map((entry) => (
                  <li key={entry.day} className="home-church-time__row">
                    <div className="home-church-time__day">
                      <FiCalendar
                        className="home-church-time__day-icon"
                        aria-hidden="true"
                      />
                      <span>{entry.day}</span>
                    </div>
                    <div className="home-church-time__times">
                      {entry.times.map((time) => (
                        <span
                          key={time}
                          className="home-church-time__time-badge"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}