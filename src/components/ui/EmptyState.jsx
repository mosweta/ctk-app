/**
 * EmptyState
 *
 * Shown when a list, table, or collection has no items. Also used for
 * zero-result search states.
 *
 * Different from ErrorState:
 *   - EmptyState means "the request succeeded but returned nothing."
 *   - ErrorState means "the request failed."
 *
 * Presenting them differently prevents users from thinking an empty list
 * is a bug, and encourages them to take the appropriate action (create
 * the first item, adjust filters, etc.).
 *
 * Accessibility:
 *   - The icon is aria-hidden.
 *   - The heading is <h3> for correct outline hierarchy below SectionHeader's <h2>.
 *   - The action button (if provided) is keyboard-focusable and inherits
 *     standard button focus behavior.
 */

/**
 * @param {Object}              props
 * @param {React.ComponentType} [props.icon]     Lucide icon component.
 * @param {string}              props.title      Headline text (e.g., "No events yet").
 * @param {string}              [props.message]  One-line helper text.
 * @param {React.ReactNode}     [props.action]   CTA to create/undo, typically a button.
 */
export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
      {Icon && (
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-surface-alt">
          <Icon className="text-muted" size={28} aria-hidden="true" />
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-heading">{title}</h3>
        {message && (
          <p className="text-sm text-muted mt-1 max-w-md">{message}</p>
        )}
      </div>
      {action}
    </div>
  );
}