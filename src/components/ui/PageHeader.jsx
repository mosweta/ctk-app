/**
 * PageHeader
 *
 * Top-of-page hero used by every public page (Readings, Events, Groups,
 * Contact, Staff, Sacraments, etc.). Provides a consistent banner with:
 *
 *   - Optional eyebrow label (small uppercase text above the title)
 *   - Required title (renders as <h1>)
 *   - Optional subtitle (one-line description)
 *   - Optional background image with automatic dark overlay
 *   - Optional children rendered after the subtitle (for CTAs, badges, etc.)
 *   - Configurable text alignment (center or left)
 *
 * Every page should use exactly one PageHeader, at the top of <main>.
 * Below it, sections should use SectionHeader (not another PageHeader).
 *
 * Accessibility:
 *   - The title renders as <h1>, so each page has a single top-level
 *     heading, which screen readers use for quick navigation.
 *   - The eyebrow and subtitle are plain <span> and <p>, not headings,
 *     so they do not pollute the heading outline.
 *   - When a backgroundImage is present, the overlay div is aria-hidden
 *     so screen readers do not announce it.
 *
 * Motion:
 *   - Content fades and slides in on mount via Framer Motion.
 *   - Respects prefers-reduced-motion: users with reduced motion enabled
 *     see the content immediately without animation.
 *
 * Colors:
 *   - Uses bg-base, text-on-base from the brand tokens. In light mode,
 *     base is deep green (green-800) with white text. In dark mode, base
 *     lifts to green-700 (still white text) so the header remains a
 *     distinct surface from the page background.
 */

import { motion, useReducedMotion } from 'framer-motion';

/**
 * @param {Object}              props
 * @param {string}              [props.eyebrow]         Small uppercase label above the title.
 * @param {string}              props.title             Main page heading. Required.
 * @param {string}              [props.subtitle]        One-line description below the title.
 * @param {string}              [props.backgroundImage] URL to a background image. Rendered
 *                                                      behind a black/50 overlay.
 * @param {'center'|'left'}     [props.align]           Text alignment. Default 'center'.
 * @param {React.ReactNode}     [props.children]        Additional content below the subtitle.
 *                                                      Useful for CTAs or metadata badges.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  align = 'center',
  children,
}) {
  const shouldReduceMotion = useReducedMotion();
  const alignClass =
    align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <header
      className="relative w-full overflow-hidden bg-base text-on-base"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      )}

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 container-page py-16 md:py-24 flex flex-col gap-4 ${alignClass}`}
      >
        {eyebrow && <span className="eyebrow text-accent">{eyebrow}</span>}

        <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="text-base md:text-lg text-white/85 max-w-2xl">
            {subtitle}
          </p>
        )}

        {children}
      </motion.div>
    </header>
  );
}