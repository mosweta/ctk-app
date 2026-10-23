/**
 * useTheme
 *
 * React hook that manages the site's light/dark/system theme preference.
 *
 * Responsibilities:
 *   - Reads the initial theme from localStorage on mount.
 *   - Applies the `dark` class to <html> whenever the theme changes.
 *   - Persists the user's choice to localStorage.
 *   - When in "system" mode, listens for OS theme changes and re-applies.
 *
 * Three modes:
 *   "light"  - Force light mode regardless of OS preference.
 *   "dark"   - Force dark mode regardless of OS preference.
 *   "system" - Follow the OS preference. This is the default for new users.
 *
 * Only one instance of this hook should exist per page. It is called
 * inside ThemeToggle, which is mounted once in the header. If additional
 * components need to read or set the theme, they should use a Context
 * Provider wrapping this hook (not implemented yet; not needed while
 * ThemeToggle is the only consumer).
 */

import { useCallback, useEffect, useState } from 'react';

/** Key used in localStorage to persist the user's choice. */
const STORAGE_KEY = 'theme';

/** Valid theme values. Order matters for the cycle behavior. */
const THEMES = ['light', 'dark', 'system'];

/**
 * Reads the initial theme from localStorage, falling back to "system"
 * if the stored value is missing or invalid.
 *
 * @returns {'light' | 'dark' | 'system'}
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  return THEMES.includes(stored) ? stored : 'system';
}

/**
 * Applies the given theme to the document by toggling the `dark` class
 * on <html>. This is what causes Tailwind's dark-mode variants and role
 * tokens to resolve to their dark values.
 *
 * @param {'light' | 'dark' | 'system'} theme
 */
function applyTheme(theme) {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);
  root.classList.toggle('dark', isDark);
}

/**
 * Public hook. Returns the current theme, a setter, and a cycling function
 * (light -> dark -> system -> light ...).
 */
export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Persist and apply the theme whenever it changes.
  // In "system" mode, also listen for OS changes so the page updates live.
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable; theme just won't persist. */
    }

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  /**
   * Sets the theme to a specific value if it is valid.
   * Invalid values are ignored (defensive against caller bugs).
   */
  const setTheme = useCallback((next) => {
    if (THEMES.includes(next)) setThemeState(next);
  }, []);

  /**
   * Cycles to the next theme. Used by the ThemeToggle button so a single
   * click walks the user through all three states.
   */
  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const idx = THEMES.indexOf(current);
      return THEMES[(idx + 1) % THEMES.length];
    });
  }, []);

  return { theme, setTheme, cycleTheme };
}