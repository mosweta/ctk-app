/**
 * Groups Manager.
 *
 * Manage Small Christian Communities (Jumuiyas), Ecclesial Groups,
 * and Choirs. Each group has a name, category, optional patron saint,
 * optional image, meeting details, coordinator contact, founding year,
 * and a public-visibility toggle.
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
 *   - Large images are downscaled client-side before upload via
 *     src/lib/downscaleImage.js (max 1920px on the longer edge).
 *   - If downscaling fails for any reason, the original file is
 *     uploaded unchanged.
 *
 * Theming:
 *   All surfaces and text use semantic tokens. Works in both light
 *   and dark mode through the .dark class on <html>.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';
import { downscaleImage } from '../../lib/downscaleImage';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  X,
} from 'lucide-react';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const CATEGORY_META = {
  jumuiya: {
    label: 'Jumuiya',
    className: 'bg-primary-light text-primary border border-primary/20',
  },
  ecclesial: {
    label: 'Ecclesial',
    className:
      'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/30',
  },
  choir: {
    label: 'Choir',
    className:
      'bg-green-100 text-green-700 border border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
  },
};

// ---------------------------------------------------------------------
// List component
// ---------------------------------------------------------------------

export default function GroupsManager() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
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
        const res = await api.authGet('/admin/groups');
        if (cancelled || !mountedRef.current) return;
        setGroups(Array.isArray(res.data) ? res.data : []);
        setLoadError('');
      } catch (err) {
        if (cancelled || !mountedRef.current) return;
        setLoadError(err.message || 'Failed to load groups');
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
      const res = await api.authGet('/admin/groups');
      if (!mountedRef.current) return;
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (!mountedRef.current) return;
      setLoadError(err.message || 'Failed to load groups');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const handleDelete = async (group) => {
    if (
      !window.confirm(
        `Delete "${group.name}" permanently? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(group.id);
      return next;
    });

    try {
      await api.authDelete(`/admin/groups/${group.id}`);
      if (!mountedRef.current) return;
      setGroups((prev) => prev.filter((g) => g.id !== group.id));
    } catch (err) {
      if (!mountedRef.current) return;
      alert(err.message || 'Failed to delete group');
    } finally {
      if (mountedRef.current) {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(group.id);
          return next;
        });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGroup(null);
    refresh();
  };

  if (showForm || editingGroup) {
    return (
      <GroupForm
        group={editingGroup}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingGroup(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-heading">
            Groups &amp; Jumuiyas
          </h2>
          <p className="text-muted text-sm">
            Manage Small Christian Communities, Choirs, and Ecclesial Groups.
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
          Add Group
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
          <span className="text-sm text-muted">Loading groups…</span>
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
      ) : groups.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <Users
            size={48}
            className="mx-auto text-muted mb-4"
            aria-hidden="true"
          />
          <p className="text-heading font-medium mb-1">No groups yet</p>
          <p className="text-sm text-muted mb-4">
            Create the first group to get started.
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
            Create the first group
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
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Meeting
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {groups.map((g) => {
                    const busy = deletingIds.has(g.id);
                    const cat = CATEGORY_META[g.category] || {
                      label: g.category || '—',
                      className: 'bg-surface-alt text-muted border border-border',
                    };
                    return (
                      <tr
                        key={g.id}
                        className="hover:bg-surface-alt/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {g.image_url ? (
                              <img
                                src={g.image_url}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div
                                className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center shrink-0"
                                aria-hidden="true"
                              >
                                <Users size={16} className="text-muted" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-heading truncate">
                                {g.name}
                              </p>
                              {g.patron_saint && (
                                <p className="text-xs text-muted truncate">
                                  {g.patron_saint}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cat.className}`}
                          >
                            {cat.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-body">
                          {g.meeting_day ? (
                            <>
                              <p className="truncate">
                                {g.meeting_day}
                                {g.meeting_time ? ` ${g.meeting_time}` : ''}
                              </p>
                              {g.meeting_location && (
                                <p className="text-xs text-muted truncate">
                                  {g.meeting_location}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingGroup(g)}
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
                              onClick={() => handleDelete(g)}
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
            {groups.map((g) => {
              const busy = deletingIds.has(g.id);
              const cat = CATEGORY_META[g.category] || {
                label: g.category || '—',
                className: 'bg-surface-alt text-muted border border-border',
              };
              return (
                <li
                  key={g.id}
                  className="bg-surface rounded-xl border border-border shadow-sm p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {g.image_url ? (
                      <img
                        src={g.image_url}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <Users size={18} className="text-muted" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-heading truncate">
                        {g.name}
                      </p>
                      {g.patron_saint && (
                        <p className="text-xs text-muted truncate">
                          {g.patron_saint}
                        </p>
                      )}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${cat.className}`}
                      >
                        {cat.label}
                      </span>
                    </div>
                  </div>

                  {g.meeting_day && (
                    <p className="text-sm text-body mb-1 truncate">
                      {g.meeting_day}
                      {g.meeting_time ? ` · ${g.meeting_time}` : ''}
                      {g.meeting_location ? ` · ${g.meeting_location}` : ''}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setEditingGroup(g)}
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
                      onClick={() => handleDelete(g)}
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
// Group form
// ---------------------------------------------------------------------

function GroupForm({ group, onSuccess, onCancel }) {
  const isEditing = !!group;
  const [formData, setFormData] = useState({
    name: group?.name || '',
    category: group?.category || 'jumuiya',
    patron_saint: group?.patron_saint || '',
    short_description: group?.short_description || '',
    long_description: group?.long_description || '',
    meeting_day: group?.meeting_day || '',
    meeting_time: group?.meeting_time || '',
    meeting_location: group?.meeting_location || '',
    coordinator_name: group?.coordinator_name || '',
    coordinator_contact: group?.coordinator_contact || '',
    founded_year: group?.founded_year || '',
    image_url: group?.image_url || '',
    is_public: group?.is_public ?? true,
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
      // Downscale large images before upload. downscaleImage() never
      // throws — it falls back to the original file on any failure.
      const file = await downscaleImage(original);

      const ext = file.name.split('.').pop();
      const filePath = `groups/${Date.now()}-${Math.random()
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
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (formData.founded_year) {
      const year = Number(formData.founded_year);
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(year) || year < 1000 || year > currentYear + 1) {
        errors.founded_year = 'Enter a valid year';
      }
    }
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
        founded_year: formData.founded_year
          ? Number(formData.founded_year)
          : null,
      };
      if (isEditing) {
        await api.authPut(`/admin/groups/${group.id}`, payload);
      } else {
        await api.authPost('/admin/groups', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save group');
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
    <div className="max-w-3xl mx-auto bg-surface rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-xl font-bold text-heading mb-6">
        {isEditing ? 'Edit Group' : 'New Group'}
      </h2>

      {error && (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/30 text-danger p-3 rounded-lg mb-4 text-sm"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-heading mb-2">
            Image (Optional)
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
                  aria-label="Remove image"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center text-muted shrink-0">
                <ImageIcon size={20} aria-hidden="true" />
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
                  Uploading image…
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="group-name"
              className="block text-sm font-medium text-heading mb-1"
            >
              Name <span className="text-danger">*</span>
            </label>
            <input
              id="group-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={disabled}
              aria-invalid={fieldErrors.name ? 'true' : undefined}
              aria-describedby={fieldErrors.name ? 'group-name-error' : undefined}
              className={inputClass}
            />
            {fieldErrors.name && (
              <p id="group-name-error" className="text-xs text-danger mt-1">
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="group-category"
              className="block text-sm font-medium text-heading mb-1"
            >
              Category
            </label>
            <select
              id="group-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={disabled}
              className={inputClass}
            >
              <option value="jumuiya">Jumuiya (SCC)</option>
              <option value="ecclesial">Ecclesial Group</option>
              <option value="choir">Choir</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="group-patron"
              className="block text-sm font-medium text-heading mb-1"
            >
              Patron Saint
            </label>
            <input
              id="group-patron"
              name="patron_saint"
              value={formData.patron_saint}
              onChange={handleChange}
              disabled={disabled}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="group-founded"
              className="block text-sm font-medium text-heading mb-1"
            >
              Founded Year
            </label>
            <input
              id="group-founded"
              type="number"
              name="founded_year"
              value={formData.founded_year}
              onChange={handleChange}
              disabled={disabled}
              min={1000}
              max={new Date().getFullYear() + 1}
              aria-invalid={fieldErrors.founded_year ? 'true' : undefined}
              aria-describedby={
                fieldErrors.founded_year ? 'group-founded-error' : undefined
              }
              className={inputClass}
            />
            {fieldErrors.founded_year && (
              <p
                id="group-founded-error"
                className="text-xs text-danger mt-1"
              >
                {fieldErrors.founded_year}
              </p>
            )}
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label
            htmlFor="group-short"
            className="block text-sm font-medium text-heading mb-1"
          >
            Short Description (for cards)
          </label>
          <textarea
            id="group-short"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            rows={2}
            disabled={disabled}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="group-long"
            className="block text-sm font-medium text-heading mb-1"
          >
            Long Description (for detail page)
          </label>
          <textarea
            id="group-long"
            name="long_description"
            value={formData.long_description}
            onChange={handleChange}
            rows={4}
            disabled={disabled}
            className={inputClass}
          />
        </div>

        {/* Meeting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="group-meeting-day"
              className="block text-sm font-medium text-heading mb-1"
            >
              Meeting Day
            </label>
            <input
              id="group-meeting-day"
              name="meeting_day"
              value={formData.meeting_day}
              onChange={handleChange}
              placeholder="e.g. Every 2nd Sunday"
              disabled={disabled}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="group-meeting-time"
              className="block text-sm font-medium text-heading mb-1"
            >
              Meeting Time
            </label>
            <input
              id="group-meeting-time"
              name="meeting_time"
              value={formData.meeting_time}
              onChange={handleChange}
              placeholder="e.g. 4:00 PM"
              disabled={disabled}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="group-meeting-location"
              className="block text-sm font-medium text-heading mb-1"
            >
              Location
            </label>
            <input
              id="group-meeting-location"
              name="meeting_location"
              value={formData.meeting_location}
              onChange={handleChange}
              placeholder="e.g. Block 5"
              disabled={disabled}
              className={inputClass}
            />
          </div>
        </div>

        {/* Coordinator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="group-coord-name"
              className="block text-sm font-medium text-heading mb-1"
            >
              Coordinator Name
            </label>
            <input
              id="group-coord-name"
              name="coordinator_name"
              value={formData.coordinator_name}
              onChange={handleChange}
              disabled={disabled}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="group-coord-contact"
              className="block text-sm font-medium text-heading mb-1"
            >
              Contact (phone/email)
            </label>
            <input
              id="group-coord-contact"
              name="coordinator_contact"
              value={formData.coordinator_contact}
              onChange={handleChange}
              disabled={disabled}
              className={inputClass}
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="group-is-public"
            name="is_public"
            checked={formData.is_public}
            onChange={handleChange}
            disabled={disabled}
            className="w-4 h-4 accent-primary"
          />
          <label
            htmlFor="group-is-public"
            className="text-sm text-body"
          >
            Show on public website
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className="px-4 py-2 text-body hover:bg-surface-alt rounded-lg font-medium
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
                       bg-primary text-on-primary text-sm font-semibold
                       hover:bg-primary-hover transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {saving && (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            )}
            {saving ? 'Saving…' : 'Save Group'}
          </button>
        </div>
      </form>
    </div>
  );
}