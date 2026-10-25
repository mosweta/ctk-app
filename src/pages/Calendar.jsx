import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/apiClient';
import { Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const eventsByDay = {};
  events.forEach(e => {
    const d = new Date(e.start_time);
    if (d.getFullYear() === year && d.getMonth() === month) {
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

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#800000]" size={40} /></div>;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#234a33]">Parish Calendar</h1>
            <p className="text-gray-500">Browse upcoming Masses, meetings, and events</p>
          </div>
          <Link
            to="/events"
            className="px-5 py-2 bg-[#800000] text-white rounded-lg font-semibold hover:bg-[#660000]"
          >
            View Events List
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1e4a2a] text-white p-5 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold">
                {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              {!isCurrentMonth && (
                <button
                  onClick={goToToday}
                  className="text-xs text-white/70 hover:text-white underline mt-1"
                >
                  Back to current month
                </button>
              )}
            </div>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="bg-gray-50 aspect-square" />;
              }

              const isToday = isCurrentMonth && day === today.getDate();
              const dayEvents = eventsByDay[day] || [];
              const hasEvents = dayEvents.length > 0;
              const firstEventTitle = dayEvents[0]?.title || '';

              return (
                <button
                  key={day}
                  onClick={() => hasEvents && setSelectedDate(day)}
                  className={`relative bg-white aspect-square p-1.5 md:p-2 text-left
                              hover:bg-[#800000]/5 transition-colors
                              ${hasEvents ? 'cursor-pointer' : 'cursor-default'}
                              ${isToday ? 'ring-2 ring-inset ring-[#800000]' : ''}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 text-xs md:text-sm font-semibold rounded-full
                      ${isToday ? 'bg-[#800000] text-white' : 'text-gray-700'}`}
                  >
                    {day}
                  </span>
                  {hasEvents && (
                    <>
                      {/* Desktop: show title */}
                      <p className="hidden md:block text-[10px] leading-tight text-[#800000] mt-0.5 line-clamp-2 font-medium">
                        {firstEventTitle}
                      </p>
                      {dayEvents.length > 1 && (
                        <span className="hidden md:inline-block text-[9px] text-gray-400 mt-0.5">
                          +{dayEvents.length - 1} more
                        </span>
                      )}
                      {/* Mobile: dot indicator */}
                      <div className="md:hidden flex justify-center gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((_, idx) => (
                          <span key={idx} className="w-1 h-1 rounded-full bg-[#800000]" />
                        ))}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#800000]" />
            Today
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#800000]" />
            Has events
          </span>
        </div>
      </div>

      {/* Selected day modal */}
      <AnimatePresence>
        {selectedDate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedDate(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-[#234a33]">
                      {new Date(year, month, selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long', month: 'long', day: 'numeric'
                      })}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-5 overflow-y-auto space-y-3">
                  {selectedEvents.map(ev => (
                    <div
                      key={ev.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-[#800000]/30 transition-colors"
                    >
                      <h4 className="font-bold text-[#234a33] mb-2">{ev.title}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Clock size={14} className="text-[#800000]" />
                          {new Date(ev.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {ev.location && (
                          <p className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#800000]" />
                            {ev.location}
                          </p>
                        )}
                      </div>
                      {ev.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{ev.description}</p>
                      )}
                      <Link
                        to={`/events/${ev.id}`}
                        className="text-sm text-[#800000] font-semibold hover:underline mt-2 inline-block"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}