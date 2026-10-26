import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { api } from '../lib/apiClient';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  ExternalLink,
  CalendarPlus,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGoogleCalendarUrl } from '../lib/googleCalendar';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  const shouldReduceMotion = useReducedMotion();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/events');
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    setSelectedDate(null);
  }, [currentDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const eventsByDay = {};
  events.forEach((e) => {
    const d = new Date(e.start_time);
    if (!Number.isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      if (!eventsByDay[key]) eventsByDay[key] = [];
      eventsByDay[key].push(e);
    }
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const selectedEvents = selectedDate ? eventsByDay[selectedDate] || [] : [];

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-heading mb-2">Parish Calendar</h1>
            <p className="text-body">Browse upcoming Masses, meetings, and events</p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View Events List
          </Link>
        </div>

        {/* States & Calendar Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-surface rounded-2xl border border-border gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-muted text-sm">Loading calendar...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-surface rounded-2xl border border-border max-w-2xl mx-auto flex flex-col items-center gap-4">
            <AlertCircle size={40} className="text-danger mb-2" />
            <p className="text-body">We couldn’t load the calendar right now.</p>
            <button
              onClick={loadEvents}
              className="mt-2 px-6 py-2.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            
            {/* Toolbar */}
            <div className="bg-surface-alt/50 p-4 border-b border-border flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} className="text-heading" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Next month"
                >
                  <ChevronRight size={20} className="text-heading" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-heading order-first w-full sm:order-none sm:w-auto text-center">
                {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </h2>

              <button
                onClick={goToToday}
                disabled={isCurrentMonth}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isCurrentMonth
                    ? 'border-border text-muted cursor-not-allowed opacity-50'
                    : 'border-primary text-primary hover:bg-primary-light'
                }`}
              >
                Today
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-surface border-b border-border">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-3 text-center text-xs font-bold text-muted uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-px bg-border">
              {days.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="bg-surface-alt/30 min-h-[80px] sm:min-h-[100px]" />;
                }

                const isToday = isCurrentMonth && day === today.getDate();
                const dayEvents = eventsByDay[day] || [];
                const hasEvents = dayEvents.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => hasEvents && setSelectedDate(day)}
                    className={`relative bg-surface min-h-[80px] sm:min-h-[100px] p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary
                      ${hasEvents ? 'cursor-pointer hover:bg-primary-light/30' : 'cursor-default'}
                      ${isToday ? 'bg-primary-light/10' : ''}
                    `}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-sm font-semibold rounded-full mb-1
                        ${isToday ? 'bg-primary text-white' : 'text-heading'}`}
                    >
                      {day}
                    </span>

                    {hasEvents && (
                      <>
                        <div className="hidden sm:block">
                          <p className="text-[11px] leading-tight text-primary font-medium line-clamp-2">
                            {dayEvents[0].title}
                          </p>
                          {dayEvents.length > 1 && (
                            <span className="text-[10px] text-muted mt-0.5 block font-medium">
                              +{dayEvents.length - 1} more
                            </span>
                          )}
                        </div>
                        <div className="sm:hidden flex gap-1 mt-1">
                          {dayEvents.slice(0, 3).map((_, idx) => (
                            <span key={idx} className="w-1.5 h-1.5 rounded-full bg-primary" />
                          ))}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Legend */}
        {!loading && !error && (
          <div className="flex justify-center gap-8 mt-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              Today
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Has events
            </span>
          </div>
        )}
      </div>

      {/* Selected day modal */}
      <AnimatePresence>
        {selectedDate && (
          <>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedDate(null)}
            />
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              {/* Modal Container */}
              <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[85vh] flex flex-col border border-border overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-start justify-between p-5 sm:p-6 border-b border-border bg-surface-alt/30 shrink-0">
                  <div className="min-w-0 pr-4">
                    <h3 className="text-xl font-bold text-heading break-words">
                      {new Date(year, month, selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <p className="text-sm text-muted mt-2">
                      {selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'} scheduled
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-2 -mr-2 text-muted hover:text-heading hover:bg-surface rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden flex flex-col gap-4">
                  {selectedEvents.map((ev) => {
                    const gCalUrl = getGoogleCalendarUrl(ev);
                    
                    return (
                      <div 
                        key={ev.id} 
                        className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors w-full flex flex-col"
                      >
                        {/* Time */}
                        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                          {new Date(ev.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          {ev.end_time && ` – ${new Date(ev.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                        </span>

                        {/* Title */}
                        <h4 className="font-bold text-heading text-lg leading-snug break-words [overflow-wrap:anywhere] mb-3">
                          {ev.title}
                        </h4>

                        {/* Location */}
                        {ev.location && (
                          <div className="flex items-start gap-1.5 text-sm text-muted mb-3">
                            <MapPin size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                            <span className="break-words [overflow-wrap:anywhere]">
                              {ev.location}
                            </span>
                          </div>
                        )}

                        {/* Description */}
                        {ev.description && (
                          <p className="text-sm text-body leading-relaxed break-words [overflow-wrap:anywhere] mb-5">
                            {ev.description}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-auto pt-5 border-t border-border/50">
                          <Link
                            to={`/events/${ev.id}`}
                            className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                          >
                            View Details
                            <ExternalLink size={14} aria-hidden="true" />
                          </Link>
                          
                          {gCalUrl && (
                            <a
                              href={gCalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-muted font-medium hover:text-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                            >
                              <CalendarPlus size={16} aria-hidden="true" />
                              Add to Calendar
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}