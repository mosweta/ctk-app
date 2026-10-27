/**
 * Events Manager.
 *
 * Lists all events (drafts and published), allows creating, editing,
 * publishing, and deleting.
 *
 * Loading flow:
 *   - On mount, `loading` starts true and the fetch effect only sets
 *     state AFTER the request settles. This avoids a synchronous
 *     `setState` inside the effect body, which the
 *     react-hooks/set-state-in-effect rule flags.
 *   - For refreshes triggered by the user (retry, after create/edit),
 *     `refresh()` sets loading true immediately so the loading state
 *     is visible during the request.
 *
 * Upload flow:
 *   - Large images are downscaled client-side before upload via
 *     src/lib/downscaleImage.js (max 1920px on the longer edge).
 *   - If downscaling fails for any reason, the original file is
 *     uploaded unchanged.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/apiClient';
import { downscaleImage } from '../../lib/downscaleImage';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  X,
} from 'lucide-react';

const STATUS_META = {
  draft: {
    label: 'Draft',
    className: 'bg-surface-alt text-muted border border-border',
  },
  published: {
    label: 'Published',
    className:
      'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  },
  archived: {
    label: 'Archived',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200',
  },
};

function isoToLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function formatEventDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  // Starts true: this covers the initial fetch without needing to
  // call setLoading(true) inside the effect.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [busyIds, setBusyIds] = useState(() => new Set());

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // -------------------------------------------------------------------
  // Initial fetch
  //
  // Deliberately does NOT call setLoading(true) — `loading` already
  // starts true. All setState calls happen after `await`, so nothing
  // runs synchronously in the effect body.
  // -------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await api.authGet('/admin/events');
        if (cancelled || !mountedRef.current) return;
        setEvents(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (err) {
        if (cancelled || !mountedRef.current) return;
        setError(err.message || 'Failed to load events');
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // -------------------------------------------------------------------
  // Explicit refresh — used by the retry button and after create/edit.
  // Safe to call setLoading(true) here because this is invoked from a
  // user interaction, not from an effect body.
  // -------------------------------------------------------------------
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.authGet('/admin/events');
      if (!mountedRef.current) return;
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || 'Failed to load events');
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

  const handleDelete = async (event) => {
    if (
      !window.confirm(
        `Delete "${event.title}" permanently? This cannot be undone.`
      )
    ) {
      return;
    }

    markBusy(event.id, true);
    try {
      await api.authDelete(`/admin/events/${event.id}`);
      if (!mountedRef.current) return;
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    } catch (err) {
      if (!mountedRef.current) return;
      alert(err.message || 'Failed to delete event');
    } finally {
      if (mountedRef.current) markBusy(event.id, false);
    }
  };

  const handleTogglePublish = async (event) => {
    if (event.status !== 'draft' && event.status !== 'published') return;

    const newStatus = event.status === 'published' ? 'draft' : 'published';

    markBusy(event.id, true);
    try {
      const res = await api.authPut(`/admin/events/${event.id}`, {
        ...event,
        status: newStatus,
      });
      if (!mountedRef.current) return;
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? res.data : e))
      );
    } catch (err) {
      if (!mountedRef.current) return;
      alert(err.message || 'Failed to update event status');
    } finally {
      if (mountedRef.current) markBusy(event.id, false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEvent(null);
    refresh();
  };

  if (showForm || editingEvent) {
    return (
      <EventForm
        event={editingEvent}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-heading">Events</h2>
          <p className="text-muted text-sm">
            Manage parish events. New events start as drafts and are not
            visible on the public site until published.
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
          New Event
        </button>
      </div>

      {/* List */}
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
          <span className="text-sm text-muted">Loading events…</span>
        </div>
      ) : error ? (
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
            <span>{error}</span>
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
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <Calendar
            size={48}
            className="mx-auto text-muted mb-4"
            aria-hidden="true"
          />
          <p className="text-heading font-medium mb-1">No events yet</p>
          <p className="text-sm text-muted mb-4">
            Create the first event to get started.
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
            Create the first event
          </button>
        </div>
      ) : (
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-surface-alt border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Start
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
                {events.map((event) => {
                  const busy = busyIds.has(event.id);
                  const status = STATUS_META[event.status] || STATUS_META.draft;
                  const canToggle =
                    event.status === 'draft' || event.status === 'published';

                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-surface-alt/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {event.image_url ? (
                            <img
                              src={event.image_url}
                              alt=""
                              className="w-12 h-8 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className="w-12 h-8 rounded bg-surface-alt flex items-center justify-center shrink-0"
                              aria-hidden="true"
                            >
                              <Calendar size={14} className="text-muted" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-heading truncate">
                              {event.title}
                            </p>
                            <p className="text-xs text-muted truncate">
                              {event.location || 'No location'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-body whitespace-nowrap">
                        {formatEventDate(event.start_time)}
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
                            onClick={() => handleTogglePublish(event)}
                            disabled={!canToggle || busy}
                            aria-label={
                              !canToggle
                                ? `Cannot toggle status of ${event.title}; edit to change from ${event.status}`
                                : event.status === 'published'
                                ? `Unpublish ${event.title}`
                                : `Publish ${event.title}`
                            }
                            title={
                              !canToggle
                                ? 'Edit the event to change this status'
                                : event.status === 'published'
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
                            ) : event.status === 'published' ? (
                              <EyeOff size={16} aria-hidden="true" />
                            ) : (
                              <Eye size={16} aria-hidden="true" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingEvent(event)}
                            disabled={busy}
                            aria-label={`Edit ${event.title}`}
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
                            onClick={() => handleDelete(event)}
                            disabled={busy}
                            aria-label={`Delete ${event.title}`}
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
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Event Form
// ---------------------------------------------------------------------

function EventForm({ event, onSuccess, onCancel }) {
  const isEditing = !!event;
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    start_time: isoToLocalInput(event?.start_time),
    end_time: isoToLocalInput(event?.end_time),
    location: event?.location || '',
    category: event?.category || '',
    status: event?.status || 'draft',
    image_url: event?.image_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.start_time) {
      errors.start_time = 'Start date and time is required';
    } else if (Number.isNaN(new Date(formData.start_time).getTime())) {
      errors.start_time = 'Start date is invalid';
    }
    if (formData.end_time) {
      const s = new Date(formData.start_time).getTime();
      const e = new Date(formData.end_time).getTime();
      if (!Number.isNaN(s) && !Number.isNaN(e) && e < s) {
        errors.end_time = 'End time cannot be before the start time';
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const original = e.target.files?.[0];
    if (!original) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(original.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (original.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError('');
    try {
      // Downscale large images before upload. downscaleImage() never
      // throws — it falls back to the original file on any failure.
      const file = await downscaleImage(original);

      const { supabase } = await import('../../lib/supabaseClient');
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));

      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || uploading) return;
    if (!validate()) return;

    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        category: formData.category.trim(),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: formData.end_time
          ? new Date(formData.end_time).toISOString()
          : null,
        image_url: formData.image_url || '',
      };

      if (isEditing) {
        await api.authPut(`/admin/events/${event.id}`, payload);
      } else {
        await api.authPost('/admin/events', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
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
          {isEditing ? 'Edit Event' : 'New Event'}
        </h2>
        <p className="text-sm text-muted">
          {isEditing
            ? 'Update the event details below.'
            : 'Fill in the details for the new event. It will start as a draft.'}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/30 text-danger p-3 rounded-lg text-sm mb-4"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-heading mb-2">
            Thumbnail Image (Optional)
          </label>
          <div className="flex items-start gap-4">
            {formData.image_url ? (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                <img
                  src={formData.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white
                             hover:bg-black/80 transition-colors
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Remove selected image"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface-alt text-muted shrink-0">
                <ImageIcon size={24} aria-hidden="true" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading || loading}
                className="block w-full text-sm text-muted
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-primary-light file:text-primary
                           hover:file:bg-primary/20
                           cursor-pointer
                           disabled:cursor-not-allowed disabled:opacity-60"
              />
              <p className="text-xs text-subtle mt-1">
                JPEG, PNG, or WebP. Max 5 MB (before resizing).
              </p>
              {uploading && (
                <p
                  className="text-xs text-primary mt-1 flex items-center gap-1.5"
                  role="status"
                >
                  <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                  Uploading image…
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="event-title"
            className="block text-sm font-medium text-heading mb-1"
          >
            Title <span className="text-danger">*</span>
          </label>
          <input
            id="event-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            aria-invalid={fieldErrors.title ? 'true' : undefined}
            aria-describedby={fieldErrors.title ? 'event-title-error' : undefined}
            className={inputClass}
          />
          {fieldErrors.title && (
            <p id="event-title-error" className="text-xs text-danger mt-1">
              {fieldErrors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="event-description"
            className="block text-sm font-medium text-heading mb-1"
          >
            Description
          </label>
          <textarea
            id="event-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
          />
        </div>

        {/* Start / End */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="event-start"
              className="block text-sm font-medium text-heading mb-1"
            >
              Start <span className="text-danger">*</span>
            </label>
            <input
              id="event-start"
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              aria-invalid={fieldErrors.start_time ? 'true' : undefined}
              aria-describedby={
                fieldErrors.start_time ? 'event-start-error' : undefined
              }
              className={inputClass}
            />
            {fieldErrors.start_time && (
              <p id="event-start-error" className="text-xs text-danger mt-1">
                {fieldErrors.start_time}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="event-end"
              className="block text-sm font-medium text-heading mb-1"
            >
              End (optional)
            </label>
            <input
              id="event-end"
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              aria-invalid={fieldErrors.end_time ? 'true' : undefined}
              aria-describedby={
                fieldErrors.end_time ? 'event-end-error' : undefined
              }
              className={inputClass}
            />
            {fieldErrors.end_time && (
              <p id="event-end-error" className="text-xs text-danger mt-1">
                {fieldErrors.end_time}
              </p>
            )}
          </div>
        </div>

        {/* Location / Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="event-location"
              className="block text-sm font-medium text-heading mb-1"
            >
              Location
            </label>
            <input
              id="event-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="event-category"
              className="block text-sm font-medium text-heading mb-1"
            >
              Category
            </label>
            <input
              id="event-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Liturgy, Youth"
              className={inputClass}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="event-status"
            className="block text-sm font-medium text-heading mb-1"
          >
            Status
          </label>
          <select
            id="event-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="draft">Draft (hidden from public)</option>
            <option value="published">Published (visible on site)</option>
            <option value="archived">Archived</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || uploading}
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
            disabled={loading || uploading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg
                       text-sm font-semibold bg-primary text-on-primary
                       hover:bg-primary-hover transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {loading && (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            )}
            {loading
              ? 'Saving…'
              : isEditing
              ? 'Update Event'
              : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}