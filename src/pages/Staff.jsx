import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/apiClient';
import { Loader2, User } from 'lucide-react';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/staff')
      .then(res => setStaff(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#800000]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#234a33] mb-2">
            Our Staff
          </h1>
          <p className="text-gray-500">
            The people who serve our parish community
          </p>
        </div>

        {staff.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            Staff information will be available soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((member, i) => {
              const showPhoto = member.show_photo && member.image_url;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100
                             p-8 text-center flex flex-col items-center
                             hover:shadow-lg hover:-translate-y-1
                             transition-all duration-300"
                >
                  {/* Photo or fallback avatar — centered, circular, bordered */}
                  <div
                    className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-5
                               border-4 border-[#800000] shadow-lg
                               flex items-center justify-center
                               bg-[#800000]/10"
                  >
                    {showPhoto ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <User size={56} className="text-[#800000]/50" />
                    )}
                  </div>

                  {/* Title above name, matching original design */}
                  <h3 className="text-xl font-bold text-[#800000] mb-1">
                    {member.title}
                  </h3>
                  <h4 className="text-lg font-semibold text-[#234a33] mb-4 pb-3
                                 border-b border-gray-200 w-full">
                    {member.name}
                  </h4>

                  {member.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {member.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}