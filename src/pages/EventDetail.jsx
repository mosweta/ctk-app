import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/apiClient';
import { Loader2, ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#800000]" size={40} /></div>;
  if (error || !event) return (
    <div className="text-center py-32 px-4">
      <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
      <Link to="/events" className="text-[#800000] font-semibold hover:underline">← Back to events</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-[#1e4a2a] overflow-hidden">
        {event.image_url && <img src={event.image_url} alt="" className="w-full h-full object-cover opacity-40" />}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <Link to="/events" className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Events
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 relative">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 mb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#800000]/10 flex items-center justify-center">
                <Calendar size={20} className="text-[#800000]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                <p className="text-sm font-medium text-[#234a33]">
                  {new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#800000]/10 flex items-center justify-center">
                <Clock size={20} className="text-[#800000]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Time</p>
                <p className="text-sm font-medium text-[#234a33]">
                  {new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                </p>
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#800000]/10 flex items-center justify-center">
                  <MapPin size={20} className="text-[#800000]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                  <p className="text-sm font-medium text-[#234a33]">{event.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description || 'No further details available.'}
          </div>
        </div>
      </div>
    </main>
  );
}