/**
 * Ministry — homepage "Get Involved" section.
 *
 * Fetches public groups from GET /groups and shows up to five as
 * preview cards, then links to /get-involved for the full directory.
 *
 * API contract:
 *   The backend returns public groups ordered by category, then by
 *   display_order. We preserve that order and slice to the first
 *   five. No client-side re-sort or random selection.
 *
 * Background:
 *   Solid base green (matches the footer). Kept as-is because the
 *   design intent is a bookend with the bottom of the page.
 *
 * States:
 *   loading   — accessible spinner
 *   error     — message + retry
 *   empty     — "No groups" message, CTA still available
 *   success   — grid of up to five cards + CTA
 *
 * The card grid and CTA remain visible in error and empty states so
 * the visitor can still reach /get-involved.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Loader2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import './Ministry.css';

/** Maximum number of group previews on the homepage. */
const PREVIEW_LIMIT = 5;

export default function Ministry() {
  const { data, loading, error, refetch } = useApi('/groups');
  const shouldReduceMotion = useReducedMotion();

  // Defensive: the hook may return non-array data.
  const allGroups = Array.isArray(data) ? data : [];
  const groups = allGroups.slice(0, PREVIEW_LIMIT);

  // Shared animation gates. Undefined when reduced motion is preferred
  // so Framer Motion skips the animation entirely.
  const sectionInitial = shouldReduceMotion ? false : { opacity: 0, y: 40 };
  const containerVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      };
  const cardVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };
  const cardHover = shouldReduceMotion ? undefined : { y: -4 };

  return (
    <motion.section
      id="ministry"
      className="ministry-section"
      initial={sectionInitial}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' }}
    >
      <div className="ministry-container">
        {/* Header */}
        <motion.div
          className="ministry-header"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="ministry-badge">
            <Users size={16} aria-hidden="true" />
            Community
          </span>
          <h2 className="ministry-title">Get Involved</h2>
          <p className="ministry-sub">
            Find your place among our many Jumuiyas, Choirs, and Groups.
            Every parishioner belongs to a community.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div
            className="ministry-state"
            role="status"
            aria-live="polite"
          >
            <Loader2
              className="ministry-spinner"
              size={32}
              aria-hidden="true"
            />
            <p className="ministry-state-text">Loading groups…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="ministry-state" role="alert">
            <p className="ministry-state-text">
              We couldn’t load groups right now. Please try again.
            </p>
            <button
              type="button"
              className="ministry-retry"
              onClick={refetch}
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && groups.length === 0 && (
          <div className="ministry-state">
            <p className="ministry-state-text">
              Group listings are being updated. Please check back soon.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && groups.length > 0 && (
          <motion.div
            className="ministry-grid"
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {groups.map((group) => {
              const hasSlug =
                typeof group.slug === 'string' && group.slug.length > 0;
              const cardContent = (
                <>
                  {group.image_url ? (
                    <img
                      src={group.image_url}
                      alt=""
                      className="ministry-card-image"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="ministry-card-fallback"
                      aria-hidden="true"
                    >
                      <Users size={28} />
                    </div>
                  )}
                  <div className="ministry-card-body">
                    <h3 className="ministry-card-name">
                      {group.name || 'Unnamed group'}
                    </h3>
                    {group.category && (
                      <p className="ministry-card-category">
                        {group.category}
                      </p>
                    )}
                  </div>
                </>
              );

              // Render as a Link when the group has a usable slug;
              // otherwise render a non-interactive div so users cannot
              // navigate to /groups/undefined.
              return hasSlug ? (
                <motion.div
                  key={group.id || group.slug}
                  variants={cardVariants}
                  whileHover={cardHover}
                >
                  <Link
                    to={`/groups/${group.slug}`}
                    className="ministry-card ministry-card--link"
                  >
                    {cardContent}
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key={group.id || group.name}
                  variants={cardVariants}
                >
                  <div className="ministry-card">{cardContent}</div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* CTA — always visible, including in error and empty states */}
        <motion.div
          className="ministry-cta"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link to="/get-involved" className="ministry-cta-button">
            Explore All Groups
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}