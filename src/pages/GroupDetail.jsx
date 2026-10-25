import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/apiClient';
import { Loader2, ArrowLeft, MapPin, Calendar, User, Phone, Users } from 'lucide-react';

export default function GroupDetail() {
  const { slug } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // We will add this endpoint to the backend next
        const res = await api.get(`/groups/${slug}`);
        setGroup(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#800000]" size={40} /></div>;
  if (error || !group) return <div className="text-center py-32 text-red-600">{error || 'Group not found'}</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <div className="relative h-64 md:h-96 bg-[#1e4a2a] overflow-hidden">
        {group.image_url && <img src={group.image_url} alt={group.name} className="w-full h-full object-cover opacity-40" />}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <Link to="/get-involved" className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Groups
          </Link>
          <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">{group.category}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{group.name}</h1>
          {group.patron_saint && <p className="text-white/80 text-lg">{group.patron_saint}</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 grid md:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#234a33] mb-3">About this Group</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {group.long_description || group.short_description || 'No description available.'}
              </div>
            </section>
            {group.founded_year && (
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Founded</h3>
                <p className="text-xl font-semibold text-[#234a33]">{group.founded_year}</p>
              </section>
            )}
          </div>

          {/* Sidebar Meta */}
          <div className="space-y-6 bg-gray-50 rounded-xl p-6 h-fit">
            <h3 className="font-bold text-gray-800 border-b pb-2">Meeting Details</h3>
            <ul className="space-y-3 text-sm">
              {group.meeting_day && <li className="flex items-start gap-3"><Calendar size={18} className="text-[#800000] mt-0.5" /> <span>{group.meeting_day} {group.meeting_time}</span></li>}
              {group.meeting_location && <li className="flex items-start gap-3"><MapPin size={18} className="text-[#800000] mt-0.5" /> <span>{group.meeting_location}</span></li>}
            </ul>

            {(group.coordinator_name || group.coordinator_contact) && (
              <>
                <h3 className="font-bold text-gray-800 border-b pb-2">Contact</h3>
                <ul className="space-y-3 text-sm">
                  {group.coordinator_name && <li className="flex items-start gap-3"><User size={18} className="text-[#800000] mt-0.5" /> <span>{group.coordinator_name}</span></li>}
                  {group.coordinator_contact && <li className="flex items-start gap-3"><Phone size={18} className="text-[#800000] mt-0.5" /> <span>{group.coordinator_contact}</span></li>}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}