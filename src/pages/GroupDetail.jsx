/**
 * Group detail page.
 *
 * Reads a group slug from the URL, fetches the group from
 * GET /api/groups/:slug, and displays its name, category, image,
 * description, founding year, meeting details, and coordinator
 * contact.
 *
 * Behavior:
 *   - Cancels in-flight requests when the slug changes or the
 *     component unmounts, so stale responses cannot overwrite the
 *     current page.
 *   - Distinguishes a 404 (unknown slug) from a network/server
 *     failure. The 404 case offers a back link; other failures offer
 *     a retry action.
 *   - Renders a coordinator phone number as a tel: link only when
 *     the contact value parses as a usable phone number; emails and
 *     other free-form values render as text.
 *
 * Accessibility:
 *   - Loading state has role="status" aria-live="polite".
 *   - Error state has role="alert".
 *   - All decorative icons are aria-hidden.
 *   - Reduced-motion preference respected on entrance animation.
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  AlertCircle,
  Mail,
  RotateCw,
} from 'lucide-react';
import { api } from '../lib/apiClient';

/**
 * Heuristic for "is this value a phone number I can safely dial?".
 * The coordinator_contact field is free-form; admins may store a
 * phone, an email, or both. Only treat the value as a phone when it
 * contains mostly digits and common phone punctuation, with at least
 * seven digits total.
 */
function parsePhone(value) {
  if (!value) return null;
  // Reject obvious email addresses.
  if (value.includes('@')) return null;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  // Only allow digits, spaces, dashes, parens, leading +.
  if (!/^[\d\s()+\-./]+$/.test(value)) return null;
  return value;
}

/**
 * Heuristic for "is this value an email address?". Used only to
 * decide which icon to show next to a free-form contact field.
 */
function looksLikeEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function GroupDetail() {
  const { slug } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    // Reset all request-scoped state before each fetch so a slug
    // change cannot display the previous group's content.
    setLoading(true);
    setError(null);
    setGroup(null);
    setImageFailed(false);

    const load = async () => {
      try {
        const res = await api.get(`/groups/${slug}`);
        if (cancelled) return;
        setGroup(res.data);
      } catch (err) {
        if (cancelled) return;
        // apiClient throws ApiError with .status. Distinguish 404
        // (unknown slug) from everything else (network, server).
        const status = err?.status;
        setError({
          kind: status === 404 ? 'not-found' : 'request-failed',
          message:
            status === 404
              ? 'This group could not be found. It may have been renamed or removed.'
              : 'We could not load this group right now. Please try again.',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, reloadToken]);

  const retry = useCallback(() => {
    setReloadToken((t) => t + 1);
  }, []);

  // ---- Loading -----------------------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 py-32">
        <Loader2
          className="animate-spin text-primary"
          size={40}
          aria-hidden="true"
        />
        <p role="status" aria-live="polite" className="text-sm text-muted">
          Loading group…
        </p>
      </main>
    );
  }

  // ---- Error -------------------------------------------------------
  if (error) {
    const isNotFound = error.kind === 'not-found';
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 py-32 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
          <AlertCircle
            size={32}
            className="text-primary"
            aria-hidden="true"
          />
        </div>
        <div role="alert" className="max-w-md">
          <h1 className="text-2xl font-bold text-heading mb-2">
            {isNotFound ? 'Group not found' : 'Could not load group'}
          </h1>
          <p className="text-body">{error.message}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {!isNotFound && (
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
                         border-2 border-primary text-primary font-semibold
                         hover:bg-primary hover:text-on-primary
                         transition-colors
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <RotateCw size={16} aria-hidden="true" />
              Try again
            </button>
          )}
          <Link
            to="/get-involved"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
                       bg-primary text-on-primary font-semibold
                       hover:bg-primary-hover transition-colors
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Groups
          </Link>
        </div>
      </main>
    );
  }

  // ---- Success -----------------------------------------------------
  const showImage = Boolean(group.image_url) && !imageFailed;
  const phone = parsePhone(group.coordinator_contact);
  const isEmail = looksLikeEmail(group.coordinator_contact);

  const fadeUp = shouldReduceMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
      };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-base overflow-hidden">
        {showImage ? (
          <img
            src={group.image_url}
            alt={group.name}
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User
              size={80}
              className="text-white/15"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Gradient overlay for text contrast over any image. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6">
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            <Link
              to="/get-involved"
              className="inline-flex items-center gap-2 text-white/90
                         hover:text-white text-sm font-semibold
                         bg-black/30 hover:bg-black/50 backdrop-blur-sm
                         px-4 py-2 rounded-full transition-colors
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-white"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to Groups
            </Link>
          </div>

          {group.category && (
            <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {group.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white max-w-4xl drop-shadow-md leading-tight">
            {group.name}
          </h1>

          {group.patron_saint && (
            <p className="text-white/85 text-base md:text-lg mt-2">
              {group.patron_saint}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <motion.div
        {...(fadeUp || {})}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10"
      >
        <div className="bg-surface rounded-2xl shadow-xl border border-border p-6 md:p-10 grid md:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="md:col-span-2 space-y-8 min-w-0">
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-heading mb-3">
                About this Group
              </h2>
              <div className="text-body leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
                {group.long_description ||
                  group.short_description ||
                  'No description available.'}
              </div>
            </section>

            {group.founded_year && (
              <section>
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
                  Founded
                </h3>
                <p className="text-lg font-semibold text-heading">
                  {group.founded_year}
                </p>
              </section>
            )}
          </div>

          {/* Sidebar meta */}
          <aside className="space-y-6 bg-surface-alt rounded-xl p-6 h-fit min-w-0">
            <h3 className="font-bold text-heading border-b border-border pb-2">
              Meeting Details
            </h3>
            <ul className="space-y-3 text-sm">
              {group.meeting_day && (
                <li className="flex items-start gap-3 text-body">
                  <Calendar
                    size={18}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="break-words">
                    {group.meeting_day}
                    {group.meeting_time ? ` · ${group.meeting_time}` : ''}
                  </span>
                </li>
              )}
              {group.meeting_location && (
                <li className="flex items-start gap-3 text-body">
                  <MapPin
                    size={18}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="break-words">
                    {group.meeting_location}
                  </span>
                </li>
              )}
              {!group.meeting_day && !group.meeting_location && (
                <li className="text-muted italic">
                  Meeting details are not available.
                </li>
              )}
            </ul>

            {(group.coordinator_name || group.coordinator_contact) && (
              <>
                <h3 className="font-bold text-heading border-b border-border pb-2 pt-2">
                  Contact
                </h3>
                <ul className="space-y-3 text-sm">
                  {group.coordinator_name && (
                    <li className="flex items-start gap-3 text-body">
                      <User
                        size={18}
                        className="text-primary mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="break-words">
                        {group.coordinator_name}
                      </span>
                    </li>
                  )}
                  {group.coordinator_contact && (
                    <li className="flex items-start gap-3 text-body">
                      {isEmail ? (
                        <Mail
                          size={18}
                          className="text-primary mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <Phone
                          size={18}
                          className="text-primary mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      {phone ? (
                        <a
                          href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                          className="text-primary hover:text-primary-hover hover:underline break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                        >
                          {group.coordinator_contact}
                        </a>
                      ) : isEmail ? (
                        <a
                          href={`mailto:${group.coordinator_contact}`}
                          className="text-primary hover:text-primary-hover hover:underline break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                        >
                          {group.coordinator_contact}
                        </a>
                      ) : (
                        <span className="break-words">
                          {group.coordinator_contact}
                        </span>
                      )}
                    </li>
                  )}
                </ul>
              </>
            )}
          </aside>
        </div>
      </motion.div>
    </main>
  );
}