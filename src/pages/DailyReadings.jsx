/**
 * Daily Readings (public).
 *
 * Renders the Catholic Mass readings for a selected date. Fetches
 * from GET /api/readings/:date (which caches in Supabase and pulls
 * from Evangelizo).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { api } from '../lib/apiClient';
import {
  PageHeader,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../components/ui';

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseLocalDateStr(str) {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

const LITURGICAL_COLORS = {
  White: 'bg-liturgy-white text-neutral-900',
  Green: 'bg-liturgy-green text-white',
  Red: 'bg-liturgy-red text-white',
  Purple: 'bg-liturgy-purple text-white',
  Violet: 'bg-liturgy-purple text-white',
  Rose: 'bg-liturgy-rose text-white',
  Black: 'bg-liturgy-black text-white',
  Gold: 'bg-liturgy-gold text-neutral-900',
};

const BADGE_RING = 'ring-1 ring-inset ring-black/10 dark:ring-white/20';

export default function DailyReadings() {
  const [date, setDate] = useState(() => new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const cacheRef = useRef(new Map());
  const shouldReduceMotion = useReducedMotion();

  const dateStr = toLocalDateStr(date);
  const todayStr = toLocalDateStr(new Date());
  const isToday = dateStr === todayStr;

  const formattedDate = useMemo(
    () =>
      date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [date]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError(null);

      if (cacheRef.current.has(dateStr)) {
        setData(cacheRef.current.get(dateStr));
        setLoading(false);
        setFetchingMore(false);
        return;
      }

      if (data) setFetchingMore(true);
      else setLoading(true);

      try {
        const res = await api.get(`/readings/${dateStr}`);
        if (cancelled) return;
        cacheRef.current.set(dateStr, res.data);
        setData(res.data);
      } catch (err) {
        if (cancelled) return;
        setData(null);
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
  }, [dateStr, reloadToken]);

  const shiftDate = (days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    setDate(next);
  };

  const goToToday = () => setDate(new Date());

  const handleDatePick = (e) => {
    const parsed = parseLocalDateStr(e.target.value);
    if (parsed) setDate(parsed);
  };

  const retry = () => {
    cacheRef.current.delete(dateStr);
    setError(null);
    setReloadToken((t) => t + 1);
  };

  const badgeClass = useMemo(() => {
    const base = LITURGICAL_COLORS[data?.color] || LITURGICAL_COLORS.Green;
    return `${base} ${BADGE_RING}`;
  }, [data?.color]);

  // Filter out empty placeholder readings (e.g. Second Reading on a weekday)
  const validReadings = useMemo(() => {
    if (!data?.readings || !Array.isArray(data.readings)) return [];
    
    return data.readings.filter((r) => {
      // Ignore if there's no text or title
      if (!r.text && !r.title) return false;
      // Ignore if the text is just a copyright notice
      if (r.text && r.text.includes('Copyright © Confraternity of Christian Doctrine')) return false;
      return true;
    });
  }, [data?.readings]);

  const containerMotion = shouldReduceMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.25 },
      };
  const itemMotion = shouldReduceMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <main className="min-h-screen bg-background pb-16">
      <PageHeader
        eyebrow="Liturgy"
        title="Daily Readings"
        subtitle="The Catholic Mass readings for the day"
      />

      <div className="container-page py-12 max-w-3xl">
        
        {/* Date navigator panel */}
        <div className="relative bg-surface rounded-xl shadow-sm border border-border p-5 mb-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => shiftDate(-1)}
              aria-label="Previous day"
              className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary-light
                         transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-primary shrink-0"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>

            <div className="text-center flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-1">
                {isToday ? 'Today' : 'Readings for'}
              </p>
              <p className="text-lg md:text-xl font-bold text-heading truncate">
                {formattedDate}
              </p>

              {/* Date Picker & Back to Today */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                <label className="relative inline-flex items-center gap-2 text-sm text-body bg-background px-3 py-1.5 rounded-md border border-border cursor-pointer hover:border-primary transition-colors focus-within:ring-2 focus-within:ring-primary">
                  <CalendarIcon size={16} className="text-muted" aria-hidden="true" />
                  <span className="sr-only">Choose a date</span>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={handleDatePick}
                    className="bg-transparent text-sm text-body focus:outline-none w-full"
                  />
                </label>

                {!isToday && (
                  <button
                    type="button"
                    onClick={goToToday}
                    className="text-sm font-medium text-primary hover:underline
                               focus-visible:outline-none focus-visible:ring-2
                               focus-visible:ring-primary rounded-sm px-1"
                  >
                    Back to today
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => shiftDate(1)}
              aria-label="Next day"
              className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary-light
                         transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-primary shrink-0"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>

          {fetchingMore && (
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted flex items-center gap-1.5 bg-background px-2"
              role="status"
              aria-live="polite"
            >
              <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading…
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
            onRetry={retry}
          />
        ) : !data ? (
          <EmptyState
            icon={CalendarIcon}
            title="No readings available"
            message="We could not find readings for this date."
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={dateStr}
              {...(containerMotion || {})}
              className="space-y-6"
            >
              {/* Liturgical title + season */}
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-heading mb-4">
                  {data.title || 'Daily Readings'}
                </h1>
                {data.color && (
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}
                  >
                    {data.color}
                  </span>
                )}
              </div>

              {/* Saint of the day */}
              {data.saint?.name && data.saint.name !== 'Saint of the Day' && (
                <motion.div
                  {...(itemMotion || {})}
                  transition={shouldReduceMotion ? undefined : { delay: 0.05, duration: 0.25 }}
                  className="bg-primary-light/30 border border-primary/15 rounded-xl p-5 text-center mb-8"
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
              {validReadings.length > 0 ? (
                validReadings.map((reading, i) => (
                  <motion.article
                    key={i}
                    {...(itemMotion || {})}
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : { delay: 0.1 + i * 0.05, duration: 0.25 }
                    }
                    className="bg-surface rounded-xl shadow-sm border border-border p-6 md:p-8"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                      {reading.label || 'Reading'}
                    </p>
                    <h2 className="text-lg md:text-xl font-bold text-heading mb-4 pb-3 border-b border-border">
                      {reading.title}
                    </h2>
                    <ReadingBody text={reading.text} />
                  </motion.article>
                ))
              ) : (
                <div className="bg-surface rounded-xl border border-border p-8 text-center text-muted">
                  No readings were returned for this date.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}

function ReadingBody({ text }) {
  if (!text || typeof text !== 'string') return null;

  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <div className="text-body leading-relaxed space-y-5">
      {paragraphs.map((paragraph, idx) => (
        <p key={idx} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}