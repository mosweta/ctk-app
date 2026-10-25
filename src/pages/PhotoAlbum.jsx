/**
 * Photo Album (public).
 *
 * Displays all published gallery images in a responsive grid.
 * Click an image to open it in a full-screen lightbox with
 * keyboard navigation (left/right arrows, ESC to close).
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/apiClient';
import { Loader2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function PhotoAlbum() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/gallery');
        setImages(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Keyboard navigation while the lightbox is open
  const close = useCallback(() => setSelectedIndex(null), []);
  const next = useCallback(
    () => setSelectedIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setSelectedIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, close, next, prev]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#800000]/10 text-[#800000] mb-4">
            <ImageIcon size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#234a33] mb-2">
            Parish Photo Album
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Moments from our parish life - celebrations, events, and community.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center border border-red-100 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && images.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              No photos have been uploaded yet. Please check back soon.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && images.length > 0 && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {images.map((img, index) => (
              <motion.button
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedIndex(index)}
                className="mb-4 break-inside-avoid group relative w-full overflow-hidden
                           rounded-xl bg-gray-200 focus:outline-none
                           focus:ring-2 focus:ring-[#800000]"
              >
                <img
                  src={img.url}
                  alt={img.caption || 'Parish photo'}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-300
                             group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t
                                  from-black/80 to-transparent p-3
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium text-left truncate">
                      {img.caption}
                    </p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={close}
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 p-3 text-white/70 hover:text-white
                         hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X size={28} />
            </button>

            {/* Previous */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-4 p-3 text-white/70 hover:text-white
                           hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <ChevronLeft size={36} />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={images[selectedIndex].url}
              alt={images[selectedIndex].caption || 'Parish photo'}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption */}
            {images[selectedIndex].caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white
                            text-center text-lg px-6 py-2 bg-black/40 rounded-lg max-w-[90vw]">
                {images[selectedIndex].caption}
              </p>
            )}

            {/* Image counter */}
            <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedIndex + 1} / {images.length}
            </p>

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-4 p-3 text-white/70 hover:text-white
                           hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <ChevronRight size={36} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}