/**
 * Event — homepage "Upcoming Events" section.
 *
 * Static, responsive grid of the nearest upcoming events. No featured
 * panel, no carousel, no autoplay.
 *
 * API contract:
 *   GET /api/events?upcoming=true returns published events with
 *   start_time >= now, ordered ascending by start_time. This matches
 *   what EventsList.jsx already uses.
 *
 * Theming:
 *   All colors come from semantic tokens in src/index.css. Light and
 *   dark mode are handled by the existing .dark class on <html>.
 *
 * Motion:
 *   useReducedMotion() disables the Framer Motion entrance animation
 *   for users who set prefers-reduced-motion.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import './Event.css';

/** Number of events shown on the homepage. */
const GRID_LIMIT = 3;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatBadge(iso) {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate(),
  };
}

function eventAlt(event) {
  const date = formatDate(event.start_time);
  return event.title ? `${event.title} — ${date}` : `Event on ${date}`;
}

export default function Event() {
  const { data, loading, error, refetch } = useApi(
    '/events?upcoming=true'
  );
  const shouldReduceMotion = useReducedMotion();

  // Defensive: the hook may return anything in `data`. Only an array
  // is usable here.
  const events = Array.isArray(data)
    ? data.filter((e) => e && e.start_time && e.title)
    : [];

  // Slice to the homepage limit. No featured exclusion needed since
  // there is no featured panel anymore.
  const visibleEvents = events.slice(0, GRID_LIMIT);

  const container = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.4, staggerChildren: 0.08 },
        },
      };
  const child = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      };

  return (
    <motion.section
      className="events"
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={container}
    >
      <div className="events__container">
        <motion.div className="events__header" variants={child}>
          <h2 className="events__title">Upcoming Events</h2>
          <p className="events__subtitle">
            Join us in fellowship and celebration
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="events__state" role="status" aria-live="polite">
            <Loader2
              className="events__spinner"
              size={40}
              aria-hidden="true"
            />
            <p className="events__state-text">Loading events…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="events__state" role="alert">
            <p className="events__state-text">
              We couldn’t load events right now. Please try again.
            </p>
            <button
              type="button"
              className="events__retry"
              onClick={refetch}
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <div className="events__state">
            <Calendar
              size={48}
              className="events__state-icon"
              aria-hidden="true"
            />
            <p className="events__state-text">
              No events are scheduled at the moment. Please check back
              soon.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && visibleEvents.length > 0 && (
          <>
            <motion.ul className="events__grid" variants={child}>
              {visibleEvents.map((event) => {
                const badge = formatBadge(event.start_time);
                return (
                  <motion.li
                    key={event.id || `${event.title}-${event.start_time}`}
                    className="events__card"
                    variants={child}
                  >
                    <div className="events__card-media">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={eventAlt(event)}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="events__card-fallback"
                          aria-hidden="true"
                        >
                          <Calendar size={40} />
                        </div>
                      )}
                      <div className="events__card-badge">
                        <span className="events__card-badge-month">
                          {badge.month}
                        </span>
                        <span className="events__card-badge-day">
                          {badge.day}
                        </span>
                      </div>
                    </div>
                    <div className="events__card-body">
                      <h3 className="events__card-title">
                        {event.title}
                      </h3>
                      <p className="events__card-meta">
                        <Clock size={14} aria-hidden="true" />
                        {formatTime(event.start_time)}
                      </p>
                      {event.location && (
                        <p className="events__card-meta">
                          <MapPin size={14} aria-hidden="true" />
                          {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="events__card-description">
                          {event.description}
                        </p>
                      )}
                      <Link
                        to={`/events/${event.id}`}
                        className="events__card-link"
                      >
                        Details
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="events__footer">
              <Link to="/events" className="events__view-all">
                View all events
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
}