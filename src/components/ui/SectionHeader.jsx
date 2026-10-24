/**
 * SectionHeader
 *
 * Inline header used inside a page below the PageHeader. Provides a
 * consistent eyebrow + title + subtitle stack for each major section.
 *
 * Use one SectionHeader per major content block. Do not use PageHeader
 * inside a page that already has one. The distinction is:
 *
 *   PageHeader    -> once per page, at the top, renders <h1>
 *   SectionHeader -> zero or more times per page, renders <h2> (default)
 *
 * Accessibility:
 *   - The `as` prop lets callers control the heading level. Default is
 *     <h2>. If a section is nested inside another section with its own
 *     <h2>, pass `as="h3"` to preserve correct heading hierarchy.
 *   - Never use this component to render <h1>; that is PageHeader's job.
 *
 * Motion:
 *   - Fades and slides in when scrolled into view (once).
 *   - Respects prefers-reduced-motion.
 */

import { motion, useReducedMotion } from 'framer-motion';

/**
 * @param {Object}                    props
 * @param {string}                    [props.eyebrow]    Small uppercase label above the title.
 * @param {string}                    props.title        Section heading text. Required.
 * @param {string}                    [props.subtitle]   One-line description below the title.
 * @param {'center'|'left'}           [props.align]      Text alignment. Default 'center'.
 * @param {'h2'|'h3'|'h4'}            [props.as]         Heading level. Default 'h2'.
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  as: Tag = 'h2',
}) {
  const shouldReduceMotion = useReducedMotion();
  const alignClass =
    align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-2 mb-10 ${alignClass}`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="section-heading">{title}</Tag>
      {subtitle && <p className="section-subtitle max-w-2xl">{subtitle}</p>}
    </motion.div>
  );
}