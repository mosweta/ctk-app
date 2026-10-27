/**
 * Staff Manager.
 *
 * Manage parish staff and clergy records. Each record has a name,
 * title, optional description and photo, a public photo consent flag,
 * display order, and an active toggle.
 *
 * Loading flow:
 *   - `loading` starts true. The mount effect only sets state AFTER
 *     the fetch settles, so `setState` is not called synchronously
 *     in the effect body (which would trigger
 *     react-hooks/set-state-in-effect).
 *   - `refresh()` is called from user actions (retry, post-save) and
 *     explicitly sets loading true.
 *
 * Upload flow:
 *   - Large photos are downscaled client-side before upload via
 *     src/lib/downscaleImage.js (max 1920px on the longer edge).
 *   - If downscaling fails for any reason, the original file is
 *     uploaded unchanged.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';
import { downscaleImage } from '../../lib/downscaleImage';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  User,
  Image as ImageIcon,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ---------------------------------------------------------------------
// List component
// ---------------------------------------------------------------------

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingIds, setDeletingIds] = useState(() => new Set());

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initial load — all setState after the await.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.authGet('/admin/staff');
        if (cancelled || !mountedRef.current) return;
        setStaff(Array.isArray(res.data) ? res.data : []);
        setLoadError('');
      } catch (err) {
        if (cancelled || !mountedRef.current) return;
        setLoadError(err.message || 'Failed to load staff');
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Explicit refresh (post-save, retry).
  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await api.authGet('/admin/staff');
      if (!mountedRef.current) return;
      setStaff(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (!mountedRef.current) return;
      setLoadError(err.message || 'Failed to load staff');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const handleDelete = async (person) => {
    if (
      !window.confirm(
        `Remove "${person.name}" from the staff list? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(person.id);
      return next;
    });

    try {
      await api.authDelete(`/admin/staff/${person.id}`);
      if (!mountedRef.current) return;
      setStaff((prev) => prev.filter((s) => s.id !== person.id));
    } catch (err) {
      if (!mountedRef.current) return;
      alert(err.message || 'Failed to remove staff member');
    } finally {
      if (mountedRef.current) {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(person.id);
          return next;
        });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(null);
    refresh();
  };

  if (showForm || editing) {
    return (
      <StaffForm
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
          <h2 className="text-2xl font-bold text-heading">Staff &amp; Clergy</h2>
          <p className="text-muted text-sm">
            Manage parish staff information. Photos are hidden by default
            until consent is confirmed.
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
          Add Staff
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
          <span className="text-sm text-muted">Loading staff…</span>
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
      ) : staff.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <User
            size={48}
            className="mx-auto text-muted mb-4"
            aria-hidden="true"
          />
          <p className="text-heading font-medium mb-1">No staff yet</p>
          <p className="text-sm text-muted mb-4">
            Add the first staff member to get started.
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
            Add the first staff member
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
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {staff.map((person) => {
                    const busy = deletingIds.has(person.id);
                    return (
                      <tr
                        key={person.id}
                        className="hover:bg-surface-alt/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {person.show_photo && person.image_url ? (
                              <img
                                src={person.image_url}
                                alt=""
                                className="w-9 h-9 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div
                                className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center shrink-0"
                                aria-hidden="true"
                              >
                                <User size={14} className="text-muted" />
                              </div>
                            )}
                            <p className="font-medium text-heading truncate">
                              {person.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-body truncate">
                          {person.title}
                        </td>
                        <td className="px-4 py-3">
                          {person.show_photo && person.image_url ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                              Visible
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-alt text-muted border border-border">
                              Hidden
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditing(person)}
                              disabled={busy}
                              className="text-sm font-medium text-primary
                                         hover:underline
                                         focus-visible:outline-none focus-visible:ring-2
                                         focus-visible:ring-primary rounded-sm
                                         disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(person)}
                              disabled={busy}
                              className="inline-flex items-center gap-1 text-sm font-medium text-danger
                                         hover:underline
                                         focus-visible:outline-none focus-visible:ring-2
                                         focus-visible:ring-primary rounded-sm
                                         disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {busy && (
                                <Loader2
                                  size={12}
                                  className="animate-spin"
                                  aria-hidden="true"
                                />
                              )}
                              Delete
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
            {staff.map((person) => {
              const busy = deletingIds.has(person.id);
              return (
                <li
                  key={person.id}
                  className="bg-surface rounded-xl border border-border shadow-sm p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {person.show_photo && person.image_url ? (
                      <img
                        src={person.image_url}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <User size={18} className="text-muted" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-heading truncate">
                        {person.name}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {person.title}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          person.show_photo && person.image_url
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                            : 'bg-surface-alt text-muted border border-border'
                        }`}
                      >
                        {person.show_photo && person.image_url
                          ? 'Photo visible'
                          : 'Photo hidden'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setEditing(person)}
                      disabled={busy}
                      className="text-sm font-medium text-primary hover:underline
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-primary rounded-sm
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(person)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 text-sm font-medium text-danger
                                 hover:underline
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-primary rounded-sm
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {busy && (
                        <Loader2
                          size={12}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      )}
                      Delete
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
// Staff form
// ---------------------------------------------------------------------

function StaffForm({ item, onSuccess, onCancel }) {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    name: item?.name || '',
    title: item?.title || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    show_photo: item?.show_photo || false,
    display_order: item?.display_order ?? 0,
    is_active: item?.is_active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleImageUpload = async (e) => {
    const original = e.target.files?.[0];
    if (!original) return;

    if (!ALLOWED_IMAGE_TYPES.includes(original.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (original.size > MAX_IMAGE_BYTES) {
      setError('Image must be less than 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError('');
    try {
      // Downscale large photos before upload. downscaleImage() never
      // throws — it falls back to the original file on any failure.
      const file = await downscaleImage(original);

      const ext = file.name.split('.').pop();
      const filePath = `staff/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;
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
    setFormData((prev) => ({ ...prev, image_url: '', show_photo: false }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.title.trim()) errors.title = 'Title is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || uploading) return;
    if (!validate()) return;

    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        display_order: parseInt(formData.display_order, 10) || 0,
      };
      if (isEditing) {
        await api.authPut(`/admin/staff/${item.id}`, payload);
      } else {
        await api.authPost('/admin/staff', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save staff member');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-background text-body border border-border-strong rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
    'disabled:opacity-60 disabled:cursor-not-allowed';

  const disabled = saving || uploading;

  return (
    <div className="max-w-2xl mx-auto bg-surface rounded-xl shadow-sm border border-border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-heading">
          {isEditing ? 'Edit Staff Member' : 'New Staff Member'}
        </h2>
        <p className="text-sm text-muted">
          {isEditing
            ? 'Update the details below. Photos are hidden until consent is confirmed.'
            : 'Add a new staff or clergy member. Photos are hidden until consent is confirmed.'}
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
        {/* Name and title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="staff-name"
              className="block text-sm font-medium text-heading mb-1"
            >
              Name <span className="text-danger">*</span>
            </label>
            <input
              id="staff-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={disabled}
              aria-invalid={fieldErrors.name ? 'true' : undefined}
              aria-describedby={fieldErrors.name ? 'staff-name-error' : undefined}
              className={inputClass}
            />
            {fieldErrors.name && (
              <p id="staff-name-error" className="text-xs text-danger mt-1">
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="staff-title"
              className="block text-sm font-medium text-heading mb-1"
            >
              Title <span className="text-danger">*</span>
            </label>
            <input
              id="staff-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Parish Priest"
              disabled={disabled}
              aria-invalid={fieldErrors.title ? 'true' : undefined}
              aria-describedby={
                fieldErrors.title ? 'staff-title-error' : undefined
              }
              className={inputClass}
            />
            {fieldErrors.title && (
              <p id="staff-title-error" className="text-xs text-danger mt-1">
                {fieldErrors.title}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="staff-description"
            className="block text-sm font-medium text-heading mb-1"
          >
            Description
          </label>
          <textarea
            id="staff-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            disabled={disabled}
            className={inputClass}
          />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-heading mb-2">
            Photo
          </label>
          <div className="flex items-center gap-4">
            {formData.image_url ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border shrink-0">
                <img
                  src={formData.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={disabled}
                  className="absolute top-0 right-0 p-1 rounded-full
                             bg-black/60 text-white hover:bg-black/80
                             transition-colors
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-white
                             disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Remove photo"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center text-muted shrink-0">
                <User size={24} aria-hidden="true" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={disabled}
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
                  Uploading photo…
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Photo consent — unchanged behavior, theme-aware styling */}
        <div
          className={`rounded-lg p-4 border ${
            formData.show_photo
              ? 'bg-amber-100/60 border-amber-300 dark:bg-amber-500/15 dark:border-amber-500/30'
              : 'bg-surface-alt border-border'
          }`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="show_photo"
              checked={formData.show_photo}
              onChange={handleChange}
              disabled={disabled}
              className="mt-1 w-4 h-4 accent-primary"
            />
            <div>
              <span className="block text-sm font-semibold text-heading">
                Display photo publicly on the website
              </span>
              <span className="block text-xs text-body mt-1">
                Only enable this after receiving explicit written consent.
                Many staff, especially clergy, prefer not to have photos
                published.
              </span>
            </div>
          </label>
          {formData.show_photo && (
            <p className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200 mt-3 pt-3 border-t border-amber-300/50 dark:border-amber-500/30">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
              Photo will be published on the public Staff page. Confirm
              consent is on file.
            </p>
          )}
        </div>

        {/* Display order and active toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="staff-display-order"
              className="block text-sm font-medium text-heading mb-1"
            >
              Display Order
            </label>
            <input
              id="staff-display-order"
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              disabled={disabled}
              className={inputClass}
            />
            <p className="text-xs text-subtle mt-1">
              Lower numbers appear first
            </p>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                disabled={disabled}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-body">
                Active (visible on site)
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
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
            disabled={disabled}
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
            {saving ? 'Saving…' : isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}