/* eslint-disable react-refresh/only-export-components */
/**
 * ThemeContext
 *
 * Single source of truth for the site's theme.
 *
 * Why this exists:
 *   The `useTheme()` hook holds theme in local component state. The
 *   Header mounts <ThemeToggle /> twice (desktop nav + mobile trigger),
 *   which would produce two independent, divergent copies of the theme
 *   state. This provider calls the hook exactly once and shares the
 *   result through context, so both toggles always agree.
 *
 * The existing useTheme() hook still owns:
 *   - localStorage persistence (key: 'theme')
 *   - the `dark` class on <html>
 *   - the `system` mode matchMedia listener
 *
 * No changes are needed to useTheme.js or the anti-flash script in
 * index.html; this provider simply shares one instance of that state.
 */

import { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const value = useTheme();
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return ctx;
}