/**
 * Modal
 *
 * Accessible modal dialog. Renders through a portal so it appears above
 * all other content regardless of parent stacking contexts.
 *
 * Behavior:
 *   - Opens when `open` is true and closes when false.
 *   - Closes on:
 *       * Click outside the dialog
 *       * Escape key
 *       * Close button in the header
 *       * Programmatic onClose from the parent
 *   - Body scroll is locked while open to prevent the page behind from
 *     scrolling.
 *   - Focus is moved into the dialog on open and restored to the
 *     previously focused element on close.
 *
 * Accessibility:
 *   - role="dialog" and aria-modal="true" tell assistive technologies
 *     this is a modal.
 *   - aria-labelledby points to the heading so screen readers announce
 *     the dialog's title.
 *   - The close button has an explicit aria-label.
 *
 * Known limitation:
 *   - This modal does not trap Tab focus inside the dialog. Keyboard
 *     users can Tab past the last focusable element to reach browser
 *     chrome (address bar, etc.). Full focus trapping requires either a
 *     library (focus-trap-react) or a custom implementation. For the
 *     current use cases (short forms, confirmation dialogs), the ESC +
 *     restore-focus pattern is generally sufficient. If admins report
 *     focus escaping behind the modal, we can add a trap in a follow-up.
 *
 * Sizes:
 *   - 'sm'  Small confirmation dialogs (max-w-sm, ~384px).
 *   - 'md'  Default form modals (max-w-md, ~448px).
 *   - 'lg'  Larger editing modals (max-w-2xl, ~672px).
 *   - 'xl'  Full-featured editors (max-w-4xl, ~896px).
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * @param {Object}              props
 * @param {boolean}             props.open       Whether the modal is open.
 * @param {Function}            props.onClose    Called when the user dismisses the modal.
 * @param {string}              props.title      Heading shown in the header and to assistive tech.
 * @param {React.ReactNode}     props.children   Body content.
 * @param {'sm'|'md'|'lg'|'xl'} [props.size]     Width tier. Default 'md'.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (!open) return;

    // Remember what was focused before opening so we can restore it.
    previouslyFocused.current = document.activeElement;

    // Focus the first focusable element inside the dialog after the
    // entrance animation completes. The 50ms delay gives Framer time to
    // mount the dialog subtree so focusable elements exist.
    const timer = setTimeout(() => {
      const firstFocusable = dialogRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }, 50);

    // Escape closes the modal.
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Lock page scroll while the modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            // Close when clicking the backdrop, but not when clicking
            // inside the dialog. Checking target vs currentTarget ensures
            // clicks on the dialog itself do not bubble up to close.
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={dialogRef}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`w-full ${sizes[size]} bg-surface rounded-xl shadow-xl`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 id="modal-title" className="text-lg font-semibold text-heading">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="btn-ghost"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}