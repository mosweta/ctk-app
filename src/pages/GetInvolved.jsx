import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/apiClient';
import { Loader2, Users, MapPin, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GetInvolved() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/groups');
        setGroups(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = filter === 'all' ? groups : groups.filter(g => g.category === filter);

  const categories = [
    { key: 'all', label: 'All Groups' },
    { key: 'jumuiya', label: 'Jumuiyas' },
    { key: 'ecclesial', label: 'Ecclesial Groups' },
    { key: 'choir', label: 'Choirs' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#234a33] mb-2">Get Involved</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Find your community within the parish. Join a Jumuiya, Choir, or Ministry.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === cat.key
                  ? 'bg-[#800000] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#800000]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#800000] animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No groups found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
              >
                {/* Image / Fallback */}
                <div className="aspect-[16/9] bg-[#1e4a2a] relative overflow-hidden">
                  {group.image_url ? (
                    <img src={group.image_url} alt={group.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="text-white/20" size={64} />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 bg-white/95 text-[#800000] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {group.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#234a33] mb-1">{group.name}</h3>
                  {group.patron_saint && <p className="text-sm text-[#800000] font-medium mb-3">{group.patron_saint}</p>}
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                    {group.short_description || 'A welcoming community within our parish.'}
                  </p>

                  {/* Meta */}
                  <div className="space-y-1.5 mb-4 text-sm text-gray-500">
                    {group.meeting_day && (
                      <p className="flex items-center gap-2"><Calendar size={14} className="text-[#800000]" /> {group.meeting_day} {group.meeting_time}</p>
                    )}
                    {group.meeting_location && (
                      <p className="flex items-center gap-2"><MapPin size={14} className="text-[#800000]" /> {group.meeting_location}</p>
                    )}
                    {group.coordinator_name && (
                      <p className="flex items-center gap-2"><User size={14} className="text-[#800000]" /> {group.coordinator_name}</p>
                    )}
                  </div>

                  <Link
                    to={`/groups/${group.slug}`}
                    className="text-[#800000] font-semibold text-sm hover:underline mt-auto"
                  >
                    Learn More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}