/**
 * Livestream Section (public).
 *
 * Fetches published livestreams from the backend and renders them as
 * a grid of clickable cards. Clicking opens the video in a standard
 * YouTube iframe with native controls.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/apiClient';
import { FiYoutube, FiCalendar, FiEye, FiArrowLeft } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';

const slideUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Livestream() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    api
      .get('/livestreams')
      .then((res) => setVideos(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.section
      className="bg-background py-16 md:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" variants={slideUpVariants}>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-light text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
            <FiYoutube className="w-3.5 h-3.5" />
            Livestreams
          </span>
          <h2 className="section-heading">Catch Up on Recent Masses</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Watch recordings of recent Masses and special celebrations from
            Christ the King Parish.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted">Loading livestreams...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border max-w-2xl mx-auto">
            <FiYoutube size={48} className="mx-auto text-muted mb-4" />
            <p className="text-muted">No livestreams have been published yet.</p>
          </div>
        ) : selectedVideo ? (
          <motion.div
            className="max-w-4xl mx-auto"
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg
                         text-primary font-semibold text-sm
                         hover:bg-primary-light transition-colors"
            >
              <FiArrowLeft />
              Back to all videos
            </button>

            <div className="bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtube_video_id}?rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-heading mb-3">
                  {selectedVideo.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted mb-3">
                  {selectedVideo.stream_date && (
                    <span className="inline-flex items-center gap-1.5">
                      <FiCalendar className="text-primary" />
                      {new Date(selectedVideo.stream_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  {selectedVideo.view_count_display && (
                    <span className="inline-flex items-center gap-1.5">
                      <FiEye className="text-primary" />
                      {selectedVideo.view_count_display}
                    </span>
                  )}
                </div>
                {selectedVideo.preacher && (
                  <p className="text-sm text-primary font-medium">
                    {selectedVideo.preacher}
                  </p>
                )}
                {selectedVideo.description && (
                  <p className="text-sm text-body mt-3 leading-relaxed">
                    {selectedVideo.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6"
            variants={slideUpVariants}
          >
            {videos.map((video) => (
              <motion.button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="group text-left bg-surface rounded-2xl shadow-sm border border-border
                           overflow-hidden hover:shadow-lg hover:border-primary/40
                           transition-all duration-300 focus:outline-none
                           focus-visible:ring-2 focus-visible:ring-primary
                           focus-visible:ring-offset-2 flex flex-col"
                variants={slideUpVariants}
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiYoutube size={40} className="text-white/20" />
                    </div>
                  )}
                  {/* Visible on mobile (no hover), hidden on desktop until hover */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl ml-1">▶</span>
                    </div>
                  </div>
                </div>

                {/* flex-1 + mt-auto makes all cards in a row the same height */}
                <div className="p-4 flex-1 flex flex-col min-w-0">
                  <h3 className="font-semibold text-heading text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
                    {video.title}
                  </h3>
                  {video.preacher && (
                    <p className="text-xs text-primary font-medium mb-2 line-clamp-1">
                      {video.preacher}
                    </p>
                  )}
                  {video.stream_date && (
                    <div className="mt-auto flex items-center gap-1.5 text-xs text-muted">
                      <FiCalendar size={12} />
                      {new Date(video.stream_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}