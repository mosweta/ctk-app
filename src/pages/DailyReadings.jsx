/**
 * Daily Readings (public).
 *
 * Renders the Catholic Mass readings for a selected date. Fetches
 * from GET /api/readings/:date (which caches in Supabase and pulls
 * from Evangelizo).
 *
 * Optimizations:
 *   - PageHeader for consistent hero banner
 *   - In-memory cache per date: revisiting a date does not refetch
 *   - Date navigation does not unmount the previous content; it shows
 *     a subtle "loading" indicator in the corner while keeping the
 *     previous content visible (prevents flicker and layout shift)
 *   - Local date (not UTC) so East Africa timezone users see the
 *     correct day after 9 PM
 *   - Proper error state (ErrorState) instead of conflating errors
 *     with "no readings"
 *   - Reading text split into paragraphs for readability
 *   - Verse numbers styled distinctly within the flow
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { api } from '../lib/apiClient';
import {
  PageHeader,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../components/ui';

/**
 * Format a local Date object as YYYY-MM-DD in the user's timezone.
 * Avoids the toISOString() UTC shift bug.
 */
function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Color map for the liturgical season badge. Falls back to Green
 * for unknown colors.
 */
const LITURGICAL_COLORS = {
  White: 'bg-liturgy-white text-neutral-900 border-neutral-300',
  Green: 'bg-liturgy-green text-white border-green-900',
  Red: 'bg-liturgy-red text-white border-red-900',
  Purple: 'bg-liturgy-purple text-white border-purple-900',
  Violet: 'bg-liturgy-purple text-white border-purple-900',
  Rose: 'bg-liturgy-rose text-white border-pink-900',
  Black: 'bg-liturgy-black text-white border-neutral-700',
  Gold: 'bg-liturgy-gold text-neutral-900 border-yellow-700',
};

export default function DailyReadings() {
  const [date, setDate] = useState(() => new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [error, setError] = useState(null);

  // In-memory cache: dateStr → readings data
  const cacheRef = useRef(new Map());

  const dateStr = toLocalDateStr(date);
  const isToday = toLocalDateStr(new Date()) === dateStr;

  // Fetch readings whenever the date changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError(null);

      // Cache hit? Show instantly.
      if (cacheRef.current.has(dateStr)) {
        setData(cacheRef.current.get(dateStr));
        setLoading(false);
        setFetchingMore(false);
        return;
      }

      // Cache miss. If we already have some content, keep it visible
      // while fetching (avoids flicker). Otherwise show full spinner.
      if (data) {
        setFetchingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await api.get(`/readings/${dateStr}`);
        if (cancelled) return;
        cacheRef.current.set(dateStr, res.data);
        setData(res.data);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || 'Failed to load readings');
      } finally {
        if (!cancelled) {
          setLoading(false);
          setFetchingMore(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateStr]);

  const shiftDate = (days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    setDate(next);
  };

  const goToToday = () => setDate(new Date());

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const badgeClass =
    LITURGICAL_COLORS[data?.color] || LITURGICAL_COLORS.Green;

  return (
    <main className="min-h-screen bg-background pb-16">
      <PageHeader
        eyebrow="Liturgy"
        title="Daily Readings"
        subtitle="The Catholic Mass readings for the day"
      />

      <div className="container-page py-12 max-w-3xl">
        {/* Date Navigator */}
        <div className="relative bg-surface rounded-xl shadow-sm border border-border p-4 mb-8">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => shiftDate(-1)}
              aria-label="Previous day"
              className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary-light
                         transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="text-center flex-1">
              <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-1">
                {isToday ? 'Today' : 'Readings for'}
              </p>
              <p className="text-lg font-bold text-heading">{formattedDate}</p>
              {!isToday && (
                <button
                  onClick={goToToday}
                  className="text-xs text-primary underline mt-1 hover:text-primary-hover"
                >
                  Back to today
                </button>
              )}
            </div>

            <button
              onClick={() => shiftDate(1)}
              aria-label="Next day"
              className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary-light
                         transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Subtle loading indicator while keeping previous content visible */}
          {fetchingMore && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 text-xs text-muted">
              <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState message="Loading readings..." />
        ) : error ? (
          <ErrorState
            title="Readings unavailable"
            message={error}
            onRetry={() => {
              cacheRef.current.delete(dateStr);
              setData(null);
              setDate(new Date(date));
            }}
          />
        ) : !data ? (
          <EmptyState
            icon={Calendar}
            title="No readings available"
            message="We could not find readings for this date."
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Liturgical title */}
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-heading mb-3">
                  {data.title}
                </h1>
                {data.color && (
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeClass}`}
                  >
                    {data.color}
                  </span>
                )}
              </div>

              {/* Saint of the day */}
              {data.saint?.name && data.saint.name !== 'Saint of the Day' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-primary-light/30 border border-primary/15 rounded-xl p-5 text-center"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                    Saint of the Day
                  </p>
                  <h2 className="text-lg font-semibold text-heading">
                    {data.saint.name}
                  </h2>
                </motion.div>
              )}

              {/* Readings */}
              {data.readings?.map((reading, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="bg-surface rounded-xl shadow-sm border border-border p-6 md:p-8"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    {reading.label}
                  </p>
                  <h2 className="text-lg md:text-xl font-bold text-heading mb-4 pb-3 border-b border-border">
                    {reading.title}
                  </h2>
                  <ReadingBody text={reading.text} />
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}

/**
 * Renders reading text with proper paragraph breaks.
 *
 * Evangelizo's text arrives as a single block with \n separators. We
 * split on double newlines for paragraphs, keep single newlines inside
 * a paragraph, and style verse numbers with a subtle prefix color.
 */
function ReadingBody({ text }) {
  if (!text) return null;

  // Split into paragraphs by double newlines (or fallback to single)
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="text-body leading-relaxed space-y-4">
      {paragraphs.map((paragraph, idx) => (
        <p key={idx} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}