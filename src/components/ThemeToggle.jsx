/**
 * ThemeToggle
 *
 * Single icon button that cycles the theme through light, dark, and system.
 * The icon and accessible label reflect the current mode so both sighted
 * and screen-reader users know the state.
 *
 * Behavior:
 *   - Click (or Enter/Space when focused) advances to the next theme.
 *   - Order: light -> dark -> system -> light ...
 *   - The current mode is shown via icon (Sun, Moon, or Monitor) and via
 *     the aria-label and title attributes.
 *
 * State source:
 *   Reads and cycles via ThemeContext, not the useTheme() hook directly.
 *   This means the desktop and mobile instances (both mounted in the
 *   Header) always reflect the same theme.
 *
 * The button is a plain <button> so keyboard focus and activation work
 * out of the box. It inherits the `.btn-ghost` styling from index.css
 * which provides hover, focus, and dark-mode-consistent colors.
 */

import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';

/**
 * Human-readable labels per theme mode. Used for aria-label and title
 * so both screen readers and hover tooltips announce the current state.
 */
const LABELS = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

/**
 * Icon component per theme mode. Each maps to a universally understood
 * symbol: sun = light, moon = dark, monitor = follow system.
 */
const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function ThemeToggle({ className = '' }) {
  const { theme, cycleTheme } = useThemeContext();
  const Icon = ICONS[theme];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Theme: ${LABELS[theme]}. Click to change.`}
      title={`Theme: ${LABELS[theme]}`}
      className={`btn-ghost ${className}`}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
}