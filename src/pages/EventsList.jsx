/**
 * Events List (public).
 *
 * Displays all upcoming published events as a card grid. Each card
 * shows the event image (or fallback), date badge, title, time, and
 * location, with a "Learn More" link to the detail page.
 *
 * Data is fetched from GET /api/events?upcoming=true. Loading, error,
 * and empty states use the shared UI components.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { api } from '../lib/apiClient';
import {
  PageHeader,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../components/ui';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/events?upcoming=true');
        setEvents(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
                     bg-white text-primary font-semibold
                     hover:bg-white/90 transition-colors
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-white focus-visible:ring-offset-2
                     focus-visible:ring-offset-primary"
        >
          <Calendar size={18} />
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
            onRetry={() => window.location.reload()}
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming events"
            message="There are no events scheduled at the moment. Please check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-hover overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="aspect-video bg-base relative overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover
                                 transition-transform duration-300
                                 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar size={48} className="text-white/30" />
                    </div>
                  )}
                  {/* Date badge */}
                  <div className="absolute top-3 right-3 bg-surface text-primary
                                  rounded-lg px-3 py-1 text-center shadow-md">
                    <p className="text-xs font-bold uppercase leading-none mb-0.5">
                      {new Date(event.start_time).toLocaleString('en-US', {
                        month: 'short',
                      })}
                    </p>
                    <p className="text-xl font-bold leading-none">
                      {new Date(event.start_time).getDate()}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-heading mb-3 line-clamp-2">
                    {event.title}
                  </h2>

                  <div className="space-y-2 text-sm text-body mb-4">
                    <p className="flex items-center gap-2">
                      <Clock size={15} className="text-primary shrink-0" />
                      {new Date(event.start_time).toLocaleString('en-US', {
                        weekday: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {event.location && (
                      <p className="flex items-center gap-2">
                        <MapPin size={15} className="text-primary shrink-0" />
                        {event.location}
                      </p>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-4">
                      {event.description}
                    </p>
                  )}

                  <Link
                    to={`/events/${event.id}`}
                    className="mt-auto inline-flex items-center gap-1
                               text-primary font-semibold text-sm
                               hover:underline"
                  >
                    Learn More →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}