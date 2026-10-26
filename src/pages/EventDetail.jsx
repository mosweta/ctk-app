import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/apiClient';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CalendarPlus,
} from 'lucide-react';
import { getGoogleCalendarUrl } from '../lib/googleCalendar';

function formatFullDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Date TBA';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Time TBA';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Reset state and fetch when ID changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setEvent(null);
    setError('');

    api.get(`/events/${id}`)
      .then((res) => {
        if (!cancelled) setEvent(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Event not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted text-sm">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-background text-center">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-6">
          <AlertCircle size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-heading mb-2">
          Event Not Found
        </h2>
        <p className="text-body mb-8 max-w-md">
          {error || "We couldn't find the event you're looking for. It may have been removed or the link is incorrect."}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Events
        </Link>
      </div>
    );
  }

  // Determine event status (past vs upcoming)
  const now = new Date();
  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;
  
  let isPast = false;
  if (!Number.isNaN(startDate.getTime())) {
    isPast = endDate && !Number.isNaN(endDate.getTime())
      ? now > endDate
      : now > new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
  }

  // Generate Google Calendar link
  const gCalUrl = getGoogleCalendarUrl(event);

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[320px] max-h-[480px] bg-base overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-base">
            <Calendar size={80} className="text-white/10" aria-hidden="true" />
          </div>
        )}
        
        {/* Gradient overlay for robust text contrast on any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6">
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-semibold bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back to Events
            </Link>
          </div>

          {isPast && (
            <span className="inline-block bg-danger text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm">
              Past Event
            </span>
          )}
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white max-w-5xl drop-shadow-md leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content - No Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-8 pb-10 border-b border-border">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center shrink-0">
              <Calendar size={22} className="text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase font-bold tracking-wider mb-1">Date</p>
              <p className="text-base font-semibold text-heading">
                {formatFullDate(event.start_time)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center shrink-0">
              <Clock size={22} className="text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase font-bold tracking-wider mb-1">Time</p>
              <p className="text-base font-semibold text-heading">
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center shrink-0">
                <MapPin size={22} className="text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-muted uppercase font-bold tracking-wider mb-1">Location</p>
                <p className="text-base font-semibold text-heading">
                  {event.location}
                </p>
              </div>
            </div>
          )}

          {/* Add to Calendar Action */}
          {gCalUrl && (
            <div className="flex items-center md:justify-end sm:col-span-2 md:col-span-1">
              <a
                href={gCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full md:w-auto justify-center"
              >
                <CalendarPlus size={18} aria-hidden="true" />
                Add to Calendar
              </a>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="py-10">
          <h2 className="text-2xl font-bold text-heading mb-6">
            About This Event
          </h2>
          
          {event.description ? (
            <div className="prose max-w-4xl text-body leading-relaxed text-lg whitespace-pre-line">
              {event.description}
            </div>
          ) : (
            <p className="text-muted italic">
              No further details are available for this event.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}