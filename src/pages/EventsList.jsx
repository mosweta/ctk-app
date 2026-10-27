/**
 * Events List (public).
 *
 * Displays all upcoming published events as a card grid. Each card
 * shows the event image (or fallback), date badge, title, time, and
 * location, with a "Details" link to the detail page.
 *
 * This component uses the `.events__*` CSS classes from Event.css to
 * ensure the cards are visually identical to the homepage section.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { api } from '../lib/apiClient';
import {
  PageHeader,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../components/ui';
import '../section/Event.css'; // Import the homepage event styles

function formatTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Time TBA';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatBadge(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { month: 'TBA', day: '?' };
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate(),
  };
}

function eventAlt(event) {
  const d = new Date(event.start_time);
  const dateStr = Number.isNaN(d.getTime())
    ? 'Date TBA'
    : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return event.title ? `${event.title} — ${dateStr}` : `Event on ${dateStr}`;
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shouldReduceMotion = useReducedMotion();


  // Shared API request — does not update React state.
  async function fetchUpcomingEvents() {
    const res = await api.get('/events?upcoming=true');
    return Array.isArray(res.data) ? res.data : [];
  }

  // Used when the user manually retries after an error.
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUpcomingEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch: state updates happen in asynchronous callbacks.
  useEffect(() => {
    let cancelled = false;

    fetchUpcomingEvents()
      .then((data) => {
        if (!cancelled) {
          setEvents(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load events');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);


  const containerVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
      };

  const itemVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      };

  return (
    <main className="min-h-screen bg-background pb-16">
      <PageHeader
        eyebrow="Events"
        title="Upcoming Events"
        subtitle="Join us for fellowship, worship, and celebration"
      >
        <Link
          to="/calendar"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                     bg-surface text-primary font-semibold shadow-sm
                     hover:bg-surface/90 transition-colors
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-white focus-visible:ring-offset-2
                     focus-visible:ring-offset-primary"
        >
          <Calendar size={18} aria-hidden="true" />
          View Calendar
        </Link>
      </PageHeader>

      <div className="container-page py-12">
        {loading ? (
          <LoadingState message="Loading events..." />
        ) : error ? (
          <ErrorState
            title="Could not load events"
            message={error}
            onRetry={loadEvents}
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming events"
            message="There are no events scheduled at the moment. Please check back soon."
          />
        ) : (
          <motion.ul
            className="events__grid"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            variants={containerVariants}
          >
            {events.map((event) => {
              const badge = formatBadge(event.start_time);

              return (
                <motion.li
                  key={event.id || `${event.title}-${event.start_time}`}
                  className="events__card"
                  variants={itemVariants}
                >
                  <div className="events__card-media">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={eventAlt(event)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="events__card-fallback" aria-hidden="true">
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
        )}
      </div>
    </main>
  );
}