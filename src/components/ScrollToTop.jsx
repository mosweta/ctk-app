/**
 * ScrollToTop
 *
 * Floating button that appears in the bottom-right corner once the user
 * has scrolled past a threshold. Clicking it scrolls smoothly back to the
 * top of the page.
 *
 * Behavior:
 *   - Hidden by default. Appears when window.scrollY > 400 (roughly one
 *     mobile screen). The threshold is set to avoid showing the button on
 *     short pages where scrolling back up is trivial.
 *   - Fades in and out via a CSS opacity transition.
 *   - When clicked, scrolls to top. Uses smooth scrolling by default, but
 *     respects prefers-reduced-motion by jumping instantly if the user has
 *     requested reduced motion.
 *
 * Accessibility:
 *   - The button uses aria-label so screen readers announce its purpose.
 *   - When hidden, the wrapper has aria-hidden and the button is unmounted.
 *     This prevents keyboard users from tabbing to an invisible element and
 *     avoids the aria-hidden-on-focusable HTML anti-pattern.
 *   - Reduced-motion is respected at the browser level via index.css, and
 *     again in JS here as defense in depth.
 *
 * Placement:
 *   - Mounted once in the root Layout so it appears on all public pages.
 *   - Also mounted in AdminLayout so it works on admin pages.
 *
 * Z-index:
 *   - z-50 places it above page content but below modals (which use z-100
 *     via the Modal component). If a floating chat widget is added later,
 *     this button may need repositioning to avoid collision.
 */

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Scroll position (in pixels) after which the button becomes visible.
 * 400px is roughly one mobile viewport height - enough scrolling that the
 * user has lost the header and would benefit from a shortcut.
 */
const THRESHOLD = 400;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);

    // Run once on mount in case the browser restored scroll position
    // (for example, on page refresh while scrolled down).
    onScroll();

    // passive: true tells the browser this listener will not call
    // preventDefault(), allowing it to optimize scroll performance.
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    // The wrapper stays mounted so the opacity transition can animate.
    // The button inside unmounts when hidden so it leaves the tab order
    // and the accessibility tree entirely.
    <div
      className={`fixed bottom-6 right-6 z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      {visible && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top of page"
          title="Back to top"
          className="w-12 h-12 flex items-center justify-center rounded-full
                     bg-primary text-on-primary shadow-lg
                     transition-transform duration-200
                     hover:bg-primary-hover hover:-translate-y-1
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ChevronUp size={24} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}