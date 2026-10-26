import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Eye, ArrowLeft, Loader2, Play } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import {FiYoutube} from 'react-icons/fi';

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function formatStreamDate(value, { long = false } = {}) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(
    'en-US',
    long
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : undefined
  );
}

function hasValidVideoId(video) {
  return (
    video &&
    typeof video.youtube_video_id === 'string' &&
    video.youtube_video_id.length > 0
  );
}

function VideoThumbnail({ video }) {
  const [broken, setBroken] = useState(false);
  const showImage = video.thumbnail_url && !broken;

  return (
    <div className="relative aspect-video bg-surface-alt rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
      {showImage ? (
        <img
          src={video.thumbnail_url}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-base">
          <FiYoutube size={40} className="text-white/20" aria-hidden="true" />
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg">
          <Play size={24} className="text-white ml-1 fill-white" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function Livestream() {
  const { data, loading, error, refetch } = useApi('/livestreams');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const videos = Array.isArray(data)
    ? data.filter((v) => v && (v.id || v.youtube_video_id))
    : [];

  const sectionInitial = shouldReduceMotion ? false : 'hidden';
  const sectionVariants = shouldReduceMotion ? undefined : stagger;
  const itemVariants = shouldReduceMotion ? undefined : slideUp;

  return (
    <motion.section
      className="bg-background py-16 md:py-20"
      initial={sectionInitial}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-light text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
            <FiYoutube size={14} aria-hidden="true" />
            Livestreams
          </span>
          <h2 className="section-heading">Catch Up on Recent Masses</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Watch recordings of recent Masses and special celebrations
            from Christ the King Parish.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4" role="status" aria-live="polite">
            <Loader2 className="w-10 h-10 text-primary animate-spin" aria-hidden="true" />
            <p className="text-sm text-muted">Loading livestreams…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border max-w-2xl mx-auto flex flex-col items-center gap-4" role="alert">
            <p className="text-body">We couldn’t load livestreams right now. Please try again.</p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-on-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border max-w-2xl mx-auto">
            <FiYoutube size={48} className="mx-auto text-muted mb-4" aria-hidden="true" />
            <p className="text-muted">No livestreams have been published yet.</p>
          </div>
        )}

        {/* Selected video */}
        {!loading && !error && selectedVideo && (
          <motion.div
            className="max-w-4xl mx-auto"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-primary font-semibold text-sm hover:bg-primary-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to all videos
            </button>

            <div className="bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
              {hasValidVideoId(selectedVideo) ? (
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtube_video_id}?rel=0&modestbranding=1`}
                    title={selectedVideo.title || 'Livestream video'}
                    allow="encrypted-media; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="relative aspect-video bg-neutral-900 flex flex-col items-center justify-center text-center p-6 gap-3">
                  <FiYoutube size={48} className="text-white/30" aria-hidden="true" />
                  <p className="text-white/80 text-sm max-w-sm">
                    This video isn’t available right now. Please check back later, or contact the parish office.
                  </p>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-heading mb-3">
                  {selectedVideo.title || 'Untitled livestream'}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted mb-3">
                  {formatStreamDate(selectedVideo.stream_date, { long: true }) && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary" aria-hidden="true" />
                      {formatStreamDate(selectedVideo.stream_date, { long: true })}
                    </span>
                  )}
                  {selectedVideo.view_count_display && (
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={14} className="text-primary" aria-hidden="true" />
                      {selectedVideo.view_count_display}
                    </span>
                  )}
                </div>
                {selectedVideo.preacher && (
                  <p className="text-sm text-primary font-medium">{selectedVideo.preacher}</p>
                )}
                {selectedVideo.description && (
                  <p className="text-sm text-body mt-3 leading-relaxed">{selectedVideo.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && !error && !selectedVideo && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {videos.map((video) => {
              const dateLabel = formatStreamDate(video.stream_date);
              const hasMeta = Boolean(video.preacher || dateLabel);

              return (
                <button
                  key={video.id || `${video.youtube_video_id || 'video'}-${video.stream_date || 'date'}`}
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className="group text-left flex flex-col min-w-0 focus:outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background transition-transform hover:-translate-y-1"
                >
                  <VideoThumbnail video={video} />

                  <div className="mt-3 flex flex-col flex-1 min-w-0">
                    <h3 className="font-bold text-heading text-base leading-snug line-clamp-2 break-words mb-1">
                      {video.title || 'Untitled livestream'}
                    </h3>

                    {hasMeta && (
                      <div className="flex flex-col gap-0.5 mt-1">
                        {video.preacher && (
                          <p className="text-sm text-muted font-medium line-clamp-1 break-words group-hover:text-primary transition-colors">
                            {video.preacher}
                          </p>
                        )}
                        {dateLabel && (
                          <p className="text-xs text-muted/80 flex items-center gap-1">
                            <Calendar size={12} aria-hidden="true" className="shrink-0" />
                            <span className="line-clamp-1">{dateLabel}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}