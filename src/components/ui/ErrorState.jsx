/**
 * ErrorState
 *
 * Centered error message with optional retry button. Used when a fetch
 * fails, validation returns an error, or any recoverable problem occurs.
 *
 * The caller is responsible for extracting a user-readable message from
 * whatever error the API returned. Do not pass raw error objects here;
 * pass a plain string.
 *
 * Accessibility:
 *   - The wrapper is not a live region (unlike LoadingState) because the
 *     caller typically navigates the user to this state explicitly (for
 *     example, by rendering <ErrorState> instead of <Content>). Live
 *     region announcements are better suited to transient toasts.
 *   - The error icon is aria-hidden.
 *   - The retry button is a standard <button> and is keyboard-focusable
 *     when the component mounts. If the error state replaces content on
 *     a page the user is already reading, focus stays where it was; the
 *     retry button is reachable via Tab.
 *
 * Colors:
 *   - The background icon container uses bg-primary-light (maroon tint
 *     in light mode, lifted red in dark mode) and the icon uses text-primary.
 *     This reads as an alert without introducing a separate red.
 *     In this design system, primary IS red, so alert and primary share
 *     a hue by design.
 */

import { AlertCircle, RotateCw } from 'lucide-react';

/**
 * @param {Object}        props
 * @param {string}        [props.title]    Short headline. Default "Something went wrong".
 * @param {string}        [props.message]  Detail line. Default "Please try again in a moment".
 * @param {Function}      [props.onRetry]  If provided, shows a retry button.
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-light">
        <AlertCircle className="text-primary" size={24} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-heading">{title}</h3>
        <p className="text-sm text-muted mt-1 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          <RotateCw size={16} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}