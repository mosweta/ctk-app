import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { api } from '../lib/apiClient';
import { Loader2, Users, MapPin, Calendar, User, AlertCircle, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GetInvolved() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/groups');
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const categories = [
    { key: 'all', label: 'All Groups' },
    { key: 'jumuiya', label: 'Jumuiyas' },
    { key: 'ecclesial', label: 'Ecclesial Groups' },
    { key: 'choir', label: 'Choirs' },
  ];

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchesCategory = filter === 'all' || group.category === filter;
      if (!matchesCategory) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const searchableText = [
        group.name,
        group.patron_saint,
        group.short_description,
        group.meeting_location,
        group.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(q);
    });
  }, [groups, filter, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilter('all');
  };

  const containerVariants = shouldReduceMotion
    ? undefined
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  
  const itemVariants = shouldReduceMotion
    ? undefined
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Centered Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-heading mb-3">Get Involved</h1>
          <p className="text-body max-w-2xl mx-auto">
            Find your community within the parish. Join a Jumuiya, Choir, or Ministry.
          </p>
        </div>

        {/* Search & Filters (No surrounding container) */}
        <div className="max-w-3xl mx-auto mb-12">
          
          {/* Unified Search Field */}
          <div className="relative flex items-center bg-surface rounded-full border border-border shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all text-left">
            <div className="pl-4 sm:pl-5 pr-2 text-muted">
              <Search size={20} aria-hidden="true" />
            </div>
            
            <label htmlFor="group-search" className="sr-only">
              Search groups
            </label>
            <input
              id="group-search"
              type="text"
              placeholder="St Giovanni"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent py-3.5 pr-2 text-heading placeholder:text-muted focus:outline-none text-sm sm:text-base min-w-0"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="pr-4 sm:pr-5 text-muted hover:text-heading transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>
          
          <p className="text-sm text-muted mt-3 text-center">
            Search by group name, patron saint, description, or meeting location.
          </p>

          {/* Centered Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  filter === cat.key
                    ? 'bg-surface text-heading border border-border shadow-sm'
                    : 'bg-transparent text-muted border border-transparent hover:text-heading hover:bg-surface'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* States & Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-surface rounded-2xl border border-border gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-muted text-sm">Loading groups...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-surface rounded-2xl border border-border max-w-2xl mx-auto flex flex-col items-center gap-4">
            <AlertCircle size={40} className="text-danger mb-2" />
            <p className="text-body">We couldn't load the groups right now.</p>
            <button
              onClick={loadGroups}
              className="mt-2 px-6 py-2.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-24 bg-surface rounded-2xl border border-border max-w-2xl mx-auto">
            <Users size={48} className="mx-auto text-muted mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-heading mb-2">No groups found</h3>
            <p className="text-body mb-6">
              We couldn't find any groups matching your search or filter criteria.
            </p>
            {(searchQuery || filter !== 'all') && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors"
              >
                Clear filters and search
              </button>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            variants={containerVariants}
          >
            {filteredGroups.map((group) => {
              return (
                <motion.div
                  key={group.id}
                  variants={itemVariants}
                  className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all flex flex-col group text-left"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-base relative overflow-hidden shrink-0">
                    {group.image_url ? (
                      <img 
                        src={group.image_url} 
                        alt={group.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="text-white/20" size={64} aria-hidden="true" />
                      </div>
                    )}
                    <span className="absolute top-4 right-4 bg-surface/95 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      {group.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col min-w-0">
                    <h3 className="text-xl font-bold text-heading mb-1 leading-snug">
                      {group.name}
                    </h3>
                    {group.patron_saint && (
                      <p className="text-sm text-primary font-medium mb-3">
                        {group.patron_saint}
                      </p>
                    )}
                    
                    <p className="text-body text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                      {group.short_description || 'A welcoming community within our parish.'}
                    </p>

                    {/* Meta */}
                    <div className="space-y-2 mb-6 text-sm text-muted">
                      {group.meeting_day && (
                        <p className="flex items-start gap-2">
                          <Calendar size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" /> 
                          <span className="line-clamp-1">{group.meeting_day} {group.meeting_time}</span>
                        </p>
                      )}
                      {group.meeting_location && (
                        <p className="flex items-start gap-2">
                          <MapPin size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" /> 
                          <span className="line-clamp-1">{group.meeting_location}</span>
                        </p>
                      )}
                      {group.coordinator_name && (
                        <p className="flex items-start gap-2">
                          <User size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" /> 
                          <span className="line-clamp-1">{group.coordinator_name}</span>
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center mt-auto pt-4 border-t border-border/50">
                      <Link
                        to={`/groups/${group.slug}`}
                        className="text-primary font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </main>
  );
}