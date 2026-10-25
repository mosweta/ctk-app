/**
 * Gallery Manager.
 *
 * Allows admins to upload multiple images at once, view them, and
 * delete them. Images are stored in the 'media' bucket, and a record
 * is saved in the gallery_images table.
 */

import { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';
import { Upload, Trash2, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);



  const loadImages = async () => {
    setLoading(true);
    try {
      const res = await api.authGet('/admin/gallery');
      setImages(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    loadImages();
  }, []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (const file of files) {
        // Validate each file
        if (!file.type.startsWith('image/')) {
          throw new Error(`"${file.name}" is not an image.`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`"${file.name}" is larger than 5MB.`);
        }

        // Generate path and upload
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save the record to the backend
        await api.authPost('/admin/gallery', {
          caption: caption.trim() || file.name.split('.')[0],
          storage_path: filePath,
        });
      }

      // Reset and reload
      setCaption('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image permanently?')) return;

    try {
      await api.authDelete(`/admin/gallery/${id}`);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
          <p className="text-gray-500 text-sm">Upload and manage parish photos</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Upload New Images</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
            <AlertCircle size={16} className="inline mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption (optional — applied to all files uploaded in this batch)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Family Day 2026"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000]"
            />
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-medium
                         file:bg-[#800000]/10 file:text-[#800000]
                         hover:file:bg-[#800000]/20
                         cursor-pointer"
            />
            {uploading && (
              <p className="text-sm text-[#800000] mt-2 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">
          All Images ({images.length})
        </h3>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#800000] animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative bg-white rounded-xl overflow-hidden
                           shadow-sm border border-gray-200"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={img.url}
                    alt={img.caption || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 truncate">
                    {img.caption || 'No caption'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white
                             opacity-0 group-hover:opacity-100 transition-opacity
                             hover:bg-red-700"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}