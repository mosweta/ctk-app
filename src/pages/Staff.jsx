import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { api } from '../lib/apiClient';
import { Loader2, User, AlertCircle } from 'lucide-react';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/staff');
      setStaff(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load staff directory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const containerVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      };

  const itemVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={40} aria-hidden="true" />
        <p className="text-muted text-sm">Loading staff directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle size={40} className="text-danger mb-4" />
        <p className="text-body mb-6">{error}</p>
        <button
          onClick={loadStaff}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-heading mb-3">
            Our Staff
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            The people who serve our parish community
          </p>
        </div>

        {/* Content */}
        {staff.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border max-w-2xl mx-auto">
            <User size={48} className="mx-auto text-muted mb-4" aria-hidden="true" />
            <p className="text-body">
              Staff information will be available soon.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            variants={containerVariants}
          >
            {staff.map((member) => {
              // Only show the photo if the flag is true AND there's a URL
              const showPhoto = member.show_photo && member.image_url;

              return (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  className="bg-surface rounded-2xl shadow-sm border border-border
                             p-8 text-center flex flex-col items-center
                             hover:shadow-lg transition-shadow duration-300"
                >
                  {/* 
                    Photo/Fallback container. 
                    We use a small inline component to handle image loading errors 
                    so a broken URL falls back to the icon gracefully.
                  */}
                  <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-6
                                  border-4 border-primary shadow-md flex items-center justify-center
                                  bg-primary-light relative shrink-0">
                    {showPhoto ? (
                      <StaffImage 
                        src={member.image_url} 
                        alt={`Portrait of ${member.name}`} 
                      />
                    ) : (
                      <User size={56} className="text-primary/50" aria-hidden="true" />
                    )}
                  </div>

                  {/* Title & Name */}
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {member.title}
                  </h3>
                  <h4 className="text-lg font-semibold text-heading mb-4 pb-3
                                 border-b border-border w-full">
                    {member.name}
                  </h4>

                  {/* Description */}
                  {member.description && (
                    <p className="text-sm text-body leading-relaxed mt-auto">
                      {member.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </main>
  );
}

/**
 * A safe image component that falls back to the User icon if the 
 * image URL is broken or fails to load.
 */
function StaffImage({ src, alt }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <User size={56} className="text-primary/50" aria-hidden="true" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}