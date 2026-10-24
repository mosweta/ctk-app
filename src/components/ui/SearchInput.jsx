/**
 * SearchInput
 *
 * Text input with a leading search icon. Wraps the standard .input
 * utility with a fixed left padding that reserves room for the icon.
 *
 * Used on admin tables, group browse pages, and any list that grows
 * beyond one screen of items.
 *
 * Accessibility:
 *   - type="search" gives browsers their native clear button and
 *     role="searchbox".
 *   - The icon is aria-hidden; the placeholder provides the visible
 *     label. Callers who need a persistent visible label should add
 *     their own <label> element above this input.
 *   - The input inherits the standard focus ring from .input.
 *
 * Controlled component:
 *   This component does not manage its own state. The parent supplies
 *   `value` and handles `onChange`. This keeps search behavior
 *   predictable and allows the parent to debounce or filter as needed.
 */

import { Search } from 'lucide-react';

/**
 * @param {Object}    props
 * @param {string}    props.value             Current search text.
 * @param {Function}  props.onChange          Receives the new string value.
 * @param {string}    [props.placeholder]     Placeholder text. Default "Search...".
 * @param {string}    [props.className]       Additional wrapper classes.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10"
      />
    </div>
  );
}