/**
 * Gallery Manager.
 *
 * Allows admins to upload multiple images at once, view them, and
 * delete them. Images are stored in the 'media' bucket, and a record
 * is saved in the gallery_images table.
 *
 * Loading flow:
 *   - `loading` starts true; the mount effect only sets state AFTER
 *     the fetch settles, which avoids react-hooks/set-state-in-effect.
 *   - Refreshes triggered by user actions (retry, post-upload) call
 *     `refresh()` which explicitly sets loading true.
 *
 * Upload flow:
 *   - Files are staged in `pendingFiles` with a per-image title.
 *   - Titles are prefilled from the filename (extension removed,
 *     separators replaced with spaces) and editable.
 *   - Titles can be removed from the batch or the whole batch
 *     cancelled before upload.
 *   - Large images are downscaled client-side before upload via
 *     src/lib/downscaleImage.js. If downscaling fails, the original
 *     file is uploaded.
 *   - Each image is uploaded via the backend API (/admin/upload), then 
 *     its record is created via POST /admin/gallery.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';
import { downscaleImage } from '../../lib/downscaleImage';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Turn a raw filename into a human-friendly title.
 * "WhatsAppImage3.jpg" -> "WhatsAppImage3"
 * "family_day_2026-03.png" -> "family day 2026 03"
 */
