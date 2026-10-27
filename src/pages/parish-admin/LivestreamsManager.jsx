/**
 * Livestreams Manager.
 *
 * List, create, edit, publish, and delete livestream records.
 * The YouTube URL is pasted by the admin; the video ID and thumbnail
 * are extracted automatically by the backend.
 *
 * Loading flow:
 *   - `loading` starts true. The mount effect only sets state AFTER
 *     the fetch settles, which avoids react-hooks/set-state-in-effect.
 *   - `refresh()` is called from user actions (retry, post-save) and
 *     explicitly sets loading true so the loading state is visible
 *     during refreshes.
 *
 * Theming:
 *   All surfaces and text use semantic tokens. Works in both light
 *   and dark mode.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/apiClient';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';

const STATUS_META = {
  draft: {
    label: 'Draft',
    className: 'bg-surface-alt text-muted border border-border',
  },
  published: {
    label: 'Published',
    className:
      'bg-green-100 text-green-700 border border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
  },
  archived: {
    label: 'Archived',
    className:
      'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/30',
  },
};

/**
 * Turn a stored date (ISO or YYYY-MM-DD) into a value suitable for a
 * <input type="date">. Returns '' for invalid input.
 */
function toDateInputValue(value) {
  if (!value) return '';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Format a stored date for display. */
function formatDate(value) {
  if (!value) return '—';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------
// List component
// ---------------------------------------------------------------------

export default function LivestreamsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busyIds, setBusyIds] = useState(() => new Set());

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initial load. All setState after the await.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.authGet('/admin/livestreams');
        if (cancelled || !mountedRef.current) return;
        setItems(Array.isArray(res.data) ? res.data : []);
        setLoadError('');
      } catch (err) {
        if (cancelled || !mountedRef.current) return;
        setLoadError(err.message || 'Failed to load livestreams');
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Explicit refresh (retry, post-save).
  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await api.authGet('/admin/livestreams');
      if (!mountedRef.current) return;
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (!mountedRef.current) return;
      setLoadError(err.message || 'Failed to load livestreams');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const markBusy = (id, busy) =>
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });

  const handleDelete = async (item) => {
    if (
      !window.confirm(
        `Delete "${item.title}" permanently? This cannot be undone.`
      )
    ) {
      return;
    }

    markBusy(item.id, true);
    try {
      await api.authDelete(`/admin/livestreams/${item.id}`);
      if (!mountedRef.current) return;
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      if (!mountedRef.current) return;
      alert(err.message || 'Failed to delete livestream');
    } finally {
      if (mountedRef.current) markBusy(item.id, false);
    }
  };

  const handleTogglePublish = async (item) => {
    // Only draft <-> published flips via the toggle. Archived items
    // must be edited explicitly so they cannot be accidentally
    // resurrected.
    if (item.status !== 'draft' && item.status !== 'published') return;

    const newStatus = item.status === 'published' ? 'draft' : 'published';

    markBusy(item.id, true);
    try {
      const res = await api.authPut(`/admin/livestreams/${item.id}`, {
        ...item,
        status: newStatus,
      });
      if (!mountedRef.current) return;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? res.data : i))
      );
    } catch (err) {
      if (!mountedRef.current) return;
      alert(err.message || 'Failed to update livestream status');
    } finally {
      if (mountedRef.current) markBusy(item.id, false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(null);
    refresh();
  };

  if (showForm || editing) {
    return (
      <LivestreamForm
        item={editing}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-heading">Livestreams</h2>
          <p className="text-muted text-sm">
            Manage YouTube recordings from recent masses and events.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                     bg-primary text-on-primary text-sm font-semibold
                     hover:bg-primary-hover transition-colors
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-primary focus-visible:ring-offset-2
                     shrink-0"
        >
          <Plus size={18} aria-hidden="true" />
          Add Livestream
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div
          className="flex flex-col items-center justify-center h-64 gap-3 bg-surface rounded-xl border border-border"
          role="status"
          aria-live="polite"
        >
          <Loader2
            className="w-8 h-8 text-primary animate-spin"
            aria-hidden="true"
          />
          <span className="text-sm text-muted">Loading livestreams…</span>
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/30 text-danger p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="flex items-start gap-2 flex-1">
            <AlertCircle
              size={18}
              className="shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="px-4 py-2 rounded-lg border-2 border-primary text-primary
                       text-sm font-semibold hover:bg-primary hover:text-on-primary
                       transition-colors shrink-0
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <FaYoutube
            size={48}
            className="mx-auto text-muted mb-4"
            aria-hidden="true"
          />
          <p className="text-heading font-medium mb-1">No livestreams yet</p>
          <p className="text-sm text-muted mb-4">
            Add the first one to get started.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-primary text-on-primary text-sm font-semibold
                       hover:bg-primary-hover transition-colors
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus size={16} aria-hidden="true" />
            Add the first livestream
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-surface-alt border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => {
                    const busy = busyIds.has(item.id);
                    const status =
                      STATUS_META[item.status] || STATUS_META.draft;
                    const canToggle =
                      item.status === 'draft' || item.status === 'published';
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-surface-alt/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {item.thumbnail_url ? (
                              <img
                                src={item.thumbnail_url}
                                alt=""
                                className="w-16 h-9 rounded object-cover bg-surface-alt shrink-0"
                              />
                            ) : (
                              <div
                                className="w-16 h-9 rounded bg-surface-alt flex items-center justify-center shrink-0"
                                aria-hidden="true"
                              >
                                <FaYoutube size={16} className="text-muted" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-heading truncate">
                                {item.title || 'Untitled livestream'}
                              </p>
                              <p className="text-xs text-muted truncate">
                                {item.preacher || 'No preacher listed'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-body whitespace-nowrap">
                          {formatDate(item.stream_date)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(item)}
                              disabled={!canToggle || busy}
                              aria-label={
                                !canToggle
                                  ? `Cannot toggle status of ${item.title}; edit to change from ${item.status}`
                                  : item.status === 'published'
                                  ? `Unpublish ${item.title}`
                                  : `Publish ${item.title}`
                              }
                              title={
                                !canToggle
                                  ? 'Edit the livestream to change this status'
                                  : item.status === 'published'
                                  ? 'Unpublish'
                                  : 'Publish'
                              }
                              className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-alt
                                         transition-colors
                                         focus-visible:outline-none focus-visible:ring-2
                                         focus-visible:ring-primary
                                         disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {busy ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                  aria-hidden="true"
                                />
                              ) : item.status === 'published' ? (
                                <EyeOff size={16} aria-hidden="true" />
                              ) : (
                                <Eye size={16} aria-hidden="true" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditing(item)}
                              disabled={busy}
                              aria-label={`Edit ${item.title}`}
                              title="Edit"
                              className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-alt
                                         transition-colors
                                         focus-visible:outline-none focus-visible:ring-2
                                         focus-visible:ring-primary
                                         disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Edit2 size={16} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={busy}
                              aria-label={`Delete ${item.title}`}
                              title="Delete"
                              className="p-2 rounded-lg text-muted hover:text-danger hover:bg-red-500/10
                                         transition-colors
                                         focus-visible:outline-none focus-visible:ring-2
                                         focus-visible:ring-primary
                                         disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <ul className="md:hidden space-y-3">
            {items.map((item) => {
              const busy = busyIds.has(item.id);
              const status = STATUS_META[item.status] || STATUS_META.draft;
              const canToggle =
                item.status === 'draft' || item.status === 'published';
              return (
                <li
                  key={item.id}
                  className="bg-surface rounded-xl border border-border shadow-sm p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt=""
                        className="w-20 h-12 rounded object-cover bg-surface-alt shrink-0"
                      />
                    ) : (
                      <div
                        className="w-20 h-12 rounded bg-surface-alt flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <FaYoutube size={20} className="text-muted" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-heading truncate">
                        {item.title || 'Untitled livestream'}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {item.preacher || 'No preacher listed'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${status.className}`}
                        >
                          {status.label}
                        </span>
                        <span className="text-xs text-muted">
                          {formatDate(item.stream_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item)}
                      disabled={!canToggle || busy}
                      aria-label={
                        !canToggle
                          ? `Cannot toggle status of ${item.title}`
                          : item.status === 'published'
                          ? `Unpublish ${item.title}`
                          : `Publish ${item.title}`
                      }
                      className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-alt
                                 transition-colors
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-primary
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {busy ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : item.status === 'published' ? (
                        <EyeOff size={18} aria-hidden="true" />
                      ) : (
                        <Eye size={18} aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      disabled={busy}
                      aria-label={`Edit ${item.title}`}
                      className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-alt
                                 transition-colors
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-primary
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Edit2 size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={busy}
                      aria-label={`Delete ${item.title}`}
                      className="p-2 rounded-lg text-muted hover:text-danger hover:bg-red-500/10
                                 transition-colors
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-primary
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Livestream form
// ---------------------------------------------------------------------

function LivestreamForm({ item, onSuccess, onCancel }) {
  const isEditing = !!item;

  const [formData, setFormData] = useState({
    title: item?.title || '',
    preacher: item?.preacher || '',
    description: item?.description || '',
    youtube_url: item?.youtube_url || '',
    stream_date: toDateInputValue(item?.stream_date),
    view_count_display: item?.view_count_display || '',
    status: item?.status || 'draft',
    display_order: item?.display_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Live preview of YouTube video ID from the pasted URL.
  // Mirrors the backend's extraction regex so what the preview shows
  // is what the backend will actually save.
  const getPreviewVideoId = (url) => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const previewId = getPreviewVideoId(formData.youtube_url);

  const validate = () => {
    const errors = {};
    if (!formData.youtube_url.trim()) {
      errors.youtube_url = 'YouTube URL is required';
    } else if (!previewId) {
      errors.youtube_url = 'Please enter a valid YouTube video URL';
    }
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;

    setError('');
    setSaving(true);
    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        preacher: formData.preacher.trim(),
        description: formData.description.trim(),
        youtube_url: formData.youtube_url.trim(),
        stream_date: formData.stream_date || null,
        display_order: parseInt(formData.display_order, 10) || 0,
      };

      if (isEditing) {
        await api.authPut(`/admin/livestreams/${item.id}`, payload);
      } else {
        await api.authPost('/admin/livestreams', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save livestream');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-background text-body border border-border-strong rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
    'disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="max-w-2xl mx-auto bg-surface rounded-xl shadow-sm border border-border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-heading">
          {isEditing ? 'Edit Livestream' : 'Add Livestream'}
        </h2>
        <p className="text-sm text-muted">
          Paste the YouTube URL. Thumbnail is extracted automatically.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/30 text-danger p-3 rounded-lg mb-4 text-sm"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* YouTube URL + preview */}
        <div>
          <label
            htmlFor="lv-youtube-url"
            className="block text-sm font-medium text-heading mb-1"
          >
            YouTube URL <span className="text-danger">*</span>
          </label>
          <input
            id="lv-youtube-url"
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={saving}
            aria-invalid={fieldErrors.youtube_url ? 'true' : undefined}
            aria-describedby={
              fieldErrors.youtube_url ? 'lv-youtube-error' : undefined
            }
            className={`${inputClass} font-mono text-sm`}
          />
          {fieldErrors.youtube_url && (
            <p id="lv-youtube-error" className="text-xs text-danger mt-1">
              {fieldErrors.youtube_url}
            </p>
          )}
          {previewId && (
            <div className="mt-3 flex items-start gap-3 p-3 bg-surface-alt rounded-lg border border-border">
              <img
                src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
                alt="Video preview"
                className="w-32 h-18 rounded object-cover shrink-0"
              />
              <div className="text-xs text-muted min-w-0">
                <p className="font-medium text-heading mb-1">Video preview</p>
                <p className="font-mono text-[10px] break-all">
                  ID: {previewId}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="lv-title"
            className="block text-sm font-medium text-heading mb-1"
          >
            Title <span className="text-danger">*</span>
          </label>
          <input
            id="lv-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Family Day Mass 2025"
            disabled={saving}
            aria-invalid={fieldErrors.title ? 'true' : undefined}
            aria-describedby={fieldErrors.title ? 'lv-title-error' : undefined}
            className={inputClass}
          />
          {fieldErrors.title && (
            <p id="lv-title-error" className="text-xs text-danger mt-1">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lv-preacher"
            className="block text-sm font-medium text-heading mb-1"
          >
            Preacher / Main Celebrant
          </label>
          <input
            id="lv-preacher"
            name="preacher"
            value={formData.preacher}
            onChange={handleChange}
            placeholder="e.g. H.E. Archbishop Phillip Anyolo"
            disabled={saving}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="lv-description"
            className="block text-sm font-medium text-heading mb-1"
          >
            Description
          </label>
          <textarea
            id="lv-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            disabled={saving}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lv-stream-date"
              className="block text-sm font-medium text-heading mb-1"
            >
              Stream Date
            </label>
            <input
              id="lv-stream-date"
              type="date"
              name="stream_date"
              value={formData.stream_date}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="lv-views"
              className="block text-sm font-medium text-heading mb-1"
            >
              Views (display text)
            </label>
            <input
              id="lv-views"
              name="view_count_display"
              value={formData.view_count_display}
              onChange={handleChange}
              placeholder="e.g. 5.5K views"
              disabled={saving}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lv-display-order"
              className="block text-sm font-medium text-heading mb-1"
            >
              Display Order
            </label>
            <input
              id="lv-display-order"
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            />
            <p className="text-xs text-subtle mt-1">
              Lower numbers appear first
            </p>
          </div>
          <div>
            <label
              htmlFor="lv-status"
              className="block text-sm font-medium text-heading mb-1"
            >
              Status
            </label>
            <select
              id="lv-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            >
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published (visible)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-body
                       hover:bg-surface-alt transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg
                       text-sm font-semibold bg-primary text-on-primary
                       hover:bg-primary-hover transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {saving && (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            )}
            {saving ? 'Saving…' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}