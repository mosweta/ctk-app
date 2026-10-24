/**
 * LoadingState
 *
 * Centered spinner used while data is being fetched. Place at the top
 * level of any async page or modal body while the request is in flight.
 *
 * Accessibility:
 *   - The wrapper has role="status" and aria-live="polite", so screen
 *     readers announce the message when the state appears.
 *   - The spinner itself is aria-hidden because it is decorative; the
 *     visible message carries the meaning.
 *
 * Motion:
 *   - The spinner uses Tailwind's animate-spin class, which is a CSS
 *     animation. F1's global reduced-motion rule reduces the animation
 *     duration to near-zero for users who prefer reduced motion, so the
 *     spinner appears static for them. This is acceptable because the
 *     "Loading..." text still communicates the state, and users with
 *     reduced motion often prefer no spinning entirely.
 *
 * Sizes:
 *   - 'sm'  Small spinner for inline loading within a card.
 *   - 'md'  Default, for page-level loading.
 *   - 'lg'  For full-screen loading overlays.
 */

/**
 * @param {Object}                    props
 * @param {string}                    [props.message]  Text shown below the spinner.
 * @param {'sm'|'md'|'lg'}            [props.size]     Spinner size. Default 'md'.
 */
export default function LoadingState({ message = 'Loading...', size = 'md' }) {
  const sizeMap = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-4',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <div
        className={`${sizeMap[size]} rounded-full border-primary border-r-transparent animate-spin`}
        aria-hidden="true"
      />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}