function titleFromFilename(filename) {
  const noExt = filename.replace(/\.[^.]+$/, '');
  return noExt
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Upload batch state.
  const [pendingFiles, setPendingFiles] = useState([]); // [{ id, file, title }]
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Per-image delete busy state.
  const [deletingIds, setDeletingIds] = useState(() => new Set());

  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initial load. All setState after the await, so no synchronous
  // state updates in the effect body.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.authGet('/admin/gallery');
        if (cancelled || !mountedRef.current) return;
        setImages(Array.isArray(res.data) ? res.data : []);
        setLoadError('');
      } catch (err) {
        if (cancelled || !mountedRef.current) return;
        setLoadError(err.message || 'Failed to load gallery');
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Explicit refresh used by retry and post-upload.
  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await api.authGet('/admin/gallery');
      if (!mountedRef.current) return;
      setImages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (!mountedRef.current) return;
      setLoadError(err.message || 'Failed to load gallery');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // ---- File selection ----------------------------------------------

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError('');

    // Validate and stage each file. Invalid files are dropped with a
    // single error listing them; valid files proceed.
    const invalid = [];
    const staged = [];

    files.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        invalid.push(
          `"${file.name}" is not a supported image (use JPEG, PNG, or WebP).`
        );
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        invalid.push(`"${file.name}" is larger than 5 MB.`);
        return;
      }
      staged.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        title: titleFromFilename(file.name),
      });
    });

    if (invalid.length > 0) {
      setUploadError(invalid.join(' '));
    }

    if (staged.length > 0) {
      setPendingFiles((prev) => [...prev, ...staged]);
    }

    // Reset the input so the same file can be selected again later.
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updatePendingTitle = (id, title) => {
    setPendingFiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title } : p))
    );
  };

  const removePendingFile = (id) => {
    setPendingFiles((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPending = () => {
    setPendingFiles([]);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ---- Upload ------------------------------------------------------

  const handleUploadBatch = async () => {
    if (uploading || pendingFiles.length === 0) return;

    const items = pendingFiles.map((p) => ({
      ...p,
      title: (p.title || '').trim() || titleFromFilename(p.file.name),
    }));

    if (items.some((i) => !i.title)) {
      setUploadError('Each image needs a title.');
      return;
    }

    setUploading(true);
    setUploadError('');

    const failures = [];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiBase = import.meta.env.VITE_API_URL;

      for (const item of items) {
        try {
          // Downscale large images before upload. Never throws —
          // falls back to the original file on any failure.
          const uploadFile = await downscaleImage(item.file);

          // 1. Upload the file to the backend
          const formData = new FormData();
          formData.append('file', uploadFile);
          formData.append('folder', 'gallery');

          const uploadRes = await fetch(`${apiBase}/admin/upload`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: formData,
          });

          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');

          // 2. Save the record in the database
          await api.authPost('/admin/gallery', {
            caption: item.title,
            storage_path: uploadData.data.path,
          });
        } catch (err) {
          failures.push(
            `"${item.file.name}": ${err.message || 'upload failed'}`
          );
        }
      }
    } catch (err) {
      // Safety net — the per-file catch above should prevent this,
      // but if something outside the loop throws we still land here.
      failures.push(err.message || 'Unexpected upload error');
    } finally {
      // No return here — the mountedRef guard wraps the state updates.
      if (mountedRef.current) {
        setUploading(false);

        if (failures.length > 0) {
          setUploadError(
            `${failures.length} of ${items.length} upload${
              items.length === 1 ? '' : 's'
            } failed. ${failures.join(' ')}`
          );
          setPendingFiles((prev) =>
            prev.filter((p) => {
              const succeeded = !failures.some((f) =>
                f.startsWith(`"${p.file.name}":`)
              );
              return !succeeded;
            })
          );
        } else {
          clearPending();
        }

        await refresh();
      }
    }
  };

  // ---- Delete ------------------------------------------------------

  const handleDelete = async (image) => {
    if (
      !window.confirm(
        `Delete "${image.caption || 'this image'}" permanently? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(image.id);
      return next;
    });

    try {
      await api.authDelete(`/admin/gallery/${image.id}`);
      if (!mountedRef.current) return;
      setImages((prev) => prev.filter((img) => img.id !== image.id));
    } catch (err) {
      if (!mountedRef.current) return;
      alert(err.message || 'Failed to delete image');
    } finally {
      if (mountedRef.current) {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(image.id);
          return next;
        });
      }
    }
  };

  // ---- Render ------------------------------------------------------

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-heading">Gallery</h2>
          <p className="text-muted text-sm">
            Upload and manage parish photos. Each image can have its own
            title that appears on the public photo album. Large images
            are automatically resized before upload.
          </p>
        </div>
      </div>

      {/* Upload panel */}
      <div className="bg-surface rounded-xl shadow-sm border border-border p-6 mb-8">
        <h3 className="font-semibold text-heading mb-1">Upload New Images</h3>
        <p className="text-sm text-muted mb-4">
          Select one or more images, then give each one a title. Titles
          appear below the photo on the public gallery.
        </p>

        {uploadError && (
          <div
            role="alert"
            className="bg-red-500/10 border border-red-500/30 text-danger p-3 rounded-lg text-sm mb-4 flex items-start gap-2"
          >
            <AlertCircle
              size={16}
              className="shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{uploadError}</span>
          </div>
        )}

        {/* File input */}
        <div>
          <label
            htmlFor="gallery-upload"
            className="block text-sm font-medium text-heading mb-2"
          >
            Select images
          </label>
          <input
            id="gallery-upload"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
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
            JPEG, PNG, or WebP. Max 5 MB per image (before resizing).
          </p>
        </div>

        {/* Staged batch */}
        {pendingFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-heading">
                {pendingFiles.length} image
                {pendingFiles.length === 1 ? '' : 's'} ready to upload
              </p>
              <button
                type="button"
                onClick={clearPending}
                disabled={uploading}
                className="text-xs text-muted hover:text-danger transition-colors
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-primary rounded-sm px-1 py-0.5
                           disabled:opacity-50"
              >
                Cancel all
              </button>
            </div>

            <ul className="space-y-2">
              {pendingFiles.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface-alt"
                >
                  <img
                    src={URL.createObjectURL(p.file)}
                    alt=""
                    className="w-14 h-14 rounded object-cover shrink-0"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted truncate mb-1">
                      {p.file.name}
                    </p>
                    <label htmlFor={`title-${p.id}`} className="sr-only">
                      Image title for {p.file.name}
                    </label>
                    <input
                      id={`title-${p.id}`}
                      type="text"
                      value={p.title}
                      onChange={(e) =>
                        updatePendingTitle(p.id, e.target.value)
                      }
                      disabled={uploading}
                      placeholder="Image title"
                      className="w-full px-2 py-1.5 bg-background text-body
                                 border border-border-strong rounded-md text-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary
                                 disabled:opacity-60"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePendingFile(p.id)}
                    disabled={uploading}
                    className="p-2 text-muted hover:text-danger rounded
                               focus-visible:outline-none focus-visible:ring-2
                               focus-visible:ring-primary
                               disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Remove ${p.file.name} from the batch`}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleUploadBatch}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-primary text-on-primary text-sm font-semibold
                         hover:bg-primary-hover transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {uploading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload size={16} aria-hidden="true" />
                  Upload {pendingFiles.length}{' '}
                  {pendingFiles.length === 1 ? 'image' : 'images'}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* All images */}
      <div>
        <h3 className="font-semibold text-heading mb-3">
          All Images ({images.length})
        </h3>

        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3 bg-surface rounded-xl border border-border"
            role="status"
            aria-live="polite"
          >
            <Loader2
              className="w-8 h-8 text-primary animate-spin"
              aria-hidden="true"
            />
            <span className="text-sm text-muted">Loading gallery…</span>
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
                         transition-colors shrink-0"
            >
              Try again
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-xl border border-border">
            <ImageIcon
              size={48}
              className="mx-auto text-muted mb-4"
              aria-hidden="true"
            />
            <p className="text-heading font-medium mb-1">No images yet</p>
            <p className="text-sm text-muted">
              Upload your first photos above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => {
              const busy = deletingIds.has(img.id);
              const title = img.caption || 'Untitled image';
              return (
                <div
                  key={img.id}
                  className="group relative bg-surface rounded-xl overflow-hidden shadow-sm border border-border"
                >
                  <div className="aspect-square overflow-hidden bg-surface-alt">
                    <img
                      src={img.url}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-body truncate" title={title}>
                      {title}
                    </p>
                  </div>
                  {/* Delete button: visible always on touch, on hover on desktop */}
                  <button
                    type="button"
                    onClick={() => handleDelete(img)}
                    disabled={busy}
                    className="absolute top-2 right-2 p-1.5 rounded-full
                               bg-red-600 text-white hover:bg-red-700
                               opacity-100 md:opacity-0 md:group-hover:opacity-100
                               md:focus-visible:opacity-100 transition-opacity
                               focus-visible:outline-none focus-visible:ring-2
                               focus-visible:ring-white
                               disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label={`Delete ${title}`}
                    title="Delete"
                  >
                    {busy ? (
                      <Loader2
                        size={14}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Trash2 size={14} aria-hidden="true" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}