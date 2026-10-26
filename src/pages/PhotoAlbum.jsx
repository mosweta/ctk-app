import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { api } from '../lib/apiClient';
import { Loader2, X, ChevronLeft, ChevronRight, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function PhotoAlbum() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  const shouldReduceMotion = useReducedMotion();
  const lightboxRef = useRef(null);
  const previousFocusRef = useRef(null);

  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/gallery');
      setImages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // Lightbox state management
  const close = useCallback(() => {
    setSelectedIndex(null);
    // Restore focus to the element that opened the lightbox
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

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

  // Handle keyboard, focus trap, and body scroll lock
  useEffect(() => {
    if (selectedIndex === null) return;

    // Save the currently focused element (the thumbnail button)
    previousFocusRef.current = document.activeElement;

    // Lock scroll and save previous value
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the lightbox
    // We use a micro-delay to ensure Framer Motion has mounted the DOM
    const timer = setTimeout(() => {
      lightboxRef.current?.focus();
    }, 50);

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      
      // Basic Focus Trap
      if (e.key === 'Tab' && lightboxRef.current) {
        const focusable = lightboxRef.current.querySelectorAll(
          'button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex, close, next, prev]);

  // Framer Motion variants
  const gridItemVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light text-primary mb-4">
            <ImageIcon size={32} aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-heading mb-3">
            Parish Photo Album
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Moments from our parish life - celebrations, events, and community.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" aria-hidden="true" />
            <p className="text-muted text-sm">Loading gallery...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-24 bg-surface rounded-2xl border border-border max-w-2xl mx-auto flex flex-col items-center gap-4">
            <AlertCircle size={40} className="text-danger mb-2" />
            <p className="text-body">{error}</p>
            <button
              onClick={loadGallery}
              className="mt-2 px-6 py-2.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && images.length === 0 && (
          <div className="text-center py-24 bg-surface rounded-2xl border border-border max-w-2xl mx-auto">
            <ImageIcon size={64} className="mx-auto text-muted mb-4" aria-hidden="true" />
            <p className="text-body">
              No photos have been uploaded yet. Please check back soon.
            </p>
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && !error && images.length > 0 && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, index) => (
              <motion.button
                key={img.id}
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
                variants={gridItemVariants}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.03 }}
                onClick={() => setSelectedIndex(index)}
                className="relative block w-full break-inside-avoid overflow-hidden rounded-xl bg-surface-alt border border-border group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`View image: ${img.caption || 'Parish photo'}`}
              >
                <GalleryImage src={img.url} alt={img.caption || 'Parish photo'} />
                
                {/* Caption Overlay - always visible on mobile, hover on desktop */}
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 text-left opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium line-clamp-2">
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
            ref={lightboxRef}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center outline-none backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close image viewer"
              className="absolute top-4 right-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
                className="absolute left-2 md:left-6 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft size={36} />
              </button>
            )}

            {/* Main Image */}
            <motion.div 
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <LightboxImage 
                key={selectedIndex} // Force re-render/fade on change
                src={images[selectedIndex].url} 
                alt={images[selectedIndex].caption || 'Parish photo'} 
                shouldReduceMotion={shouldReduceMotion}
              />
            </motion.div>

            {/* Caption */}
            {images[selectedIndex].caption && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none">
                <p className="text-white text-center text-lg px-6 py-3 bg-black/60 backdrop-blur-md rounded-xl max-w-3xl pointer-events-auto">
                  {images[selectedIndex].caption}
                </p>
              </div>
            )}

            {/* Image counter */}
            <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium tracking-widest mix-blend-difference z-50">
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
                className="absolute right-2 md:right-6 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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

/**
 * Renders the thumbnail image with a fallback if loading fails.
 */
function GalleryImage({ src, alt }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-surface-alt text-muted">
        <ImageIcon size={32} className="mb-2 opacity-50" aria-hidden="true" />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

/**
 * Renders the lightbox image with a fallback if loading fails.
 */
function LightboxImage({ src, alt, shouldReduceMotion }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-[80vw] h-[50vh] bg-neutral-900 rounded-xl border border-neutral-800">
        <ImageIcon size={64} className="text-white/20 mb-4" aria-hidden="true" />
        <p className="text-white/60">Image failed to load</p>
      </div>
    );
  }

  return (
    <motion.img
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-auto"
    />
  );
}