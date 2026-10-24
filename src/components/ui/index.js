/**
 * Barrel export for UI components.
 *
 * Allows imports like:
 *   import { PageHeader, Modal, LoadingState } from '../components/ui';
 *
 * Instead of:
 *   import PageHeader from '../components/ui/PageHeader';
 *   import Modal from '../components/ui/Modal';
 *   import LoadingState from '../components/ui/LoadingState';
 *
 * Keeps import lists short in files that use several components at once.
 * Tree-shaking still works because Vite resolves named exports to their
 * source modules at build time.
 */

export { default as PageHeader } from './PageHeader';
export { default as SectionHeader } from './SectionHeader';
export { default as LoadingState } from './LoadingState';
export { default as ErrorState } from './ErrorState';
export { default as EmptyState } from './EmptyState';
export { default as Modal } from './Modal';
export { default as SearchInput } from './SearchInput';